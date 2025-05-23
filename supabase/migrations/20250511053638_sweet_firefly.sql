/*
  # Create donation system tables

  1. New Tables
    - `donations`
      - `id` (uuid, primary key)
      - `donor_id` (uuid, references auth.users)
      - `full_name` (text)
      - `email` (text)
      - `phone` (text)
      - `amount` (integer)
      - `payment_status` (text)
      - `transaction_id` (text)
      - `donation_date` (timestamptz)
      - `payment_method` (text)
      - `certificate_number` (text)
      - `certificate_url` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `newsletter_subscriptions`
      - `id` (uuid, primary key)
      - `subscriber_id` (uuid, references auth.users)
      - `email` (text)
      - `subscription_start_date` (timestamptz)
      - `subscription_end_date` (timestamptz)
      - `payment_status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read their own data
    - Add policies for service role to manage all data
*/

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id uuid REFERENCES auth.users,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  amount integer NOT NULL CHECK (amount >= 100),
  payment_status text NOT NULL DEFAULT 'pending',
  transaction_id text UNIQUE,
  donation_date timestamptz DEFAULT now(),
  payment_method text NOT NULL,
  certificate_number text UNIQUE,
  certificate_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create newsletter_subscriptions table
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id uuid REFERENCES auth.users,
  email text NOT NULL UNIQUE,
  subscription_start_date timestamptz DEFAULT now(),
  subscription_end_date timestamptz,
  payment_status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies for donations
CREATE POLICY "Users can view their own donations"
  ON donations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = donor_id);

CREATE POLICY "Service role can manage all donations"
  ON donations
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policies for newsletter_subscriptions
CREATE POLICY "Users can view their own subscriptions"
  ON newsletter_subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = subscriber_id);

CREATE POLICY "Service role can manage all subscriptions"
  ON newsletter_subscriptions
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_donations_updated_at
  BEFORE UPDATE ON donations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletter_subscriptions_updated_at
  BEFORE UPDATE ON newsletter_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();