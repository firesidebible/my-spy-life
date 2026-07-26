import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useMemo, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  component: SpyLife,
});

type Stage = "boot" | "incoming" | "briefing" | "accept" | "mission" | "complete";

const BRIEFING = [
  "GOOD MORNING, OPERATIVE.",
  "",
  "YOUR MISSION, SHOULD YOU CHOOSE TO ACCEPT IT, IS TO TRAIN FOR ME.",
  "YOUR SUCCESS MEANS MY SUCCESS. AND IT GOES WITHOUT SAYING, YOUR",
  "FAILURE MEANS MY... UNTIMELY DEMISE AT THE HANDS OF A NEFARIOUS",
  "ENEMY. NOW THAT I'VE SAID IT I REALIZE THAT I SHOULD HAVE STUCK",
  "WITH 'IT GOES WITHOUT SAYING'...",
  "",
  "THIS TERMINAL IS AUTHORIZED L.I.F.E. SUPPORT — LONG-RANGE",
  "INDUCTIVELY FOCUSED ENERGY. WHEN YOU CLOSE A STAND RING, I GAIN",
  "STAMINA. WHEN YOU LIFT, I GAIN STRENGTH. WHEN YOU BREATHE, I THINK.",
  "",
  "F.L.A.B. IS MOVING. TIME IS SHORT. GOOD LUCK, 86.",
  "",
  "— AGENT 86, M.U.S.C.L.E.",
];

export default function SpyLife() {
  const [stage, setStage] = useState<Stage>("boot");

  // BOOT sequence -> incoming
  useEffect(() => {
    if (stage !== "boot") return;
    const t = setTimeout(() => setStage("incoming"), 2400);
    return () => clearTimeout(t);
  }, [stage]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground scanlines crt-vignette">
      <div className="absolute inset-0 hud-grid opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,theme(colors.transparent)_30%,oklch(0_0_0/0.55))]" />

      <TopBar stage={stage} />

      <div className="relative mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-8">
        {stage === "boot" && <BootScreen />}
        {stage === "incoming" && <IncomingCall onAccept={() => setStage("briefing")} />}
        {stage === "briefing" && <Briefing onNext={() => setStage("accept")} />}
        {stage === "accept" && (
          <AcceptGate
            onAccept={() => setStage("mission")}
            onDecline={() => setStage("boot")}
          />
        )}
        {stage === "mission" && <MissionBoard onComplete={() => setStage("complete")} />}
        {stage === "complete" && <MissionComplete onRestart={() => setStage("boot")} />}
      </div>

      <BottomTicker stage={stage} />
    </main>
  );
}

/* ————————————— chrome ————————————— */

function TopBar({ stage }: { stage: Stage }) {
  const label: Record<Stage, string> = {
    boot: "SYS// COLD BOOT",
    incoming: "SIGINT// INBOUND",
    briefing: "COMMS// BRIEFING",
    accept: "AUTH// AWAITING OPERATOR",
    mission: "OPS// LIFE-SUPPORT ACTIVE",
    complete: "OPS// EXFIL",
  };
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-border/60 bg-hud-panel backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2.5 text-[10px] uppercase tracking-[0.22em] sm:px-8">
        <span className="glow-hud font-bold">M.U.S.C.L.E.</span>
        <span className="text-muted-foreground">Multinational United Syndicate of Covert Law Enforcement</span>
        <span className="ml-auto hidden items-center gap-2 md:flex">
          <Dot className="bg-hud" /> LINK 04
          <Dot className="bg-hud-warn" /> ENCR AES-256
          <Dot className="bg-hud-danger blink" /> F.L.A.B. ACTIVE
        </span>
        <span className="ml-auto md:ml-4 glow-warn">{label[stage]}</span>
      </div>
    </header>
  );
}

function Dot({ className = "" }: { className?: string }) {
  return <span className={`inline-block h-1.5 w-1.5 rounded-full ${className}`} />;
}

