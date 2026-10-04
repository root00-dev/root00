// ─────────────────────────────────────────────────────────────
// EDIT EVERYTHING HERE. No markup changes needed.
// ─────────────────────────────────────────────────────────────

export const site = {
  handle: "_root",
  name: "StyleNET Devs",
  altName: "StyleNET IT Group",
  location: "Harare, Zimbabwe",
  tagline: "I build software and keep it online.",
  valueProp:
    "Full-stack developer and cloud hosting reseller — shipping web apps, then running them on fast, affordable VPS infrastructure.",
  terminalLines: [
    "whoami → _root",
    "stack → typescript · node · linux · nginx",
    "status → available for work",
  ],
  email: "hello@stylenet.co.zw",
  whatsapp: "+263771234567", // digits only for wa.me
  github: "https://github.com/",
  sceneLabel: "SCULPTURE_V.03",

  about: [
    "I'm _root, a developer based in Harare running StyleNET Devs. I build web and software products end to end — from the data model to the deploy script — and I care most about things that stay fast and stay up.",
    "Alongside development I run a cloud hosting arm, reselling VPS and shared hosting. That means when I hand over a project, I can also own the server, the domain, the SSL and the uptime, so clients only ever talk to one person.",
  ],

  skills: [
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "PostgreSQL",
    "Linux / Ubuntu",
    "Nginx",
    "Docker",
    "Cloudflare",
    "Git & CI",
  ],

  projects: [
    {
      title: "StyleNET Hosting Panel",
      description: "Self-service client portal for provisioning and billing VPS plans.",
      tags: ["React", "Node", "PostgreSQL"],
      link: "#contact",
    },
    {
      title: "Chiedza POS",
      description: "Offline-first point of sale built for small Zimbabwean retailers.",
      tags: ["TypeScript", "IndexedDB", "PWA"],
      link: "#contact",
    },
    {
      title: "Deploy Kit",
      description: "One-command Nginx + Certbot + Node deploy scripts for fresh VPS boxes.",
      tags: ["Bash", "Nginx", "Linux"],
      link: "#contact",
    },
    {
      title: "Msika API",
      description: "Marketplace backend with escrow-style payments and vendor payouts.",
      tags: ["Node", "REST", "Paynow"],
      link: "#contact",
    },
    {
      title: "Uptime Sentinel",
      description: "Lightweight monitoring that pings client sites and alerts on WhatsApp.",
      tags: ["Python", "Cron", "Webhooks"],
      link: "#contact",
    },
    {
      title: "Harare Devs Board",
      description: "Community job board for local developers and studios.",
      tags: ["React", "Supabase"],
      link: "#contact",
    },
  ],

  posts: [
    {
      slug: "why-i-host-what-i-build",
      title: "Why I host everything I build",
      excerpt:
        "Handing over a project without the server is half a job. Here's why I keep development and hosting under one roof.",
      date: "2026-09-14",
      tags: ["Hosting", "Opinion"],
    },
    {
      slug: "deploying-node-on-a-fresh-vps",
      title: "Deploying a Node app on a fresh VPS in 15 minutes",
      excerpt:
        "Nginx, Certbot, a systemd unit and a firewall — the exact checklist I run on every new box.",
      date: "2026-08-02",
      tags: ["Linux", "Nginx", "Tutorial"],
    },
    {
      slug: "offline-first-in-zimbabwe",
      title: "Building offline-first apps for Zimbabwean networks",
      excerpt:
        "Data is expensive and connections drop. What I learned building a POS that keeps working through both.",
      date: "2026-06-21",
      tags: ["PWA", "Case study"],
    },
  ],

  services: [
    {
      title: "Web & Software Development",
      description:
        "Custom websites, dashboards, APIs and internal tools. Built with modern tooling, documented, and handed over with deployment included.",
      points: ["Landing pages & marketing sites", "Web apps & dashboards", "APIs and integrations"],
    },
    {
      title: "Cloud Hosting & VPS",
      description:
        "Managed VPS and shared hosting through StyleNET IT Group. Setup, hardening, SSL, backups and monitoring handled for you.",
      points: ["VPS provisioning & setup", "Domains, DNS & SSL", "Backups and monitoring"],
    },
    {
      title: "Maintenance & Support",
      description:
        "Ongoing care for sites and servers already in production — updates, performance work and incident response.",
      points: ["Security updates", "Performance tuning", "Emergency fixes"],
    },
  ],
} as const;

export const waLink = `https://wa.me/${site.whatsapp.replace(/[^\d]/g, "")}`;
export const mailLink = `mailto:${site.email}`;
