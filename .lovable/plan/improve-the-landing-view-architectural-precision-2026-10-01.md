# Improve the landing view — "Architectural Precision"

The hero is rebuilt in the selected direction: technical-grid precision, a framed 3D viewport,
a dark terminal window, and hard-edged brutalist buttons. Scope is the hero section only —
nav, About, Projects, Services, Contact and Footer are untouched.

## What changes (what you'll see)

- **Technical grid background** — the current faint grid becomes a two-layer precision grid
  (fine 40px lines + coarse 200px lines, both very low opacity) that fades out radially, giving
  the section a drafting-table feel.
- **Status pill** — restyled with a pulsing green dot and uppercase letter-spaced mono text.
- **Headline** — keeps the existing copy ("_root / I build software and keep it online.") but at a
  tighter, larger scale with the same terminal voice.
- **Terminal window** — the plain typing line becomes a dark near-black terminal card with
  traffic-light dots, a green left rule, the live typewriter loop (`➜ whoami → _root` …), and a
  slight -1° tilt that straightens on hover.
- **Buttons** — "View projects" becomes a solid green button with a hard 4px offset shadow that
  presses down on hover; "Get in touch" becomes a dark-outlined button that fills dark on hover.
- **Framed 3D viewport** — the R3F sculpture sits inside a thin viewport frame with corner
  accents, a small `SCULPTURE_V.03`-style label, and live X/Y telemetry callouts that read the
  sculpture's actual rotation (the numbers move as it drifts).
- **Scroll cue** — a vertical line + "SCROLL TO EXPLORE" caption over a gradient fade into the
  About section, removing the abrupt empty gap below the hero.
- **Corner accents** — thin crosshair brackets top-left and bottom-right of the section.
- **3D scene** — same sculpture (client-mounted R3F behind the SSR content, per project rules),
  restyled to read clearly on the light background: deeper stroke opacity, adjusted lighting,
  slightly smaller footprint. It keeps the cursor-follow behavior and the animated ring cursor.
- **Mobile** — the sculpture moves below/behind the text without overlapping the headline;
  frame and telemetry hide on small screens; grid simplifies.

## Files touched

- `src/components/Hero.tsx` — new layout, terminal window, buttons, scroll cue, telemetry state
  (rotation values passed up from the scene), pointer/cursor logic kept.
- `src/components/HeroScene.tsx` — restyled materials/lighting, reports core rotation to Hero for
  the X/Y callouts, size/position adjustments for mobile.
- `src/styles.css` — grid layers, terminal window, offset-shadow buttons, viewport frame, scroll
  cue, telemetry styling (semantic tokens, no hardcoded colors in components).
- `src/data/site.ts` — only if a new label (e.g. viewport frame caption) belongs in config.

## Constraints

- Copy stays exactly as it is in the config file; no new content invented.
- The page stays server-rendered; the 3D scene remains a client-mounted component.
- Reduced-motion behavior preserved (typewriter static, sculpture paused, no cursor ring).
- All colors through the existing design tokens in `src/styles.css`.

## Verification

- Playwright screenshots: desktop hero, mobile hero, and the hero→About transition.
- Check the build log shows no errors; confirm the typing loop, cursor ring and
  sculpture-follow still work.