function BottomTicker({ stage }: { stage: Stage }) {
  const items = [
    "F.L.A.B. CELL SIGHTED / GRID 7-B",
    "AGENT 86 VITALS NOMINAL",
    "L.I.F.E. UPLINK STABLE",
    "SECURE THIS TERMINAL // DO NOT SHARE",
    "STAND RING → STAMINA TRANSFER",
    "BREATH SESSION → INTEL BOOST",
  ];
  return (
    <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-border/60 bg-hud-panel/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-hidden px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-muted-foreground sm:px-8">
        <span className="glow-hud">// {stage.toUpperCase()}</span>
        <div className="relative flex-1 overflow-hidden">
          <div className="flex animate-[hud-sweep_28s_linear_infinite] gap-10 whitespace-nowrap">
            {[...items, ...items].map((t, i) => (
              <span key={i}>{t}</span>
            ))}
          </div>
        </div>
        <span className="hidden md:inline">CLR: SIERRA-04</span>
      </div>
    </footer>
  );
}

/* ————————————— screens ————————————— */

function BootScreen() {
  const lines = [
    "> initializing M.U.S.C.L.E. field terminal…",
    "> handshake: SIERRA-04 :: OK",
    "> loading L.I.F.E. driver (Long-range Inductively Focused Energy)…",
    "> pairing HealthKit uplink :: OK",
    "> awaiting inbound transmission…",
  ];
  return (
    <div className="mx-auto mt-20 max-w-2xl">
      <div className="mb-6 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        SYSTEM
      </div>
      <div className="bracket-4 relative border border-border/60 bg-hud-panel p-6 font-mono text-sm">
        <span className="br-tr" />
        <span className="br-bl" />
        {lines.map((l, i) => (
          <TypeLine key={i} text={l} delay={i * 400} className="glow-hud" />
        ))}
        <div className="mt-4 h-1 w-full overflow-hidden border border-border/60">
          <div className="h-full bg-primary bar-anim" style={{ width: "78%" }} />
        </div>
      </div>
    </div>
  );
}

function IncomingCall({ onAccept }: { onAccept: () => void }) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        <Dot className="bg-hud-danger blink" />
        <span className="glow-danger">INCOMING TRANSMISSION</span>
      </div>

      <div className="bracket-4 relative border border-hud/40 bg-hud-panel p-8 sweep">
        <span className="br-tr" />
        <span className="br-bl" />

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <div className="mb-1 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              ORIGIN
            </div>
            <div className="glow-hud text-2xl font-bold sm:text-3xl">AGENT 86</div>
            <div className="mt-1 text-xs text-muted-foreground">
              // M.U.S.C.L.E. Operations · Sector █████
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 text-[10px] uppercase tracking-widest">
              <MiniStat label="Freq" value="874.30 MHz" />
              <MiniStat label="Encr" value="AES-256" />
              <MiniStat label="Latency" value="42ms" />
            </div>
          </div>

          <div className="relative mx-auto flex h-40 w-40 items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-hud/50" />
            <div className="absolute inset-4 rounded-full border border-hud/40" />
            <div className="absolute inset-8 rounded-full border border-hud/30" />
            <div className="absolute inset-0 rounded-full border border-hud ping-ring" />
            <div className="glow-hud text-center">
              <div className="text-[9px] tracking-[0.3em]">SIGINT</div>
              <div className="text-2xl font-bold">ACK?</div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <HudButton onClick={onAccept} tone="hud">
            ACCEPT TRANSMISSION
          </HudButton>
          <HudButton onClick={onAccept} tone="ghost">
            AUTHENTICATE OPERATOR
          </HudButton>
        </div>
      </div>
    </div>
  );
}

