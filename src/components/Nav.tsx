import { useEffect, useState } from "react";
import { site } from "@/data/site";

// Anchors are absolute ("/#about") so they also work from other pages like /blog.
const links = [
  { href: "/#about", label: "About" },
  { href: "/#projects", label: "Projects" },
  { href: "/#services", label: "Services" },
  { href: "/#contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    links.forEach((l) => {
      const el = document.getElementById(l.href.slice(1));
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors ${
        scrolled ? "border-b border-border bg-background/85 backdrop-blur" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3.5 sm:flex sm:justify-between">
        <a href="/#top" className="flex min-w-0 items-center gap-2 font-mono text-sm font-bold">
          <span className="text-primary">$</span>
          <span className="truncate">{site.handle}</span>
          <span className="hidden truncate text-muted-foreground sm:inline">/ {site.name}</span>
        </a>

        <nav aria-label="Main" className="hidden items-center gap-1 sm:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              aria-current={active === l.href.slice(1) ? "true" : undefined}
              className={`rounded-md px-3 py-2 font-mono text-sm transition-colors hover:bg-secondary hover:text-foreground ${
                active === l.href.slice(1) ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </a>
          ))}
          <a
            href="/#contact"
            className="btn-hard ml-2 rounded-md bg-primary px-3.5 py-2 font-mono text-sm font-semibold text-primary-foreground"
          >
            Hire me
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="Toggle navigation menu"
          className="shrink-0 rounded-md border border-border px-3 py-2 font-mono text-sm sm:hidden"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-border bg-background px-5 py-3 sm:hidden"
        >
          <ul className="flex flex-col">
            {[...links, { href: "/#contact", label: "Hire me" }].map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-md px-2 py-3 font-mono text-sm hover:text-foreground ${
                    active === l.href.slice(1) ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Scroll progress line along the bottom edge of the header */}
      <div
        aria-hidden
        className={`absolute inset-x-0 bottom-0 h-[2px] transition-opacity ${
          scrolled ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className="h-full origin-left bg-primary"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
    </header>
  );
}
