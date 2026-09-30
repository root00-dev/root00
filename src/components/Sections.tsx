import { site, mailLink, waLink } from "@/data/site";
import { Reveal } from "./Reveal";
import { ContactForm } from "./ContactForm";

function SectionHeading({ index, title }: { index: string; title: string }) {
  return (
    <h2 className="text-2xl font-bold sm:text-3xl">
      <span className="mr-2 font-mono text-primary">{index}</span>
      {title}
    </h2>
  );
}

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20">
      <Reveal>
        <SectionHeading index="01." title="About" />
      </Reveal>
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Reveal delay={60}>
          <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
            {site.about.map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-mono text-sm text-muted-foreground">~/stack</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {site.skills.map((s) => (
                <li
                  key={s}
                  className="rounded-md border border-border bg-background px-2.5 py-1.5 font-mono text-xs text-foreground"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20">
      <Reveal>
        <SectionHeading index="02." title="Projects" />
        <p className="mt-3 max-w-xl text-muted-foreground">
          A selection of things I've designed, built and deployed.
        </p>
      </Reveal>
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {site.projects.map((p, i) => (
          <li key={p.title}>
            <Reveal delay={i * 60}>
              <a
                href={p.link}
                className="group flex h-full flex-col rounded-xl border border-border bg-surface p-5 transition-colors hover:border-primary/60"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold text-foreground">{p.title}</h3>
                  <span
                    aria-hidden
                    className="font-mono text-primary transition-transform group-hover:translate-x-0.5"
                  >
                    ↗
                  </span>
                </div>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {p.description}
                </p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <li
                      key={t}
                      className="rounded border border-border px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </a>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Services() {
  return (
    <section id="services" className="scroll-mt-24 border-y border-border bg-surface/40 py-20">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <SectionHeading index="03." title="Services" />
          <p className="mt-3 max-w-xl text-muted-foreground">
            Build it, host it, keep it running — under one roof.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {site.services.map((s, i) => (
            <Reveal key={s.title} delay={i * 70} className="h-full">
              <article className="flex h-full flex-col rounded-xl border border-border bg-background p-6">
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
                <ul className="mt-4 flex-1 space-y-2">
                  {s.points.map((pt) => (
                    <li key={pt} className="flex gap-2 font-mono text-xs text-muted-foreground">
                      <span className="text-primary" aria-hidden>
                        ▸
                      </span>
                      {pt}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className="mt-6 inline-flex justify-center rounded-md border border-border px-4 py-2.5 font-mono text-sm font-semibold transition-colors hover:border-primary/60 hover:bg-secondary"
                >
                  Contact for a quote
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20">
      <Reveal>
        <SectionHeading index="04." title="Contact" />
        <p className="mt-3 max-w-xl text-muted-foreground">
          Tell me about the project or the hosting you need. I usually reply within a day.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <Reveal>
          <ul className="space-y-3">
            {[
              { label: "Email", value: site.email, href: mailLink },
              { label: "WhatsApp", value: site.whatsapp, href: waLink },
              { label: "GitHub", value: site.github.replace(/^https?:\/\//, ""), href: site.github },
            ].map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  className="flex items-center justify-between gap-4 rounded-lg border border-border bg-surface px-4 py-3.5 transition-colors hover:border-primary/60"
                >
                  <span className="font-mono text-xs text-muted-foreground">{c.label}</span>
                  <span className="min-w-0 truncate font-mono text-sm text-foreground">{c.value}</span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={80}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-8 sm:flex sm:justify-between">
        <p className="min-w-0 font-mono text-xs text-muted-foreground">
          © {new Date().getFullYear()} {site.name} · {site.altName}
        </p>
        <a href="#top" className="shrink-0 font-mono text-xs text-primary hover:underline">
          ↑ Back to top
        </a>
      </div>
    </footer>
  );
}