function Briefing({ onNext }: { onNext: () => void }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (idx >= BRIEFING.length) return;
    const t = setTimeout(() => setIdx((n) => n + 1), BRIEFING[idx] === "" ? 220 : 520);
    return () => clearTimeout(t);
  }, [idx]);

  const done = idx >= BRIEFING.length;

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="bracket-4 relative border border-border/60 bg-hud-panel p-6 sm:p-8">
        <span className="br-tr" />
        <span className="br-bl" />
        <div className="mb-4 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <span className="glow-hud">// BRIEFING · EYES ONLY</span>
          <span className="flicker glow-danger">TOP SECRET</span>
        </div>

        <div className="min-h-[360px] whitespace-pre-wrap text-sm leading-relaxed sm:text-[15px]">
          {BRIEFING.slice(0, idx).map((line, i) => (
            <div key={i} className={line.startsWith("—") ? "mt-3 glow-warn" : ""}>
              {line || "\u00A0"}
            </div>
          ))}
          {!done && <span className="caret" />}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <span>DOSSIER · 86-Δ-{new Date().getFullYear()}</span>
          <button
            onClick={() => setIdx(BRIEFING.length)}
            className="glow-hud hover:underline"
          >
            [ SKIP ] »
          </button>
        </div>
      </div>

      <aside className="flex flex-col gap-4">
        <Panel title="THREAT">
          <div className="flex items-baseline gap-2">
            <span className="glow-danger text-4xl font-bold">F.L.A.B.</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Foreign League of Angry Bad-guys
            </span>
          </div>
          <div className="mt-4 space-y-2 text-xs">
            <StatBar label="ACTIVITY" value={78} tone="danger" />
            <StatBar label="MOBILITY" value={54} tone="warn" />
            <StatBar label="MORALE" value={31} tone="hud" />
          </div>
        </Panel>

        <Panel title="ASSET · AGENT 86">
          <div className="grid grid-cols-3 gap-2 text-center text-[10px] uppercase tracking-widest">
            <AssetStat label="Stamina" value={62} />
            <AssetStat label="Strength" value={48} />
            <AssetStat label="Intel" value={71} />
          </div>
          <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
            L.I.F.E. uplink armed. Your HealthKit activity feeds directly into 86's field
            performance envelope.
          </p>
        </Panel>

        {done && (
          <HudButton onClick={onNext} tone="hud" className="animate-in fade-in">
            PROCEED TO OPERATOR AUTH →
          </HudButton>
        )}
      </aside>
    </div>
  );
}

function AcceptGate({
  onAccept,
  onDecline,
}: {
  onAccept: () => void;
  onDecline: () => void;
}) {
  const [hold, setHold] = useState(0);
  const raf = useRef<number | null>(null);
  const active = useRef(false);

  const tick = () => {
    if (!active.current) return;
    setHold((h) => {
      const next = Math.min(100, h + 2.4);
      if (next >= 100) {
        active.current = false;
        setTimeout(onAccept, 250);
        return 100;
      }
      raf.current = requestAnimationFrame(tick);
      return next;
    });
  };

  const start = () => {
    active.current = true;
    raf.current = requestAnimationFrame(tick);
  };
  const stop = () => {
    active.current = false;
    if (raf.current) cancelAnimationFrame(raf.current);
    setHold(0);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        // OPERATOR ACCEPTANCE — L.I.F.E. SUPPORT PROTOCOL
      </div>

      <div className="bracket-4 relative border border-border/60 bg-hud-panel p-8 text-center">
        <span className="br-tr" />
        <span className="br-bl" />

        <div className="glow-hud text-xl font-bold sm:text-2xl">
          DO YOU ACCEPT THIS MISSION?
        </div>
        <p className="mx-auto mt-3 max-w-lg text-xs leading-relaxed text-muted-foreground">
          By accepting, you consent to feed Long-range Inductively Focused Energy from
          your daily activity to Agent 86. Failure to comply may result in 86's...
          untimely demise. It goes without saying.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4">
          <button
            onMouseDown={start}
            onMouseUp={stop}
            onMouseLeave={stop}
            onTouchStart={start}
            onTouchEnd={stop}
            className="group relative h-16 w-64 border border-hud bg-hud/10 font-bold uppercase tracking-[0.28em] text-hud transition hover:bg-hud/20 active:bg-hud/30"
          >
            <span className="relative z-10">HOLD TO ACCEPT</span>
            <span
              className="absolute inset-y-0 left-0 bg-hud/40 transition-[width]"
              style={{ width: `${hold}%` }}
            />
          </button>

          <button
            onClick={onDecline}
            className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:glow-danger"
          >
            [ DECLINE — THIS MESSAGE WILL SELF-DESTRUCT ]
          </button>
        </div>
      </div>
    </div>
  );
}

