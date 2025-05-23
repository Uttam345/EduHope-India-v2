/*
  # Add donation amount column

  1. Changes
    - Add `donation_amount` column to `donations` table
    - Update existing CHECK constraint for amount validation
    - Add index on donation_amount for faster querying

  2. Security
    - Maintain existing RLS policies
*/

-- Add donation_amount column
ALTER TABLE donations 
ADD COLUMN IF NOT EXISTS donation_amount numeric(10,2) NOT NULL DEFAULT 0;

-- Update amount check constraint
ALTER TABLE donations 
DROP CONSTRAINT IF EXISTS donations_amount_check;

ALTER TABLE donations 
ADD CONSTRAINT donations_amount_check 
CHECK (amount >= 100 AND donation_amount >= 0);

-- Add index for donation amount
CREATE INDEX IF NOT EXISTS donations_donation_amount_idx 
ON donations(donation_amount);

-- Update existing rows to match amount
UPDATE donations 
SET donation_amount = amount 
WHERE donation_amount = 0;