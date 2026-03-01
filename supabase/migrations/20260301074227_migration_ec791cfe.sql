-- Create function to generate unique order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text AS $$
DECLARE
  new_number text;
  exists boolean;
BEGIN
  LOOP
    new_number := 'ORD-' || to_char(now(), 'YYYYMMDD') || '-' || LPAD(floor(random() * 10000)::text, 4, '0');
    SELECT EXISTS(SELECT 1 FROM orders WHERE order_number = new_number) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Create function to generate unique return number
CREATE OR REPLACE FUNCTION generate_return_number()
RETURNS text AS $$
DECLARE
  new_number text;
  exists boolean;
BEGIN
  LOOP
    new_number := 'RET-' || to_char(now(), 'YYYYMMDD') || '-' || LPAD(floor(random() * 10000)::text, 4, '0');
    SELECT EXISTS(SELECT 1 FROM returns WHERE return_number = new_number) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Create function to generate unique settlement number
CREATE OR REPLACE FUNCTION generate_settlement_number()
RETURNS text AS $$
DECLARE
  new_number text;
  exists boolean;
BEGIN
  LOOP
    new_number := 'SET-' || to_char(now(), 'YYYYMM') || '-' || LPAD(floor(random() * 10000)::text, 4, '0');
    SELECT EXISTS(SELECT 1 FROM settlements WHERE settlement_number = new_number) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate order number
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

-- Trigger to auto-generate return number
CREATE OR REPLACE FUNCTION set_return_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.return_number IS NULL THEN
    NEW.return_number := generate_return_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_return_number
  BEFORE INSERT ON returns
  FOR EACH ROW
  EXECUTE FUNCTION set_return_number();

-- Trigger to auto-generate settlement number
CREATE OR REPLACE FUNCTION set_settlement_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.settlement_number IS NULL THEN
    NEW.settlement_number := generate_settlement_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_settlement_number
  BEFORE INSERT ON settlements
  FOR EACH ROW
  EXECUTE FUNCTION set_settlement_number();

-- Trigger to calculate commission on order
CREATE OR REPLACE FUNCTION calculate_order_commission()
RETURNS TRIGGER AS $$
DECLARE
  vendor_commission decimal(5,2);
BEGIN
  SELECT commission_rate INTO vendor_commission
  FROM vendors WHERE id = NEW.vendor_id;
  
  NEW.commission_amount := (NEW.total_amount * vendor_commission / 100);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_commission
  BEFORE INSERT OR UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION calculate_order_commission();

-- Trigger to check delivery timeline and set is_on_time
CREATE OR REPLACE FUNCTION check_delivery_timeline()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.actual_delivery_date IS NOT NULL AND NEW.expected_delivery_date IS NOT NULL THEN
    NEW.is_on_time := NEW.actual_delivery_date <= NEW.expected_delivery_date;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_delivery
  BEFORE UPDATE ON orders
  FOR EACH ROW
  WHEN (NEW.status = 'delivered')
  EXECUTE FUNCTION check_delivery_timeline();

-- Trigger to update vendor performance when order is delivered
CREATE OR REPLACE FUNCTION update_vendor_performance()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
    UPDATE vendors
    SET 
      total_orders = total_orders + 1,
      on_time_deliveries = CASE 
        WHEN NEW.is_on_time THEN on_time_deliveries + 1 
        ELSE on_time_deliveries 
      END,
      performance_score = (
        (on_time_deliveries + CASE WHEN NEW.is_on_time THEN 1 ELSE 0 END) * 100.0 / 
        NULLIF(total_orders + 1, 0)
      )
    WHERE id = NEW.vendor_id;
    
    -- Log daily performance
    INSERT INTO vendor_performance_logs (vendor_id, date, total_orders, on_time_deliveries, late_deliveries, on_time_rate)
    VALUES (
      NEW.vendor_id,
      CURRENT_DATE,
      1,
      CASE WHEN NEW.is_on_time THEN 1 ELSE 0 END,
      CASE WHEN NEW.is_on_time THEN 0 ELSE 1 END,
      CASE WHEN NEW.is_on_time THEN 100.0 ELSE 0.0 END
    )
    ON CONFLICT (vendor_id, date) 
    DO UPDATE SET
      total_orders = vendor_performance_logs.total_orders + 1,
      on_time_deliveries = vendor_performance_logs.on_time_deliveries + CASE WHEN NEW.is_on_time THEN 1 ELSE 0 END,
      late_deliveries = vendor_performance_logs.late_deliveries + CASE WHEN NEW.is_on_time THEN 0 ELSE 1 END,
      on_time_rate = (
        (vendor_performance_logs.on_time_deliveries + CASE WHEN NEW.is_on_time THEN 1 ELSE 0 END) * 100.0 /
        NULLIF(vendor_performance_logs.total_orders + 1, 0)
      );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_performance
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_vendor_performance();

-- Trigger to track returns and update vendor stats
CREATE OR REPLACE FUNCTION update_vendor_returns()
RETURNS TRIGGER AS $$
DECLARE
  vendor_orders integer;
  vendor_returns_count integer;
  return_rate decimal(5,2);
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    -- Get vendor from order
    SELECT vendor_id INTO NEW.vendor_id FROM orders WHERE id = NEW.order_id;
    
    -- Update vendor return count
    UPDATE vendors v
    SET total_returns = total_returns + 1
    WHERE id = NEW.vendor_id;
    
    -- Calculate if within 10% limit
    SELECT total_orders, total_returns INTO vendor_orders, vendor_returns_count
    FROM vendors WHERE id = NEW.vendor_id;
    
    return_rate := (vendor_returns_count * 100.0 / NULLIF(vendor_orders, 0));
    NEW.is_within_limit := return_rate <= 10.0;
    
    -- Log daily returns
    INSERT INTO vendor_performance_logs (vendor_id, date, returns_count, return_rate)
    VALUES (
      NEW.vendor_id,
      CURRENT_DATE,
      1,
      return_rate
    )
    ON CONFLICT (vendor_id, date)
    DO UPDATE SET
      returns_count = vendor_performance_logs.returns_count + 1,
      return_rate = (
        (vendor_performance_logs.returns_count + 1) * 100.0 /
        NULLIF((SELECT total_orders FROM vendors WHERE id = NEW.vendor_id), 0)
      );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_returns
  BEFORE INSERT OR UPDATE ON returns
  FOR EACH ROW
  EXECUTE FUNCTION update_vendor_returns();

-- Trigger to auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_vendors_updated_at
  BEFORE UPDATE ON vendors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_returns_updated_at
  BEFORE UPDATE ON returns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_settlements_updated_at
  BEFORE UPDATE ON settlements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();