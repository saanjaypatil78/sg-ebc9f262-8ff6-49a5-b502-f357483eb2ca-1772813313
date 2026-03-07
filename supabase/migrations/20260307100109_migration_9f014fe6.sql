-- Function to automatically create agreement when investment is made
CREATE OR REPLACE FUNCTION create_investment_agreement()
RETURNS TRIGGER AS $$
DECLARE
  v_agreement_number VARCHAR(50);
  v_end_date DATE;
  v_total_profit DECIMAL(15,2);
  v_total_payout DECIMAL(15,2);
BEGIN
  -- Generate unique agreement number
  v_agreement_number := 'AGR-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || SUBSTRING(NEW.id::TEXT, 1, 8);
  
  -- Calculate end date (exactly 12 months)
  v_end_date := (NEW.investment_date + INTERVAL '12 months')::DATE;
  
  -- Calculate expected profit (15% × 12 months = 180%)
  v_total_profit := NEW.amount * 0.15 * 12;
  
  -- Calculate total payout (principal + profit)
  v_total_payout := NEW.amount + v_total_profit;
  
  -- Insert agreement record
  INSERT INTO investment_agreements (
    investment_id,
    agreement_number,
    agreement_date,
    start_date,
    end_date,
    monthly_roi_rate,
    total_months,
    principal_amount,
    total_expected_profit,
    total_expected_payout,
    agreement_status
  ) VALUES (
    NEW.id,
    v_agreement_number,
    CURRENT_DATE,
    NEW.investment_date,
    v_end_date,
    15.00,
    12,
    NEW.amount,
    v_total_profit,
    v_total_payout,
    'ACTIVE'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create agreement automatically
DROP TRIGGER IF EXISTS trigger_create_investment_agreement ON investments;
CREATE TRIGGER trigger_create_investment_agreement
  AFTER INSERT ON investments
  FOR EACH ROW
  EXECUTE FUNCTION create_investment_agreement();

COMMENT ON FUNCTION create_investment_agreement IS 'Auto-creates 12-month notarized agreement when investment is created';