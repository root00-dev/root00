import { lazy, Suspense, useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { site } from "@/data/site";
import type { HeroPointer, RotateInfo } from "./HeroScene";

// three.js is ~1 MB of JS; keep it out of the initial bundle and only fetch it
// on desktop-sized screens once the page is idle.
const HeroScene = lazy(() => import("./HeroScene").then((m) => ({ default: m.HeroScene })));

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

function useSceneGate(section: React.RefObject<HTMLElement | null>) {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    const lowData = connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType ?? "");
    if (!window.matchMedia("(min-width: 1024px)").matches || lowData) return;

    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const id = idle(() => setEnabled(true), { timeout: 2000 });
    return () => cancel(id);
  }, []);

  useEffect(() => {
    const el = section.current;
    if (!enabled || !el) return;
    let inView = true;
    const update = () => setActive(inView && document.visibilityState === "visible");
    const io = new IntersectionObserver(([entry]) => {
      inView = entry?.isIntersecting ?? true;
      update();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", update);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [enabled, section]);

  return { enabled, active };
}

function useTyped(lines: readonly string[]) {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setText(lines[0] ?? "");
      return;
    }
    const full = lines[index % lines.length] ?? "";
    if (text === full) {
      const hold = setTimeout(() => {
        setText("");
        setIndex((i) => i + 1);
      }, 1800);
      return () => clearTimeout(hold);
    }
    const t = setTimeout(() => setText(full.slice(0, text.length + 1)), 45);
    return () => clearTimeout(t);
  }, [text, index, lines]);

  return text;
}

const RAD = 180 / Math.PI;
const formatAngle = (radians: number) => {
  const deg = (((radians * RAD) % 360) + 360) % 360;
  return deg.toFixed(2).padStart(6, "0");
};

export function Hero() {
  const typed = useTyped(site.terminalLines);
  const pointer = useRef<HeroPointer>({ x: 0, y: 0, active: false });
  const cursor = useRef<HTMLSpanElement>(null);
  const section = useRef<HTMLElement>(null);
  const telemetryX = useRef<HTMLDivElement>(null);
  const telemetryY = useRef<HTMLDivElement>(null);
  const [cursorActive, setCursorActive] = useState(false);
  const scene = useSceneGate(section);

  // Written straight to the DOM so the 3D loop never re-renders the hero.
  const handleTelemetry = useCallback((next: RotateInfo) => {
    if (telemetryX.current) telemetryX.current.textContent = `X: ${formatAngle(next.y)}`;
    if (telemetryY.current) telemetryY.current.textContent = `Y: ${formatAngle(next.x)}`;
  }, []);

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!scene.enabled || event.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const active = x >= 0.5;
    pointer.current.x = Math.max(-1, Math.min(1, (x - 0.75) * 4));
    pointer.current.y = Math.max(
      -1,
      Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2),
    );
    pointer.current.active = active;
    if (cursor.current)
      cursor.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    if (active !== cursorActive) setCursorActive(active);
  };

  const handlePointerLeave = () => {
    pointer.current.active = false;
    setCursorActive(false);
  };

  return (
    <section
      id="top"
      ref={section}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative flex min-h-[100svh] flex-col overflow-hidden ${cursorActive ? "hero-cursor-active" : ""}`}
    >
      <div aria-hidden className="grid-backdrop pointer-events-none absolute inset-0" />
      {scene.enabled && (
        <Suspense fallback={null}>
          <HeroScene pointer={pointer} onRotate={handleTelemetry} active={scene.active} />
        </Suspense>
      )}
      <span
        ref={cursor}
        aria-hidden="true"
        className={`hero-cursor ${cursorActive ? "hero-cursor-visible" : ""}`}
      >
        <span className="hero-cursor-ring" />
        <span className="hero-cursor-dot" />
      </span>

      {/* Corner crosshair accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-6 top-28 hidden h-7 w-7 border-l-2 border-t-2 border-border sm:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-10 right-6 hidden h-7 w-7 border-b-2 border-r-2 border-border sm:block"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 items-center px-5 pb-24 pt-32 sm:pt-36">
        <div className="grid w-full items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left: message column */}
          <div className="flex flex-col items-start gap-8 lg:col-span-7">
            <p className="inline-flex items-center gap-2.5 rounded-full border border-border bg-surface px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground shadow-sm">
              <span className="relative flex h-2 w-2">
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60"
                  aria-hidden
                />
                <span
                  className="relative inline-flex h-2 w-2 rounded-full bg-primary"
                  aria-hidden
                />
              </span>
              {site.location} · available for work
            </p>

            <h1 className="text-4xl font-bold leading-[1.05] tracking-tighter sm:text-6xl lg:text-7xl">
              <span className="text-primary">{site.handle}</span>
              <span className="block text-foreground">{site.tagline}</span>
            </h1>

            <div className="terminal-window w-full max-w-xl px-5 py-4" aria-live="off">
              <div className="flex gap-1.5" aria-hidden>
                <span className="h-2.5 w-2.5 rounded-full bg-dot-red/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-dot-amber/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-dot-green/60" />
              </div>
              <div className="mt-3 font-mono text-lg text-terminal-fg sm:text-xl">
                <span className="text-primary">➜ </span>
                <span className="caret">{typed}</span>
              </div>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-terminal-muted">
                {site.valueProp}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-1">
              <a
                href="#projects"
                className="btn-hard rounded-sm bg-primary px-7 py-3.5 font-mono text-sm font-bold uppercase tracking-wide text-primary-foreground"
              >
                View projects
              </a>
              <a
                href="#contact"
                className="rounded-sm border-2 border-foreground px-7 py-3.5 font-mono text-sm font-bold uppercase tracking-wide text-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                Get in touch
              </a>
            </div>
          </div>

          {/* Right: framed viewport + telemetry (decorative, scene renders behind) */}
          <div aria-hidden className="relative hidden lg:col-span-5 lg:block">
            <div className="viewport-frame relative mx-auto aspect-square w-full max-w-[26rem]">
              <span className="absolute right-3 top-2.5 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                {site.sceneLabel}
              </span>
              <div className="absolute -left-7 top-1/4 space-y-1 border-l border-primary/60 pl-2 font-mono text-[10px] uppercase tracking-tight text-muted-foreground/70">
                <div ref={telemetryX}>X: {formatAngle(0)}</div>
                <div ref={telemetryY}>Y: {formatAngle(0)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade + scroll cue */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background to-transparent"
      />
      <a
        href="#about"
        className="group relative z-10 mx-auto mb-5 flex flex-col items-center gap-2 transition-opacity hover:opacity-70"
      >
        <span aria-hidden className="scroll-cue-line h-12 w-px bg-border" />
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
          Scroll to explore
        </span>
      </a>
    </section>
  );
}
