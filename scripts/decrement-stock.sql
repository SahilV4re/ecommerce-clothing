-- ============================================================
-- Atomic Stock Decrement Function for Supabase
-- Run this SQL in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- This function atomically decrements stock for multiple products
-- in a single transaction. It uses SELECT ... FOR UPDATE to lock
-- rows and prevent race conditions.
--
-- Usage from client:
--   const { data, error } = await supabase.rpc('decrement_stock', {
--     items: [
--       { product_id: 1, quantity: 2 },
--       { product_id: 5, quantity: 1 }
--     ]
--   });

CREATE OR REPLACE FUNCTION decrement_stock(items jsonb)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  item jsonb;
  current_stock int;
  prod_id bigint;
  qty int;
BEGIN
  -- Loop through each item and validate stock FIRST (with row lock)
  FOR item IN SELECT * FROM jsonb_array_elements(items)
  LOOP
    prod_id := (item ->> 'product_id')::bigint;
    qty     := (item ->> 'quantity')::int;

    -- Lock the row to prevent concurrent modifications
    SELECT stock INTO current_stock
    FROM products
    WHERE id = prod_id
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product with id % not found', prod_id;
    END IF;

    IF current_stock < qty THEN
      RAISE EXCEPTION 'Insufficient stock for product %. Available: %, Requested: %',
        prod_id, current_stock, qty;
    END IF;
  END LOOP;

  -- All validations passed — now decrement
  FOR item IN SELECT * FROM jsonb_array_elements(items)
  LOOP
    prod_id := (item ->> 'product_id')::bigint;
    qty     := (item ->> 'quantity')::int;

    UPDATE products
    SET stock = stock - qty
    WHERE id = prod_id;
  END LOOP;
END;
$$;


