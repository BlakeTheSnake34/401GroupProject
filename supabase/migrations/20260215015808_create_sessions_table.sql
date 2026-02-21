/*
  # Create sessions tracking table

  1. New Tables
    - `sessions`
      - `id` (uuid, primary key) - Unique identifier for each session
      - `app_name` (text) - Name of the app being used
      - `purpose` (text) - User's stated purpose/intention for the session
      - `duration_minutes` (integer) - Planned duration in minutes
      - `started_at` (timestamptz) - When the session started
      - `completed_at` (timestamptz, nullable) - When the session was completed
      - `completed` (boolean) - Whether the session was completed or ended early
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on `sessions` table
    - Sessions are public (no authentication required for this demo)
    - Anyone can create and view sessions
*/

CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_name text NOT NULL,
  purpose text NOT NULL,
  duration_minutes integer NOT NULL,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create sessions"
  ON sessions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view sessions"
  ON sessions
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can update sessions"
  ON sessions
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
