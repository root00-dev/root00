# StyleNET Devs — portfolio site

Single-page portfolio for **_root / StyleNET Devs** (Harare, Zimbabwe): hero, about,
projects, services, contact, footer.

Stack note: this project runs on the platform's React + Vite stack rather than raw
`index.html` + `/css` + `/js`. There is still no runtime framework lock-in — `npm run build`
produces static assets you can serve from any Nginx box or static host.

## Editing content

Everything editable lives in **`src/data/site.ts`**: name, tagline, location, email,
WhatsApp number, GitHub URL, about paragraphs, skills, projects and services.
Change values there — no markup edits needed.

Colors, fonts and spacing tokens live in `src/styles.css` (dark by default, with a
light variant under `prefers-color-scheme: light`).

The contact form (`src/components/ContactForm.tsx`) is front-end only. To wire it up:
set `action="https://formspree.io/f/<your-id>" method="post"` on the `<form>` and
remove `handleSubmit`, or POST to your own endpoint.

## Build

```bash
npm install
npm run build      # static output in dist/
```

## Deploy to Nginx on a VPS

```bash
scp -r dist/* user@your-server:/var/www/stylenet
```

`/etc/nginx/sites-available/stylenet`:

```nginx
server {
    listen 80;
    server_name stylenet.co.zw www.stylenet.co.zw;
    root /var/www/stylenet;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(css|js|svg|woff2|png|jpg|webp)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/css application/javascript image/svg+xml;
}
```

```bash
sudo ln -s /etc/nginx/sites-available/stylenet /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## Custom domain + SSL

1. Point an `A` record for `stylenet.co.zw` (and `www`) at your server IP.
2. Install Certbot and issue the certificate:

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d stylenet.co.zw -d www.stylenet.co.zw
sudo systemctl status certbot.timer   # auto-renewal
```

## Assumptions

- Email, WhatsApp number, GitHub URL and the six projects are placeholders in `src/data/site.ts`.
- Accent color chosen: electric green. Canonical domain assumed to be `stylenet.co.zw`
  (used in `public/robots.txt` and `public/sitemap.xml`).
- No stock photos: visuals are CSS grid backdrop, glow and SVG favicon only.

## Suggested next steps

- Connect the contact form to real email delivery.
- Add a social preview image for richer link sharing.
- Add individual case-study pages for the strongest two projects.
