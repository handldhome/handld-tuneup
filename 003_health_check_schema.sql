-- Health Check tables for the Free Home Health Check report
-- Run against the handld schema in Supabase project xrjzgsvqrobvkkerfext

-- Report-level data (one per inspection)
CREATE TABLE handld.health_check_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  address TEXT NOT NULL,
  tech_name TEXT NOT NULL,
  inspection_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT DEFAULT '',
  overall_rating TEXT NOT NULL DEFAULT 'Good',
  priority_items TEXT DEFAULT '',
  services_recommended TEXT DEFAULT '',
  report_sent BOOLEAN DEFAULT FALSE,
  customer_phone TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual checklist items (12 per report)
CREATE TABLE handld.health_check_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES handld.health_check_reports(id) ON DELETE CASCADE,
  item_number INTEGER NOT NULL,
  section TEXT NOT NULL,
  item_name TEXT NOT NULL,
  rating TEXT NOT NULL DEFAULT 'Good',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX idx_health_check_items_report_id ON handld.health_check_items(report_id);

-- Enable RLS (matching existing pattern — allow all via service_role key)
ALTER TABLE handld.health_check_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE handld.health_check_items ENABLE ROW LEVEL SECURITY;

-- Service role bypass policies
CREATE POLICY "Service role full access" ON handld.health_check_reports FOR ALL USING (true);
CREATE POLICY "Service role full access" ON handld.health_check_items FOR ALL USING (true);
