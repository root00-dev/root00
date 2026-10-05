import { createFileRoute } from "@tanstack/react-router";
import { site } from "@/data/site";
import { absoluteUrl } from "@/lib/seo";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const latest = site.posts
          .map((p) => p.date)
          .sort()
          .at(-1);
        const urls = [
          { loc: absoluteUrl("/"), priority: "1.0" },
          { loc: absoluteUrl("/blog"), priority: "0.8", lastmod: latest },
          ...site.posts.map((p) => ({
            loc: absoluteUrl(`/blog/${p.slug}`),
            priority: "0.6",
            lastmod: p.date,
          })),
        ];
        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}<priority>${u.priority}</priority></url>`,
  )
  .join("\n")}
</urlset>
`;
        return new Response(body, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
