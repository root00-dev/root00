import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Copy,
  FileText,
  Github,
  Hash,
  Mail,
  MessageCircle,
  SunMoon,
} from "lucide-react";
import { Command as CommandPrimitive } from "cmdk";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { site, mailLink, waLink } from "@/data/site";
import { toggleTheme } from "@/lib/theme";

const sections = [
  { id: "top", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "services", label: "Services" },
  { id: "process", label: "How I work" },
  { id: "contact", label: "Contact" },
];

export const OPEN_COMMAND_MENU = "open-command-menu";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_COMMAND_MENU, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_COMMAND_MENU, onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) setCopied(false);
  }, [open]);

  const run = (fn: () => void) => {
    setOpen(false);
    fn();
  };

  const goToSection = (id: string) =>
    run(() => {
      if (window.location.pathname === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        history.replaceState(null, "", `#${id}`);
      } else {
        void navigate({ to: "/", hash: id });
      }
    });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="top-[20%] max-w-xl translate-y-0 overflow-hidden border-border bg-popover p-0 shadow-2xl [&>button:last-child]:hidden">
        <DialogTitle className="sr-only">Command menu</DialogTitle>
        <DialogDescription className="sr-only">
          Jump to a section, open a post or contact {site.handle}.
        </DialogDescription>
        <CommandPrimitive
          loop
          className="flex h-full w-full flex-col overflow-hidden bg-popover font-mono text-popover-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:py-2.5"
        >
          <div className="flex items-center gap-2 border-b border-border px-3 text-primary">
            <span aria-hidden className="font-mono text-sm">
              ❯
            </span>
            <div className="flex-1 [&_[cmdk-input-wrapper]]:border-0 [&_[cmdk-input-wrapper]]:px-0 [&_svg]:hidden">
              <CommandInput placeholder="Type a command or search…" className="text-foreground" />
            </div>
            <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
              ESC
            </kbd>
          </div>
          <CommandList className="max-h-[min(60vh,380px)] px-2 pb-2">
            <CommandEmpty>No matches. Try “contact” or “blog”.</CommandEmpty>
            <CommandGroup heading="Navigate">
              {sections.map((s) => (
                <CommandItem
                  key={s.id}
                  value={`section ${s.label}`}
                  onSelect={() => goToSection(s.id)}
                >
                  <Hash aria-hidden />
                  {s.label}
                </CommandItem>
              ))}
              <CommandItem
                value="blog notes writing"
                onSelect={() => run(() => void navigate({ to: "/blog" }))}
              >
                <FileText aria-hidden />
                Blog
              </CommandItem>
            </CommandGroup>
            <CommandGroup heading="Posts">
              {site.posts.map((p) => (
                <CommandItem
                  key={p.slug}
                  value={`post ${p.title} ${p.tags.join(" ")}`}
                  onSelect={() =>
                    run(() => void navigate({ to: "/blog/$slug", params: { slug: p.slug } }))
                  }
                >
                  <ArrowRight aria-hidden />
                  <span className="truncate">{p.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator className="my-1" />
            <CommandGroup heading="Contact">
              <CommandItem
                value="copy email address"
                onSelect={() => {
                  void navigator.clipboard?.writeText(site.email).then(() => setCopied(true));
                }}
              >
                <Copy aria-hidden />
                {copied ? "Copied!" : "Copy email address"}
                <CommandShortcut>{site.email}</CommandShortcut>
              </CommandItem>
              <CommandItem
                value="send email"
                onSelect={() => run(() => (window.location.href = mailLink))}
              >
                <Mail aria-hidden />
                Send an email
              </CommandItem>
              <CommandItem
                value="whatsapp chat message"
                onSelect={() => run(() => window.open(waLink, "_blank", "noopener"))}
              >
                <MessageCircle aria-hidden />
                Chat on WhatsApp
              </CommandItem>
              <CommandItem
                value="github code source"
                onSelect={() => run(() => window.open(site.github, "_blank", "noopener"))}
              >
                <Github aria-hidden />
                GitHub
              </CommandItem>
            </CommandGroup>
            <CommandGroup heading="Preferences">
              <CommandItem value="toggle theme dark light mode" onSelect={() => run(toggleTheme)}>
                <SunMoon aria-hidden />
                Toggle light / dark theme
              </CommandItem>
            </CommandGroup>
          </CommandList>
          <div className="flex items-center justify-between border-t border-border px-3 py-2 text-[10px] text-muted-foreground">
            <span>↑↓ navigate · ↵ select</span>
            <span>
              <span className="text-primary">{site.handle}</span>@stylenet
            </span>
          </div>
        </CommandPrimitive>
      </DialogContent>
    </Dialog>
  );
}