type HKReading = {
  stand_hours: number | null;
  active_energy_kcal: number | null;
  step_count: number | null;
  workout_minutes: number | null;
  mindful_minutes: number | null;
  resting_heart_rate: number | null;
  recorded_at: string;
  updated_at: string;
};

function useHealthKitReading() {
  return useQuery({
    queryKey: ["healthkit_reading"],
    queryFn: async (): Promise<HKReading | null> => {
      const { data, error } = await supabase
        .from("healthkit_readings")
        .select(
          "stand_hours, active_energy_kcal, step_count, workout_minutes, mindful_minutes, resting_heart_rate, recorded_at, updated_at",
        )
        .eq("slug", "default")
        .maybeSingle();
      if (error) throw error;
      return (data as HKReading | null) ?? null;
    },
    refetchInterval: 15_000,
    staleTime: 10_000,
  });
}

function pct(value: number | null | undefined, target: number) {
  if (value == null || !Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round((value / target) * 100)));
}

function relTime(iso: string | undefined) {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 0) return "just now";
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function MissionBoard({ onComplete }: { onComplete: () => void }) {
  const hk = useHealthKitReading();
  const reading = hk.data;

  // HealthKit → vitals mapping
  //   Stand ring closed 12h/day → full stamina
  //   Workout 60 min/day        → full strength
  //   Mindful 20 min/day        → full intelligence
  const stamina = pct(reading?.stand_hours, 12);
  const strength = pct(reading?.workout_minutes, 60);
  const intel = pct(reading?.mindful_minutes, 20);

  const [log, setLog] = useState<string[]>([
    "> uplink established // L.I.F.E. channel open",
    "> awaiting HealthKit sync from Operator device…",
  ]);
  const lastSyncRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (!reading?.updated_at) return;
    if (lastSyncRef.current === reading.updated_at) return;
    lastSyncRef.current = reading.updated_at;
    setLog((l) => [
      ...l.slice(-6),
      `> HealthKit sync received · stand ${reading.stand_hours ?? 0}h · lift ${reading.workout_minutes ?? 0}m · breathe ${reading.mindful_minutes ?? 0}m`,
    ]);
  }, [reading?.updated_at, reading?.stand_hours, reading?.workout_minutes, reading?.mindful_minutes]);

  const target = 85;
  const avg = Math.round((stamina + strength + intel) / 3);
  const missionReady = stamina >= target && strength >= target && intel >= target;

  const forceResync = () => {
    hk.refetch();
    setLog((l) => [...l.slice(-6), "> operator requested resync of L.I.F.E. channel"]);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr_1fr]">
      {/* Left: Agent card */}
      <div className="bracket-4 relative border border-border/60 bg-hud-panel p-5">
        <span className="br-tr" />
        <span className="br-bl" />
        <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          ASSET
        </div>
        <div className="mt-1 glow-hud text-2xl font-bold">AGENT 86</div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
          MUSCLE // FIELD OPERATOR
        </div>

        <TrackingMap steps={reading?.step_count ?? null} />

        <dl className="mt-4 grid grid-cols-2 gap-2 text-[10px] uppercase tracking-widest">
          <Kv k="Codename" v="86" />
          <Kv k="Clearance" v="Δ" />
          <Kv k="Cell" v="MUSCLE-04" />
          <Kv k="Status" v={missionReady ? "READY" : "TRAINING"} tone={missionReady ? "hud" : "warn"} />
        </dl>
      </div>

      {/* Center: L.I.F.E. transfer console */}
      <div className="bracket-4 relative border border-border/60 bg-hud-panel p-5">
        <span className="br-tr" />
        <span className="br-bl" />
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              L.I.F.E. TRANSFER
            </div>
            <div className="glow-hud text-lg font-bold">
              Long-range Inductively Focused Energy
            </div>
          </div>
          <div className="text-right text-[10px] uppercase tracking-widest text-muted-foreground">
            <div>MISSION READINESS</div>
            <div className={`text-2xl font-bold ${missionReady ? "glow-hud" : "glow-warn"}`}>
              {avg}%
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <MetricRow
            label="STAND · STAMINA"
            hint="Stand hours today → 86's stamina reserves"
            value={stamina}
            raw={reading?.stand_hours ?? null}
            unit="h"
            target={12}
            tone="hud"
          />
          <MetricRow
            label="LIFT · STRENGTH"
            hint="Workout minutes today → 86's payload capacity"
            value={strength}
            raw={reading?.workout_minutes ?? null}
            unit="min"
            target={60}
            tone="warn"
          />
          <MetricRow
            label="BREATHE · INTELLIGENCE"
            hint="Mindful minutes today → 86's tactical focus"
            value={intel}
            raw={reading?.mindful_minutes ?? null}
            unit="min"
            target={20}
            tone="hud"
          />
        </div>

        <div className="mt-4 flex items-center justify-between border border-border/60 bg-background/40 px-3 py-2 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          <span>
            {reading
              ? <>HEALTHKIT SYNC · <span className="glow-hud">{relTime(reading.updated_at)}</span></>
              : <span className="glow-warn">AWAITING FIRST HEALTHKIT SYNC FROM iPHONE SHORTCUT</span>}
          </span>
          <button
            onClick={forceResync}
            disabled={hk.isFetching}
            className="border border-border/70 px-2 py-1 hover:border-hud hover:text-hud disabled:opacity-40"
          >
            {hk.isFetching ? "SYNCING…" : "RESYNC"}
          </button>
        </div>

        <div className="mt-6 border-t border-border/60 pt-4">
          <div className="mb-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            COMMS LOG
          </div>
          <div className="h-28 overflow-hidden text-[11px] leading-relaxed">
            {log.map((l, i) => (
              <div key={i} className="glow-hud opacity-80">
                {l}
              </div>
            ))}
          </div>
        </div>

        <button
          disabled={!missionReady}
          onClick={onComplete}
          className={`mt-5 h-12 w-full border font-bold uppercase tracking-[0.28em] transition ${
            missionReady
              ? "border-hud bg-hud/20 text-hud hover:bg-hud/30"
              : "cursor-not-allowed border-border/60 text-muted-foreground"
          }`}
        >
          {missionReady ? "DEPLOY 86 →" : `RAISE ALL VITALS TO ${target}%`}
        </button>
      </div>

      {/* Right: mission dossier */}
      <div className="flex flex-col gap-4">
        <Panel title="MISSION · CROSSFIRE">
          <div className="text-xs leading-relaxed text-muted-foreground">
            Extract Dr. Q from a F.L.A.B. safehouse in Sector 7-B. Requires sustained
            cardio, upper-body payload capacity, and clear tactical judgement.
          </div>
          <ul className="mt-3 space-y-1 text-[11px]">
            <li className="glow-hud">◇ INFIL · rooftop approach</li>
            <li className="glow-hud">◇ RETRIEVE · Dr. Q + laptop</li>
            <li className="glow-hud">◇ EXFIL · east canal, 04:12</li>
          </ul>
        </Panel>

        <Panel title="HOSTILES">
          <div className="grid grid-cols-3 gap-2 text-center text-[10px] uppercase tracking-widest">
            <Hostile label="Grunts" n={8} tone="warn" />
            <Hostile label="Elite" n={2} tone="danger" />
            <Hostile label="Boss" n={1} tone="danger" />
          </div>
          <div className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
            F.L.A.B. lieutenant "Big Gut" confirmed on-site. Do not engage without full
            L.I.F.E. transfer.
          </div>
        </Panel>

        <Panel title="COUNTDOWN">
          <Countdown seconds={4 * 60 + 12} />
        </Panel>
      </div>
    </div>
  );
}

