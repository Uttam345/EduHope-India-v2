/*
  # Update newsletter subscriptions policies

  1. Changes
    - Add policy to allow anonymous users to subscribe to the newsletter
    - Add policy to allow service role to manage all subscriptions
    - Add policy to allow authenticated users to view their own subscriptions

  2. Security
    - Enable RLS on newsletter_subscriptions table
    - Add policies for different user roles and operations
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Service role can manage all subscriptions" ON newsletter_subscriptions;
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON newsletter_subscriptions;

-- Create new policies
CREATE POLICY "Allow anonymous newsletter subscriptions"
ON newsletter_subscriptions
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Service role can manage all subscriptions"
ON newsletter_subscriptions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Users can view their own subscriptions"
ON newsletter_subscriptions
FOR SELECT
TO authenticated
USING (subscriber_id = auth.uid());