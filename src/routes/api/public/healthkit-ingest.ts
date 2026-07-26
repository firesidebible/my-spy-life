import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const SLUG = "default";

const IngestBody = z.object({
  standHours: z.coerce.number().min(0).max(24).optional(),
  activeEnergyKcal: z.coerce.number().min(0).max(20000).optional(),
  stepCount: z.coerce.number().int().min(0).max(1_000_000).optional(),
  workoutMinutes: z.coerce.number().min(0).max(1440).optional(),
  mindfulMinutes: z.coerce.number().min(0).max(1440).optional(),
  restingHeartRate: z.coerce.number().min(20).max(240).optional(),
  recordedAt: z.string().datetime().optional(),
});

function timingSafeEqualStr(a: string, b: string) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export const Route = createFileRoute("/api/public/healthkit-ingest")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected = process.env.HEALTHKIT_INGEST_TOKEN;
        if (!expected) {
          return Response.json(
            { error: "server_not_configured" },
            { status: 503 },
          );
        }

        const provided =
          request.headers.get("x-hk-token") ??
          request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
          "";

        if (!provided || !timingSafeEqualStr(provided, expected)) {
          return Response.json({ error: "unauthorized" }, { status: 401 });
        }

        let raw: unknown;
        try {
          raw = await request.json();
        } catch {
          return Response.json({ error: "invalid_json" }, { status: 400 });
        }

        const parsed = IngestBody.safeParse(raw);
        if (!parsed.success) {
          return Response.json(
            { error: "invalid_body", details: parsed.error.flatten() },
            { status: 400 },
          );
        }
        const d = parsed.data;

        const { supabaseAdmin } = await import(
          "@/integrations/supabase/client.server"
        );

        const { data, error } = await supabaseAdmin
          .from("healthkit_readings")
          .upsert(
            {
              slug: SLUG,
              stand_hours: d.standHours ?? null,
              active_energy_kcal: d.activeEnergyKcal ?? null,
              step_count: d.stepCount ?? null,
              workout_minutes: d.workoutMinutes ?? null,
              mindful_minutes: d.mindfulMinutes ?? null,
              resting_heart_rate: d.restingHeartRate ?? null,
              recorded_at: d.recordedAt ?? new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            { onConflict: "slug" },
          )
          .select()
          .single();

        if (error) {
          console.error("[healthkit-ingest] upsert failed", error);
          return Response.json({ error: "db_error" }, { status: 500 });
        }

        // Vitals + a transmission from Agent 86, so the Shortcut can show a
        // notification with whatever comes back — no logic needed on-device.
        const clamp = (v: number | null | undefined, target: number) =>
          v == null || !Number.isFinite(v)
            ? 0
            : Math.max(0, Math.min(100, Math.round((v / target) * 100)));
        const stamina = clamp(d.standHours ?? null, 12);
        const strength = clamp(d.workoutMinutes ?? null, 60);
        const intel = clamp(d.mindfulMinutes ?? null, 20);
        const readiness = Math.round((stamina + strength + intel) / 3);

        const LOW = [
          "VITALS CRITICAL. My legs just gave out mid-chase. Coincidence? Check your stand ring.",
          "VITALS CRITICAL. I attempted to disarm the device. My hands shook. Someone skipped their transfer.",
          "VITALS CRITICAL. F.L.A.B. is gaining on me and frankly, so is gravity. Stamina. Yesterday.",
        ];
        const MID = [
          "VITALS NOMINAL. Uplink holding — I scaled the embassy wall on the strength you sent. The second wall, however...",
          "VITALS NOMINAL. Adequate transfer received. 'Adequate' is what my handler writes on every report.",
          "VITALS NOMINAL. Signal steady. I'm two vents from the mainframe. Keep it coming.",
        ];
        const HIGH = [
          "VITALS OPTIMAL. I just outran a speedboat. On foot. Whatever you did today — do it again tomorrow.",
          "VITALS OPTIMAL. Intel boost received. Cracked their cipher — it was 'password1'. F.L.A.B. never learns.",
          "VITALS OPTIMAL. Full transfer. I feel invincible, which historically is when things go wrong. Stand by.",
        ];
        const pool = readiness >= 70 ? HIGH : readiness >= 35 ? MID : LOW;
        const transmission = pool[Math.floor(Math.random() * pool.length)];

        return Response.json({
          ok: true,
          reading: data,
          vitals: { stamina, strength, intel, readiness },
          transmission,
        });
      },
      GET: async () => {
        return Response.json({
          status: "ok",
          endpoint: "healthkit-ingest",
          method: "POST",
          headers: {
            "x-hk-token": "<your shared token>",
            "content-type": "application/json",
          },
          bodyExample: {
            standHours: 8,
            activeEnergyKcal: 520,
            stepCount: 9421,
            workoutMinutes: 32,
            mindfulMinutes: 10,
            restingHeartRate: 58,
            recordedAt: new Date().toISOString(),
          },
        });
      },
    },
  },
});
