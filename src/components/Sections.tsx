import { site, mailLink, waLink, type Project } from "@/data/site";
import { Reveal } from "./Reveal";
import { ContactForm } from "./ContactForm";

function SectionHeading({ index, title, path }: { index: string; title: string; path: string }) {
  return (
    <div>
      <p aria-hidden className="font-mono text-xs tracking-[0.2em] text-primary/70">
        {path}
      </p>
      <div className="mt-2.5 flex items-center gap-5">
        <h2 className="text-2xl font-bold sm:text-3xl">
          <span className="mr-2 font-mono text-primary">{index}</span>
          {title}
        </h2>
        <span aria-hidden className="h-px flex-1 bg-border" />
        <span aria-hidden className="h-[3px] w-14 bg-primary" />
      </div>
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20">
      <Reveal>
        <SectionHeading index="01." title="About" path="~/about" />
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
            <p className="font-mono text-xs text-muted-foreground">
              <span className="text-primary">root@stylenet</span>:~$ cat skills.txt
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {site.skills.map((s) => (
                <li
                  key={s}
                  className="rounded-md border border-border bg-background px-2.5 py-1.5 font-mono text-xs text-foreground transition-colors hover:border-primary/60 hover:text-primary"
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

function ProjectCard({ project: p, index }: { project: Project; index: number }) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p aria-hidden className="font-mono text-[11px] text-primary/60">
            {String(index + 1).padStart(3, "0")}
          </p>
          <h3 className="mt-1 text-base font-semibold text-foreground">{p.title}</h3>
        </div>
        {p.href && (
          <span
            aria-hidden
            className="font-mono text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
          >
            ↗
          </span>
        )}
      </div>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
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
    </>
  );
  const cls = "card-lift group flex h-full flex-col rounded-xl border border-border bg-surface p-5";

  return p.href ? (
    <a href={p.href} target="_blank" rel="noopener noreferrer" className={cls}>
      {body}
    </a>
  ) : (
    <article className={cls}>
      {body}
      {p.repo && (
        <a
          href={p.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 font-mono text-xs text-primary hover:underline"
        >
          View source →
        </a>
      )}
    </article>
  );
}

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20">
      <Reveal>
        <SectionHeading index="02." title="Projects" path="~/projects" />
        <p className="mt-3 max-w-xl text-muted-foreground">
          A selection of things I've designed, built and deployed.
        </p>
      </Reveal>
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {site.projects.map((p, i) => (
          <li key={p.title}>
            <Reveal delay={i * 60} className="h-full">
              <ProjectCard project={p} index={i} />
            </Reveal>
          </li>
        ))}
      </ul>
      <Reveal>
        <p className="mt-8 font-mono text-xs text-muted-foreground">
          <span className="text-primary">$</span> Most client work is private — ask for a
          walkthrough of anything above.{" "}
          <a href="#contact" className="text-primary hover:underline">
            Get in touch →
          </a>
        </p>
      </Reveal>
    </section>
  );
}

export function Services() {
  return (
    <section id="services" className="scroll-mt-24 border-y border-border bg-surface/40 py-20">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <SectionHeading index="03." title="Services" path="~/services" />
          <p className="mt-3 max-w-xl text-muted-foreground">
            Build it, host it, keep it running — under one roof.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {site.services.map((s, i) => (
            <Reveal key={s.title} delay={i * 70} className="h-full">
              <article className="card-lift flex h-full flex-col rounded-xl border border-border bg-background p-6">
                <p aria-hidden className="font-mono text-[11px] text-primary/60">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-1 text-lg font-semibold">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
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
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent("select-service", { detail: s.title }));
                  }}
                  className="mt-6 inline-flex justify-center rounded-md border border-border px-4 py-2.5 font-mono text-sm font-semibold transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
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

export function Process() {
  return (
    <section id="process" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20">
      <Reveal>
        <SectionHeading index="04." title="How I work" path="~/process" />
        <p className="mt-3 max-w-xl text-muted-foreground">
          From first message to a site that stays up — four steps, one point of contact.
        </p>
      </Reveal>
      <ol className="relative mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <span
          aria-hidden
          className="absolute left-0 right-0 top-[1.4rem] hidden h-px bg-gradient-to-r from-primary/60 via-border to-transparent lg:block"
        />
        {site.process.map((step, i) => (
          <li key={step.step} className="relative">
            <Reveal delay={i * 80} className="h-full">
              <div className="flex h-full flex-col">
                <span className="relative z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/50 bg-background font-mono text-sm font-bold text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{step.step}</h3>
                <p className="mt-1 font-mono text-xs text-primary/80">
                  <span className="text-muted-foreground">$</span> {step.command}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20">
      <Reveal>
        <SectionHeading index="05." title="Contact" path="~/contact" />
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
              {
                label: "GitHub",
                value: site.github.replace(/^https?:\/\//, ""),
                href: site.github,
              },
            ].map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  {...(c.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="card-lift group flex items-center justify-between gap-4 rounded-lg border border-border bg-surface px-4 py-3.5"
                >
                  <span className="font-mono text-xs text-muted-foreground">{c.label}</span>
                  <span className="flex min-w-0 items-center gap-2 font-mono text-sm text-foreground">
                    <span className="min-w-0 truncate">{c.value}</span>
                    <span
                      aria-hidden
                      className="text-primary opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      ↗
                    </span>
                  </span>
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
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:grid-cols-[minmax(0,1.4fr)_repeat(2,minmax(0,1fr))]">
        <div>
          <p className="font-mono text-sm font-bold">
            <span className="text-primary">$</span> {site.handle}
            <span className="font-normal text-muted-foreground"> / {site.name}</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">{site.tagline}</p>
          <p className="mt-4 font-mono text-xs text-muted-foreground">
            Press{" "}
            <kbd className="rounded border border-border px-1.5 py-0.5 text-foreground">Ctrl</kbd>{" "}
            <kbd className="rounded border border-border px-1.5 py-0.5 text-foreground">K</kbd> to
            jump anywhere.
          </p>
        </div>
        <nav aria-label="Footer">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Site</p>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              ["About", "/#about"],
              ["Projects", "/#projects"],
              ["Services", "/#services"],
              ["Blog", "/blog"],
            ].map(([label, href]) => (
              <li key={href}>
                <a href={href} className="text-muted-foreground hover:text-primary">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Contact
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href={mailLink} className="text-muted-foreground hover:text-primary">
                Email
              </a>
            </li>
            <li>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href={site.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-5 font-mono text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {site.name} · {site.altName} · {site.location}
          </p>
          <a href="#top" className="text-primary hover:underline">
            ↑ Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
