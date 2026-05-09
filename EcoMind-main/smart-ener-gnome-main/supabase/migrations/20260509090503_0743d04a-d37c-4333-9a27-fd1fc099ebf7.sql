
CREATE TABLE public.chatbot_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  role text NOT NULL,
  message text NOT NULL,
  context jsonb
);
ALTER TABLE public.chatbot_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read chatbot" ON public.chatbot_logs FOR SELECT USING (true);
CREATE POLICY "insert chatbot" ON public.chatbot_logs FOR INSERT WITH CHECK (true);

CREATE TABLE public.anomaly_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  zone text NOT NULL,
  type text NOT NULL,
  severity text NOT NULL,
  description text NOT NULL,
  value numeric
);
ALTER TABLE public.anomaly_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read anomaly" ON public.anomaly_logs FOR SELECT USING (true);
CREATE POLICY "insert anomaly" ON public.anomaly_logs FOR INSERT WITH CHECK (true);

CREATE TABLE public.maintenance_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  system text NOT NULL,
  health_score numeric NOT NULL,
  failure_probability numeric NOT NULL,
  urgency text NOT NULL,
  notes text
);
ALTER TABLE public.maintenance_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read maint" ON public.maintenance_logs FOR SELECT USING (true);
CREATE POLICY "insert maint" ON public.maintenance_logs FOR INSERT WITH CHECK (true);

CREATE TABLE public.occupancy_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  zone text NOT NULL,
  floor int NOT NULL DEFAULT 1,
  density numeric NOT NULL
);
ALTER TABLE public.occupancy_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read occ" ON public.occupancy_logs FOR SELECT USING (true);
CREATE POLICY "insert occ" ON public.occupancy_logs FOR INSERT WITH CHECK (true);

CREATE TABLE public.automation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  action text NOT NULL,
  target text NOT NULL,
  status text NOT NULL DEFAULT 'success',
  details text
);
ALTER TABLE public.automation_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read auto" ON public.automation_logs FOR SELECT USING (true);
CREATE POLICY "insert auto" ON public.automation_logs FOR INSERT WITH CHECK (true);

CREATE TABLE public.sustainability_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  co2_saved_kg numeric NOT NULL,
  trees_equivalent numeric NOT NULL,
  renewable_pct numeric NOT NULL,
  esg_score numeric NOT NULL
);
ALTER TABLE public.sustainability_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read sus" ON public.sustainability_logs FOR SELECT USING (true);
CREATE POLICY "insert sus" ON public.sustainability_logs FOR INSERT WITH CHECK (true);
