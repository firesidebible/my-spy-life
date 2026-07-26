CREATE TABLE public.healthkit_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  stand_hours numeric,
  active_energy_kcal numeric,
  step_count integer,
  workout_minutes numeric,
  mindful_minutes numeric,
  resting_heart_rate numeric,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.healthkit_readings TO anon, authenticated;
GRANT ALL ON public.healthkit_readings TO service_role;

ALTER TABLE public.healthkit_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read latest readings"
  ON public.healthkit_readings
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER healthkit_readings_set_updated_at
BEFORE UPDATE ON public.healthkit_readings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
