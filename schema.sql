-- schema.sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS edit_log_entry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_date DATE NOT NULL,
  start_minutes INTEGER CHECK (start_minutes BETWEEN 0 AND 1439),
  end_minutes   INTEGER CHECK (end_minutes BETWEEN 0 AND 1439),
  hours NUMERIC(4,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_edit_log_entry_date ON edit_log_entry (entry_date DESC);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_edit_log_entry_updated ON edit_log_entry;
CREATE TRIGGER trg_edit_log_entry_updated
BEFORE UPDATE ON edit_log_entry
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
