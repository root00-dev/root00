import { useEffect, useRef, useState, type PointerEvent } from "react";
import { site } from "@/data/site";
import { HeroScene, type HeroPointer } from "./HeroScene";

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

export function Hero() {
  const typed = useTyped(site.terminalLines);
  const pointer = useRef<HeroPointer>({ x: 0, y: 0, active: false });
  const cursor = useRef<HTMLSpanElement>(null);
  const [cursorActive, setCursorActive] = useState(false);

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const active = x >= 0.5;
    pointer.current.x = Math.max(-1, Math.min(1, (x - 0.75) * 4));
    pointer.current.y = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2));
    pointer.current.active = active;
    if (cursor.current) cursor.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    if (active !== cursorActive) setCursorActive(active);
  };

  const handlePointerLeave = () => {
    pointer.current.active = false;
    setCursorActive(false);
  };

  return (
    <section id="top" onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave} className={`relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28 ${cursorActive ? "hero-cursor-active" : ""}`}>
      <div aria-hidden className="grid-backdrop pointer-events-none absolute inset-0" />
      <HeroScene pointer={pointer} />
      <span ref={cursor} aria-hidden="true" className={`hero-cursor ${cursorActive ? "hero-cursor-visible" : ""}`}><span className="hero-cursor-ring" /><span className="hero-cursor-dot" /></span>

      <div className="relative mx-auto max-w-6xl px-5">
        <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 font-mono text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
          {site.location} · available for work
        </p>

        <h1 className="mt-6 text-4xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl">
          <span className="text-primary">{site.handle}</span>
          <span className="block text-foreground">{site.tagline}</span>
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {site.valueProp}
        </p>

        <div
          className="mt-7 max-w-xl rounded-lg border border-border bg-surface px-4 py-3 font-mono text-sm"
          aria-live="off"
        >
          <span className="text-primary">➜ </span>
          <span className="caret text-muted-foreground">{typed}</span>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#projects"
            className="accent-glow rounded-md bg-primary px-5 py-3 font-mono text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            View projects
          </a>
          <a
            href="#contact"
            className="rounded-md border border-border bg-surface px-5 py-3 font-mono text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            Get in touch
          </a>
        </div>
      </div>
    </section>
  );
}