function MissionComplete({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="bracket-4 relative border border-hud/50 bg-hud-panel p-10 text-center">
        <span className="br-tr" />
        <span className="br-bl" />
        <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          // MISSION REPORT
        </div>
        <div className="mt-2 glow-hud text-4xl font-bold tracking-widest">
          MISSION COMPLETE
        </div>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
          Dr. Q secured. Agent 86 extracted via east canal at 04:12. F.L.A.B. cell 7-B
          neutralized. Your L.I.F.E. transfer made this possible, Operator.
        </p>

        <div className="mx-auto mt-8 grid max-w-md grid-cols-3 gap-3 text-[10px] uppercase tracking-widest">
          <Award label="Stamina" v="+340" />
          <Award label="Strength" v="+280" />
          <Award label="Intel" v="+410" />
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <HudButton onClick={onRestart} tone="hud">
            AWAIT NEXT TRANSMISSION
          </HudButton>
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            THIS MESSAGE WILL SELF-DESTRUCT IN <span className="glow-danger blink">05</span> SECONDS
          </div>
        </div>
      </div>
    </div>
  );
}

/* ————————————— tracking map ————————————— */

// Deterministic PRNG so the same seed always draws the same city.
function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type CityMap = {
  v: number[];
  h: number[];
  blocks: { x: number; y: number; w: number; h: number }[];
  landmarks: { x: number; y: number; w: number; h: number }[];
};

