import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { site } from "@/data/site";
import { CommandMenu, OPEN_COMMAND_MENU } from "./CommandMenu";
import { ThemeToggle } from "./ThemeToggle";

// Anchors are absolute ("/#about") so they also work from other pages like /blog.
const links = [
  { href: "/#about", label: "About" },
  { href: "/#projects", label: "Projects" },
  { href: "/#services", label: "Services" },
  { href: "/#contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
];

const openCommandMenu = () => window.dispatchEvent(new Event(OPEN_COMMAND_MENU));

export function Nav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<string | null>(null);
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform));
  }, []);

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
  }, [pathname]);

  useEffect(() => {
    setActive(null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    links.forEach((l) => {
      const id = l.href.split("#")[1];
      const el = id ? document.getElementById(id) : null;
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => {
    const id = href.split("#")[1];
    if (id) return pathname === "/" && active === id;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors ${
        scrolled || open
          ? "border-b border-border bg-background/85 backdrop-blur"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
        <a href="/#top" className="flex min-w-0 items-center gap-2 font-mono text-sm font-bold">
          <span className="text-primary">$</span>
          <span className="truncate">{site.handle}</span>
          <span className="hidden truncate text-muted-foreground lg:inline">/ {site.name}</span>
        </a>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`rounded-md px-3 py-2 font-mono text-sm transition-colors hover:bg-secondary hover:text-foreground ${
                isActive(l.href) ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </a>
          ))}
          <button
            type="button"
            onClick={openCommandMenu}
            aria-label="Open command menu"
            className="ml-1 inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-2.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
          >
            <kbd className="font-mono">{isMac ? "⌘" : "Ctrl"}</kbd>
            <kbd className="font-mono">K</kbd>
          </button>
          <ThemeToggle className="ml-1" />
          <a
            href="/#contact"
            className="btn-hard ml-2 rounded-md bg-primary px-3.5 py-2 font-mono text-sm font-semibold text-primary-foreground"
          >
            Hire me
          </a>
        </nav>

        <div className="flex shrink-0 items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            className="h-9 rounded-md border border-border px-3 font-mono text-sm"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-border bg-background px-5 py-3 md:hidden"
        >
          <ul className="flex flex-col">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={`block rounded-md px-2 py-3 font-mono text-sm hover:text-foreground ${
                    isActive(l.href) ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <span aria-hidden className="mr-2 text-primary/60">
                    ./
                  </span>
                  {l.label.toLowerCase()}
                </a>
              </li>
            ))}
            <li className="mt-2 border-t border-border pt-3">
              <a
                href="/#contact"
                onClick={() => setOpen(false)}
                className="btn-hard block rounded-md bg-primary px-3 py-3 text-center font-mono text-sm font-semibold text-primary-foreground"
              >
                Hire me
              </a>
            </li>
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
      <CommandMenu />
    </header>
  );
}
