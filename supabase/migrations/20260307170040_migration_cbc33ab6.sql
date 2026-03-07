ALTER TABLE vendor_products
ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255),
ADD COLUMN IF NOT EXISTS seo_description TEXT,
ADD COLUMN IF NOT EXISTS aggregated_rating DECIMAL(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;

-- Create an aggregated reviews table for cross-platform reviews
CREATE TABLE IF NOT EXISTS product_aggregated_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES vendor_products(id) ON DELETE CASCADE,
    source_platform VARCHAR(50) NOT NULL, -- e.g., 'amazon', 'flipkart'
    reviewer_name VARCHAR(100),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    review_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_aggregated_reviews(product_id);