// Procedural "classified sector" map: jittered street grid + building blocks.
// Seeded by the date, so Agent 86 operates in a new sector every day.
function genCity(seed: number): CityMap {
  const rnd = mulberry32(seed);
  const v: number[] = [];
  const h: number[] = [];
  let x = 8 + rnd() * 6;
  while (x < 92) {
    v.push(x);
    x += 11 + rnd() * 13;
  }
  let y = 8 + rnd() * 6;
  while (y < 92) {
    h.push(y);
    y += 11 + rnd() * 13;
  }
  const blocks: CityMap["blocks"] = [];
  for (let i = 0; i < v.length - 1; i++) {
    for (let j = 0; j < h.length - 1; j++) {
      if (rnd() < 0.4) {
        blocks.push({
          x: v[i] + 1.6,
          y: h[j] + 1.6,
          w: v[i + 1] - v[i] - 3.2,
          h: h[j + 1] - h[j] - 3.2,
        });
      }
    }
  }
  const landmarks = blocks.filter(() => rnd() < 0.15).slice(0, 3);
  return { v, h, blocks, landmarks };
}

function daySeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

// Fake FindMy: Agent 86 walks the streets between random intersections.
// More operator steps today -> 86 moves faster through the sector.
function TrackingMap({ steps }: { steps: number | null }) {
  const city = useMemo(() => genCity(daySeed()), []);
  const [pos, setPos] = useState(() => ({
    x: city.v[Math.floor(city.v.length / 2)] ?? 50,
    y: city.h[Math.floor(city.h.length / 2)] ?? 50,
  }));
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([]);
  const [moving, setMoving] = useState(true);
  const targetRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const iv = setInterval(() => {
      setPos((p) => {
        let t = targetRef.current;
        if (!t || (Math.abs(p.x - t.x) < 0.5 && Math.abs(p.y - t.y) < 0.5)) {
          t = {
            x: city.v[Math.floor(Math.random() * city.v.length)],
            y: city.h[Math.floor(Math.random() * city.h.length)],
          };
          targetRef.current = t;
        }
        const speed = 1.1 + Math.min((steps ?? 0) / 10000, 1) * 2.6;
        // Streets only: walk the x axis to the target street, then the y axis.
        let nx = p.x;
        let ny = p.y;
        if (Math.abs(p.x - t.x) > 0.4) {
          nx = p.x + Math.sign(t.x - p.x) * Math.min(speed, Math.abs(t.x - p.x));
        } else {
          ny = p.y + Math.sign(t.y - p.y) * Math.min(speed, Math.abs(t.y - p.y));
        }
        setMoving(Math.abs(nx - p.x) + Math.abs(ny - p.y) > 0.05);
        return { x: nx, y: ny };
      });
    }, 1600);
    return () => clearInterval(iv);
  }, [city, steps]);

  useEffect(() => {
    setTrail((tr) => [...tr.slice(-22), pos]);
  }, [pos]);

  return (
    <div className="relative mt-5 aspect-square border border-border/60 bg-background/60">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        {/* streets */}
        {city.v.map((x, i) => (
          <line key={`v${i}`} x1={x} y1={4} x2={x} y2={96} stroke="var(--hud)" strokeOpacity="0.22" strokeWidth="0.6" />
        ))}
        {city.h.map((y, i) => (
          <line key={`h${i}`} x1={4} y1={y} x2={96} y2={y} stroke="var(--hud)" strokeOpacity="0.22" strokeWidth="0.6" />
        ))}
        {/* building blocks */}
        {city.blocks.map((b, i) => (
          <rect key={`b${i}`} x={b.x} y={b.y} width={b.w} height={b.h} fill="var(--hud)" fillOpacity="0.06" stroke="var(--hud)" strokeOpacity="0.14" strokeWidth="0.4" />
        ))}
        {/* landmarks */}
        {city.landmarks.map((b, i) => (
          <rect key={`l${i}`} x={b.x} y={b.y} width={b.w} height={b.h} fill="var(--hud-warn)" fillOpacity="0.12" stroke="var(--hud-warn)" strokeOpacity="0.4" strokeWidth="0.5" />
        ))}
        {/* movement trail */}
        {trail.length > 1 && (
          <polyline
            points={trail.map((t) => `${t.x},${t.y}`).join(" ")}
            fill="none"
            stroke="var(--hud)"
            strokeOpacity="0.5"
            strokeWidth="0.7"
            strokeDasharray="1.6 1.2"
          />
        )}
        {/* spinning sweep (fixed: hud-spin rotates; hud-sweep slides) */}
        <g className="origin-center animate-[hud-spin_5s_linear_infinite]">
          <path d="M50 50 L50 2 A48 48 0 0 1 94 40 Z" fill="var(--hud)" fillOpacity="0.08" />
        </g>
        {/* Agent 86 blip */}
        <circle cx={pos.x} cy={pos.y} r="3.2" fill="none" stroke="var(--hud)" strokeOpacity="0.6" className="ping-ring" style={{ transformOrigin: `${pos.x}px ${pos.y}px` }} />
        <circle cx={pos.x} cy={pos.y} r="1.5" fill="var(--hud)" />
      </svg>
      <div className="absolute bottom-2 left-2 text-[9px] uppercase tracking-widest glow-hud">
        86 · {moving ? "MOVING" : "HOLDING"} · X{pos.x.toFixed(1)} Y{pos.y.toFixed(1)}
      </div>
      <div className="absolute top-2 right-2 text-[9px] uppercase tracking-widest text-muted-foreground">
        SECTOR 7-B
      </div>
    </div>
  );
}

