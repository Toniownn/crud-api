-- E-Commerce Expansion Migrations
-- Run this file against your PostgreSQL database before starting the app.
-- Usage: psql -U <username> -d <dbname> -f migrations.sql

-- Phase 1: Role-Based Authentication
ALTER TABLE customer_auth ADD COLUMN IF NOT EXISTS role VARCHAR(10) NOT NULL DEFAULT 'user';

-- Phase 2: Enhanced Product Catalog
ALTER TABLE product ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE product ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Phase 3: Shopping Cart
CREATE TABLE IF NOT EXISTS cart (
  id VARCHAR(36) PRIMARY KEY,
  customer_id VARCHAR(36) NOT NULL UNIQUE REFERENCES customer(customer_id)
);

CREATE TABLE IF NOT EXISTS cart_item (
  id VARCHAR(36) PRIMARY KEY,
  cart_id VARCHAR(36) NOT NULL REFERENCES cart(id) ON DELETE CASCADE,
  product_id VARCHAR(36) NOT NULL REFERENCES product(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  UNIQUE(cart_id, product_id)
);

-- Phase 4: Orders and Checkout
CREATE TABLE IF NOT EXISTS customer_order (
  id VARCHAR(36) PRIMARY KEY,
  customer_id VARCHAR(36) NOT NULL REFERENCES customer(customer_id),
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  total_amount INTEGER NOT NULL,
  shipping_address TEXT NOT NULL,
  placed_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS order_item (
  id VARCHAR(36) PRIMARY KEY,
  order_id VARCHAR(36) NOT NULL REFERENCES customer_order(id) ON DELETE CASCADE,
  product_id VARCHAR(36) NOT NULL REFERENCES product(id),
  product_name TEXT NOT NULL,
  price INTEGER NOT NULL,
  quantity INTEGER NOT NULL
);

-- Phase 5: Admin - Disable users
ALTER TABLE customer_auth ADD COLUMN IF NOT EXISTS disabled BOOLEAN NOT NULL DEFAULT false;
