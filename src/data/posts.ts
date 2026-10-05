// ─────────────────────────────────────────────────────────────
// Blog post bodies, keyed by the slug in site.posts.
// Inline `backticks` render as code. Add a post by adding an entry
// to site.posts (title, date, excerpt, tags) and a body here.
// ─────────────────────────────────────────────────────────────

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; lang: string; code: string }
  | { type: "quote"; text: string };

export const postBodies: Record<string, Block[]> = {
  "why-i-host-what-i-build": [
    {
      type: "p",
      text: 'Most web projects in Harare end the same way: the developer hands over a zip file or a repository link, the client is told to "find hosting", and three months later the site is down because a domain lapsed, an SSL certificate expired or a cheap shared host got overloaded. Nobody is clearly responsible, so nobody fixes it.',
    },
    {
      type: "p",
      text: "That gap is the reason StyleNET Devs does both development and hosting. Handing over a project without the server is half a job.",
    },
    { type: "h2", text: "One person owns the whole stack" },
    {
      type: "p",
      text: "When I build a project and also run the server it lives on, there is exactly one place to call when something breaks. I know how the app is deployed, where the logs are, what the database backup schedule is and which environment variables matter. There is no finger-pointing between a developer and a hosting company.",
    },
    { type: "h2", text: "Hosting shapes how software should be built" },
    {
      type: "p",
      text: "Deployment is not a step you bolt on at the end. Knowing the target server from day one changes real decisions:",
    },
    {
      type: "list",
      items: [
        "How much memory the app can use, and whether a background job belongs in the same process.",
        "Whether static pages can be cached at the edge so a slow local connection still loads them quickly.",
        "Where uploads are stored, and how they are backed up.",
        "What a deploy looks like, and how fast it can be rolled back.",
      ],
    },
    { type: "h2", text: "What clients actually get" },
    {
      type: "list",
      items: [
        "A domain, DNS and SSL set up correctly and renewed automatically.",
        "A server that is patched, firewalled and monitored.",
        "Automatic backups that have actually been restored at least once.",
        "One invoice and one WhatsApp number for the whole thing.",
      ],
    },
    {
      type: "quote",
      text: "The best time to think about hosting is before the first line of code, not after the launch party.",
    },
    {
      type: "p",
      text: "Not every client needs managed hosting, and I will happily deploy to infrastructure you already have. But if you want a site or app that stays up without you thinking about it, building and hosting under one roof is the simplest way to get there.",
    },
  ],

  "deploying-node-on-a-fresh-vps": [
    {
      type: "p",
      text: "This is the checklist I run on every new Ubuntu server before a Node.js app goes live. It assumes Ubuntu 24.04, a domain whose A record already points at the server, and an app that listens on port 3000.",
    },
    { type: "h2", text: "1. Create a deploy user and lock down SSH" },
    {
      type: "p",
      text: "Never run the app as root. Create a user, give it your SSH key, then disable password logins.",
    },
    {
      type: "code",
      lang: "bash",
      code: `adduser deploy
usermod -aG sudo deploy
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy

# in /etc/ssh/sshd_config set:
#   PasswordAuthentication no
#   PermitRootLogin no
sudo systemctl restart ssh`,
    },
    { type: "h2", text: "2. Turn on the firewall" },
    {
      type: "code",
      lang: "bash",
      code: `sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable`,
    },
    {
      type: "p",
      text: "Allow SSH before enabling ufw, or you will lock yourself out. Port 3000 stays closed to the internet — only Nginx talks to the app.",
    },
    { type: "h2", text: "3. Install Node.js and the app" },
    {
      type: "code",
      lang: "bash",
      code: `curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs nginx

git clone https://github.com/you/app.git /home/deploy/app
cd /home/deploy/app && npm ci && npm run build`,
    },
    { type: "h2", text: "4. Run it with systemd" },
    {
      type: "p",
      text: "systemd restarts the app if it crashes and starts it again after a reboot. No extra process manager needed.",
    },
    {
      type: "code",
      lang: "ini",
      code: `# /etc/systemd/system/app.service
[Unit]
Description=Node app
After=network.target

[Service]
User=deploy
WorkingDirectory=/home/deploy/app
Environment=NODE_ENV=production PORT=3000
ExecStart=/usr/bin/node server.js
Restart=always

[Install]
WantedBy=multi-user.target`,
    },
    {
      type: "code",
      lang: "bash",
      code: `sudo systemctl daemon-reload
sudo systemctl enable --now app
journalctl -u app -f   # follow the logs`,
    },
    { type: "h2", text: "5. Put Nginx in front" },
    {
      type: "code",
      lang: "nginx",
      code: `# /etc/nginx/sites-available/app
server {
    listen 80;
    server_name example.co.zw;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`,
    },
    {
      type: "code",
      lang: "bash",
      code: `sudo ln -s /etc/nginx/sites-available/app /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx`,
    },
    { type: "h2", text: "6. Free SSL with Certbot" },
    {
      type: "code",
      lang: "bash",
      code: `sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d example.co.zw`,
    },
    {
      type: "p",
      text: "Certbot edits the Nginx config to serve HTTPS and installs a timer that renews the certificate automatically. Check it with `sudo certbot renew --dry-run`.",
    },
    { type: "h2", text: "Before calling it done" },
    {
      type: "list",
      items: [
        "Reboot the server and confirm the app comes back on its own.",
        "Turn on unattended security upgrades: `sudo apt-get install unattended-upgrades`.",
        "Set up backups for the database and any uploaded files, and test a restore.",
        "Add an uptime check so you hear about downtime before your users do.",
      ],
    },
  ],

  "offline-first-in-zimbabwe": [
    {
      type: "p",
      text: "Mobile data in Zimbabwe is expensive, connections drop without warning, and load-shedding can take the shop router down for hours. Software built on the assumption of a fast, permanent connection fails here in ways that cost real money — a till that cannot ring up a sale is a lost sale.",
    },
    {
      type: "p",
      text: "These are the principles I follow when an app has to keep working through all of that.",
    },
    { type: "h2", text: "Treat the network as optional" },
    {
      type: "p",
      text: "The app should read and write to local storage first and sync to the server when it can. In the browser that means IndexedDB for data and a service worker for the app shell, so the interface loads even with no connection at all.",
    },
    { type: "h2", text: "Make every write safe to retry" },
    {
      type: "p",
      text: "When a request times out you do not know whether the server received it. Give every record a client-generated ID (a UUID) and make the server treat repeated submissions of the same ID as one. Then the sync queue can simply retry until it succeeds, with no duplicate sales.",
    },
    { type: "h2", text: "Show sync state honestly" },
    {
      type: "list",
      items: [
        "A small, always-visible indicator: synced, syncing, or offline with N changes waiting.",
        "Never block the user while syncing — queue the work and carry on.",
        "Surface conflicts in plain language instead of silently overwriting data.",
      ],
    },
    { type: "h2", text: "Respect the data bundle" },
    {
      type: "list",
      items: [
        "Ship less JavaScript; every kilobyte is paid for by the user.",
        "Cache aggressively and send only what changed, not full lists.",
        "Compress images on the server and serve modern formats.",
        "Let users opt out of heavy features like auto-playing media.",
      ],
    },
    {
      type: "quote",
      text: "If it only works on office Wi-Fi, it doesn't work.",
    },
    {
      type: "p",
      text: "Offline-first takes more planning up front, but the result is software that feels fast everywhere — and keeps a business running when the network does not.",
    },
  ],
};

export function readingMinutes(blocks: Block[]) {
  const words = blocks
    .map((b) => (b.type === "list" ? b.items.join(" ") : b.type === "code" ? b.code : b.text))
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}