/* ————————————— building blocks ————————————— */

function TypeLine({
  text,
  delay,
  className = "",
}: {
  text: string;
  delay: number;
  className?: string;
}) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    let i = 0;
    const start = setTimeout(() => {
      const iv = setInterval(() => {
        i++;
        setShown(text.slice(0, i));
        if (i >= text.length) clearInterval(iv);
      }, 22);
    }, delay);
    return () => clearTimeout(start);
  }, [text, delay]);
  return <div className={className}>{shown}</div>;
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bracket-4 relative border border-border/60 bg-hud-panel p-5">
      <span className="br-tr" />
      <span className="br-bl" />
      <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        <span className="glow-hud">// {title}</span>
        <span>◈</span>
      </div>
      {children}
    </section>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border/60 bg-background/40 p-2">
      <div className="text-[9px] text-muted-foreground">{label}</div>
      <div className="glow-hud text-xs font-bold">{value}</div>
    </div>
  );
}

function AssetStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-border/60 bg-background/40 p-2">
      <div className="text-muted-foreground">{label}</div>
      <div className="glow-hud mt-1 text-lg font-bold">{value}</div>
    </div>
  );
}

function StatBar({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "hud" | "warn" | "danger";
}) {
  const color =
    tone === "danger" ? "bg-hud-danger" : tone === "warn" ? "bg-hud-warn" : "bg-hud";
  return (
    <div>
      <div className="mb-1 flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
        <span>{label}</span>
        <span className={tone === "danger" ? "glow-danger" : tone === "warn" ? "glow-warn" : "glow-hud"}>
          {value}%
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden border border-border/60 bg-background/50">
        <div className={`h-full ${color} bar-anim`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function MetricRow({
  label,
  hint,
  value,
  raw,
  unit,
  target,
  tone,
}: {
  label: string;
  hint: string;
  value: number;
  raw: number | null;
  unit: string;
  target: number;
  tone: "hud" | "warn";
}) {
  const glow = tone === "warn" ? "glow-warn" : "glow-hud";
  const fill = tone === "warn" ? "bg-hud-warn" : "bg-hud";
  const hasData = raw != null;
  return (
    <div className="border border-border/60 bg-background/40 p-3">
      <div className="flex items-baseline justify-between">
        <div>
          <div className={`text-sm font-bold ${glow}`}>{label}</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {hint}
          </div>
        </div>
        <div className={`text-xl font-bold ${glow}`}>{value}%</div>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden border border-border/60 bg-background/60">
        <div
          className={`h-full ${fill} transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
        <span>
          HEALTHKIT ·{" "}
          {hasData ? (
            <span className={glow}>
              {Number(raw).toLocaleString()} {unit}
            </span>
          ) : (
            <span className="glow-warn">no data</span>
          )}
        </span>
        <span>TARGET · {target} {unit}</span>
      </div>
    </div>
  );
}

function HudButton({
  children,
  onClick,
  tone = "hud",
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  tone?: "hud" | "ghost";
  className?: string;
}) {
  const base =
    "h-11 px-6 font-bold uppercase tracking-[0.28em] text-sm transition border";
  const t =
    tone === "hud"
      ? "border-hud bg-hud/15 text-hud hover:bg-hud/25"
      : "border-border/70 bg-background/40 text-foreground hover:border-hud hover:text-hud";
  return (
    <button onClick={onClick} className={`${base} ${t} ${className}`}>
      {children}
    </button>
  );
}

function Kv({
  k,
  v,
  tone,
}: {
  k: string;
  v: string;
  tone?: "hud" | "warn";
}) {
  return (
    <div className="border border-border/60 bg-background/40 px-2 py-1.5">
      <div className="text-[9px] text-muted-foreground">{k}</div>
      <div
        className={`text-xs font-bold ${
          tone === "warn" ? "glow-warn" : "glow-hud"
        }`}
      >
        {v}
      </div>
    </div>
  );
}

function Hostile({
  label,
  n,
  tone,
}: {
  label: string;
  n: number;
  tone: "warn" | "danger";
}) {
  const g = tone === "danger" ? "glow-danger" : "glow-warn";
  return (
    <div className="border border-border/60 bg-background/40 p-2">
      <div className={`text-xl font-bold ${g}`}>×{n}</div>
      <div className="text-muted-foreground">{label}</div>
    </div>
  );
}

function Award({ label, v }: { label: string; v: string }) {
  return (
    <div className="border border-hud/40 bg-background/40 p-3">
      <div className="glow-hud text-lg font-bold">{v}</div>
      <div className="text-muted-foreground">{label}</div>
    </div>
  );
}

function Countdown({ seconds }: { seconds: number }) {
  const [s, setS] = useState(seconds);
  useEffect(() => {
    const iv = setInterval(() => setS((x) => (x > 0 ? x - 1 : 0)), 1000);
    return () => clearInterval(iv);
  }, []);
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  const critical = s < 60;
  return (
    <div className="text-center">
      <div
        className={`font-mono text-4xl font-bold tracking-widest ${
          critical ? "glow-danger blink" : "glow-hud"
        }`}
      >
        {mm}:{ss}
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        EXFIL WINDOW
      </div>
    </div>
  );
}

// silence unused-import warning for useMemo if not used
void useMemo;
