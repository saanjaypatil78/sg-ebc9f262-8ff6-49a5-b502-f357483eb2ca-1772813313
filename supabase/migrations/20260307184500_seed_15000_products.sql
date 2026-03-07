-- Seed 15,000+ Mock Products
-- This migration populates the database with realistic e-commerce products

-- First, ensure we have at least one vendor
INSERT INTO vendors (id, user_id, business_name, business_email, business_phone, gst_number, pan_number, status)
VALUES 
  (gen_random_uuid(), (SELECT id FROM auth.users LIMIT 1), 'Bravecom Marketplace', 'vendor@bravecom.in', '+919876543210', '27AABCU9603R1ZM', 'AABCU9603R', 'approved')
ON CONFLICT (business_email) DO NOTHING;

-- Get vendor ID
DO $$
DECLARE
  v_vendor_id UUID;
  v_product_id UUID;
  v_counter INT := 0;
  v_category TEXT;
  v_subcategory TEXT;
  v_brand TEXT;
  v_price DECIMAL;
  v_mrp DECIMAL;
  v_rating DECIMAL;
  v_review_count INT;
BEGIN
  SELECT id INTO v_vendor_id FROM vendors LIMIT 1;

  -- Electronics Products (3000)
  FOR i IN 1..3000 LOOP
    v_counter := v_counter + 1;
    v_category := 'Electronics';
    v_subcategory := CASE (i % 3)
      WHEN 0 THEN 'Smartphones'
      WHEN 1 THEN 'Laptops'
      ELSE 'Accessories'
    END;
    
    v_brand := CASE (i % 5)
      WHEN 0 THEN 'Samsung'
      WHEN 1 THEN 'Xiaomi'
      WHEN 2 THEN 'realme'
      WHEN 3 THEN 'OnePlus'
      ELSE 'Vivo'
    END;

    v_mrp := 10000 + (random() * 50000)::INT;
    v_price := v_mrp * (0.7 + random() * 0.2);
    v_rating := 3.5 + random() * 1.5;
    v_review_count := 15 + (random() * 485)::INT;

    INSERT INTO products (
      vendor_id, product_name, description, category, subcategory,
      price, mrp, discount_percentage, stock_quantity, sku,
      images, specifications, aggregated_rating, review_count, tags, brand, status
    ) VALUES (
      v_vendor_id,
      v_brand || ' ' || v_subcategory || ' Pro ' || v_counter,
      'Premium quality ' || v_subcategory || ' with latest features. Fast performance, long battery life, and stunning display.',
      v_category,
      v_subcategory,
      v_price,
      v_mrp,
      ((v_mrp - v_price) / v_mrp * 100)::INT,
      20 + (random() * 80)::INT,
      'ELEC' || LPAD(v_counter::TEXT, 7, '0'),
      ARRAY[
        'https://picsum.photos/seed/' || v_counter || '/800/800',
        'https://picsum.photos/seed/' || (v_counter + 10000) || '/800/800',
        'https://picsum.photos/seed/' || (v_counter + 20000) || '/800/800'
      ],
      jsonb_build_object('Brand', v_brand, 'Warranty', '1 Year', 'Origin', 'India'),
      v_rating,
      v_review_count,
      ARRAY['trending', 'bestseller', lower(v_brand)],
      v_brand,
      'published'
    );
  END LOOP;

  -- Fashion Products (4000)
  FOR i IN 1..4000 LOOP
    v_counter := v_counter + 1;
    v_category := 'Fashion';
    v_subcategory := CASE (i % 4)
      WHEN 0 THEN 'Men''s Wear'
      WHEN 1 THEN 'Women''s Wear'
      WHEN 2 THEN 'Kids Wear'
      ELSE 'Ethnic Wear'
    END;
    
    v_brand := CASE (i % 6)
      WHEN 0 THEN 'Roadster'
      WHEN 1 THEN 'H&M'
      WHEN 2 THEN 'Libas'
      WHEN 3 THEN 'Biba'
      WHEN 4 THEN 'Allen Solly'
      ELSE 'W'
    END;

    v_mrp := 500 + (random() * 3000)::INT;
    v_price := v_mrp * (0.5 + random() * 0.3);
    v_rating := 3.5 + random() * 1.5;
    v_review_count := 20 + (random() * 280)::INT;

    INSERT INTO products (
      vendor_id, product_name, description, category, subcategory,
      price, mrp, discount_percentage, stock_quantity, sku,
      images, specifications, aggregated_rating, review_count, tags, brand, status
    ) VALUES (
      v_vendor_id,
      v_brand || ' Premium ' || v_subcategory || ' Collection ' || v_counter,
      'Stylish and comfortable fashion wear. Premium fabric, perfect fit, and latest design trends.',
      v_category,
      v_subcategory,
      v_price,
      v_mrp,
      ((v_mrp - v_price) / v_mrp * 100)::INT,
      30 + (random() * 120)::INT,
      'FASH' || LPAD(v_counter::TEXT, 7, '0'),
      ARRAY[
        'https://picsum.photos/seed/' || v_counter || '/800/800',
        'https://picsum.photos/seed/' || (v_counter + 10000) || '/800/800',
        'https://picsum.photos/seed/' || (v_counter + 20000) || '/800/800'
      ],
      jsonb_build_object('Brand', v_brand, 'Material', 'Cotton Blend', 'Care', 'Machine Wash'),
      v_rating,
      v_review_count,
      ARRAY['fashion', 'trending', lower(v_brand)],
      v_brand,
      'published'
    );
  END LOOP;

  -- Home & Kitchen Products (2500)
  FOR i IN 1..2500 LOOP
    v_counter := v_counter + 1;
    v_category := 'Home & Kitchen';
    v_subcategory := CASE (i % 4)
      WHEN 0 THEN 'Home Appliances'
      WHEN 1 THEN 'Home Decor'
      WHEN 2 THEN 'Kitchen Essentials'
      ELSE 'Furniture'
    END;
    
    v_brand := CASE (i % 5)
      WHEN 0 THEN 'Philips'
      WHEN 1 THEN 'Bajaj'
      WHEN 2 THEN 'Prestige'
      WHEN 3 THEN 'Butterfly'
      ELSE 'Havells'
    END;

    v_mrp := 1000 + (random() * 5000)::INT;
    v_price := v_mrp * (0.6 + random() * 0.25);
    v_rating := 3.5 + random() * 1.5;
    v_review_count := 25 + (random() * 225)::INT;

    INSERT INTO products (
      vendor_id, product_name, description, category, subcategory,
      price, mrp, discount_percentage, stock_quantity, sku,
      images, specifications, aggregated_rating, review_count, tags, brand, status
    ) VALUES (
      v_vendor_id,
      v_brand || ' ' || v_subcategory || ' Pro Series ' || v_counter,
      'Premium quality home products. Durable, energy efficient, and modern design for your home.',
      v_category,
      v_subcategory,
      v_price,
      v_mrp,
      ((v_mrp - v_price) / v_mrp * 100)::INT,
      15 + (random() * 65)::INT,
      'HOME' || LPAD(v_counter::TEXT, 7, '0'),
      ARRAY[
        'https://picsum.photos/seed/' || v_counter || '/800/800',
        'https://picsum.photos/seed/' || (v_counter + 10000) || '/800/800',
        'https://picsum.photos/seed/' || (v_counter + 20000) || '/800/800'
      ],
      jsonb_build_object('Brand', v_brand, 'Warranty', '1 Year', 'Power', '220V'),
      v_rating,
      v_review_count,
      ARRAY['home', 'appliances', lower(v_brand)],
      v_brand,
      'published'
    );
  END LOOP;

  -- Beauty & Personal Care (2000)
  FOR i IN 1..2000 LOOP
    v_counter := v_counter + 1;
    v_category := 'Beauty & Personal Care';
    v_subcategory := CASE (i % 4)
      WHEN 0 THEN 'Skincare'
      WHEN 1 THEN 'Makeup'
      WHEN 2 THEN 'Haircare'
      ELSE 'Grooming'
    END;
    
    v_brand := CASE (i % 6)
      WHEN 0 THEN 'Minimalist'
      WHEN 1 THEN 'Dot & Key'
      WHEN 2 THEN 'Plum'
      WHEN 3 THEN 'Maybelline'
      WHEN 4 THEN 'Lakme'
      ELSE 'Sugar'
    END;

    v_mrp := 300 + (random() * 1500)::INT;
    v_price := v_mrp * (0.65 + random() * 0.25);
    v_rating := 3.8 + random() * 1.2;
    v_review_count := 30 + (random() * 370)::INT;

    INSERT INTO products (
      vendor_id, product_name, description, category, subcategory,
      price, mrp, discount_percentage, stock_quantity, sku,
      images, specifications, aggregated_rating, review_count, tags, brand, status
    ) VALUES (
      v_vendor_id,
      v_brand || ' ' || v_subcategory || ' Essentials ' || v_counter,
      'Premium beauty products. Dermatologically tested, cruelty-free, and suitable for all skin types.',
      v_category,
      v_subcategory,
      v_price,
      v_mrp,
      ((v_mrp - v_price) / v_mrp * 100)::INT,
      25 + (random() * 95)::INT,
      'BEAU' || LPAD(v_counter::TEXT, 7, '0'),
      ARRAY[
        'https://picsum.photos/seed/' || v_counter || '/800/800',
        'https://picsum.photos/seed/' || (v_counter + 10000) || '/800/800',
        'https://picsum.photos/seed/' || (v_counter + 20000) || '/800/800'
      ],
      jsonb_build_object('Brand', v_brand, 'Type', v_subcategory, 'Cruelty Free', 'Yes'),
      v_rating,
      v_review_count,
      ARRAY['beauty', 'skincare', lower(v_brand)],
      v_brand,
      'published'
    );
  END LOOP;

  -- Sports & Fitness (1500)
  FOR i IN 1..1500 LOOP
    v_counter := v_counter + 1;
    v_category := 'Sports & Fitness';
    v_subcategory := CASE (i % 3)
      WHEN 0 THEN 'Equipment'
      WHEN 1 THEN 'Sportswear'
      ELSE 'Supplements'
    END;
    
    v_brand := CASE (i % 5)
      WHEN 0 THEN 'Nike'
      WHEN 1 THEN 'Adidas'
      WHEN 2 THEN 'Puma'
      WHEN 3 THEN 'Decathlon'
      ELSE 'MuscleBlaze'
    END;

    v_mrp := 800 + (random() * 4000)::INT;
    v_price := v_mrp * (0.6 + random() * 0.25);
    v_rating := 3.5 + random() * 1.5;
    v_review_count := 18 + (random() * 182)::INT;

    INSERT INTO products (
      vendor_id, product_name, description, category, subcategory,
      price, mrp, discount_percentage, stock_quantity, sku,
      images, specifications, aggregated_rating, review_count, tags, brand, status
    ) VALUES (
      v_vendor_id,
      v_brand || ' ' || v_subcategory || ' Pro ' || v_counter,
      'High-quality sports products for fitness enthusiasts. Durable, comfortable, and performance-oriented.',
      v_category,
      v_subcategory,
      v_price,
      v_mrp,
      ((v_mrp - v_price) / v_mrp * 100)::INT,
      10 + (random() * 40)::INT,
      'SPRT' || LPAD(v_counter::TEXT, 7, '0'),
      ARRAY[
        'https://picsum.photos/seed/' || v_counter || '/800/800',
        'https://picsum.photos/seed/' || (v_counter + 10000) || '/800/800'
      ],
      jsonb_build_object('Brand', v_brand, 'Type', v_subcategory, 'Quality', 'Premium'),
      v_rating,
      v_review_count,
      ARRAY['sports', 'fitness', lower(v_brand)],
      v_brand,
      'published'
    );
  END LOOP;

  -- Books & Media (1000)
  FOR i IN 1..1000 LOOP
    v_counter := v_counter + 1;
    v_category := 'Books & Media';
    v_subcategory := CASE (i % 3)
      WHEN 0 THEN 'Fiction'
      WHEN 1 THEN 'Non-Fiction'
      ELSE 'Educational'
    END;
    
    v_brand := CASE (i % 5)
      WHEN 0 THEN 'Penguin'
      WHEN 1 THEN 'HarperCollins'
      WHEN 2 THEN 'Scholastic'
      WHEN 3 THEN 'Pearson'
      ELSE 'Oxford'
    END;

    v_mrp := 200 + (random() * 800)::INT;
    v_price := v_mrp * (0.7 + random() * 0.2);
    v_rating := 3.8 + random() * 1.2;
    v_review_count := 25 + (random() * 175)::INT;

    INSERT INTO products (
      vendor_id, product_name, description, category, subcategory,
      price, mrp, discount_percentage, stock_quantity, sku,
      images, specifications, aggregated_rating, review_count, tags, brand, status
    ) VALUES (
      v_vendor_id,
      v_brand || ' ' || v_subcategory || ' Collection ' || v_counter,
      'Quality books and media content. Engaging stories, educational material, and timeless classics.',
      v_category,
      v_subcategory,
      v_price,
      v_mrp,
      ((v_mrp - v_price) / v_mrp * 100)::INT,
      50 + (random() * 150)::INT,
      'BOOK' || LPAD(v_counter::TEXT, 7, '0'),
      ARRAY[
        'https://picsum.photos/seed/' || v_counter || '/800/800',
        'https://picsum.photos/seed/' || (v_counter + 10000) || '/800/800'
      ],
      jsonb_build_object('Publisher', v_brand, 'Type', v_subcategory, 'Language', 'English'),
      v_rating,
      v_review_count,
      ARRAY['books', 'reading', lower(v_brand)],
      v_brand,
      'published'
    );
  END LOOP;

  -- Toys & Baby Products (1000)
  FOR i IN 1..1000 LOOP
    v_counter := v_counter + 1;
    v_category := 'Toys & Baby Products';
    v_subcategory := CASE (i % 3)
      WHEN 0 THEN 'Toys'
      WHEN 1 THEN 'Baby Care'
      ELSE 'Educational Toys'
    END;
    
    v_brand := CASE (i % 5)
      WHEN 0 THEN 'Fisher-Price'
      WHEN 1 THEN 'Lego'
      WHEN 2 THEN 'Hasbro'
      WHEN 3 THEN 'Mee Mee'
      ELSE 'Chicco'
    END;

    v_mrp := 400 + (random() * 2500)::INT;
    v_price := v_mrp * (0.6 + random() * 0.25);
    v_rating := 3.7 + random() * 1.3;
    v_review_count := 22 + (random() * 178)::INT;

    INSERT INTO products (
      vendor_id, product_name, description, category, subcategory,
      price, mrp, discount_percentage, stock_quantity, sku,
      images, specifications, aggregated_rating, review_count, tags, brand, status
    ) VALUES (
      v_vendor_id,
      v_brand || ' ' || v_subcategory || ' Series ' || v_counter,
      'Safe and engaging products for kids. Non-toxic materials, age-appropriate, and educational value.',
      v_category,
      v_subcategory,
      v_price,
      v_mrp,
      ((v_mrp - v_price) / v_mrp * 100)::INT,
      35 + (random() * 85)::INT,
      'TOYS' || LPAD(v_counter::TEXT, 7, '0'),
      ARRAY[
        'https://picsum.photos/seed/' || v_counter || '/800/800',
        'https://picsum.photos/seed/' || (v_counter + 10000) || '/800/800'
      ],
      jsonb_build_object('Brand', v_brand, 'Age Range', '3-10 years', 'Safety', 'CE Certified'),
      v_rating,
      v_review_count,
      ARRAY['toys', 'kids', lower(v_brand)],
      v_brand,
      'published'
    );
  END LOOP;

  RAISE NOTICE 'Successfully seeded % products!', v_counter;
END $$;