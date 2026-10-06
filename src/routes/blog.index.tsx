import { createFileRoute, Link } from "@tanstack/react-router";
import { site } from "@/data/site";
import { postBodies, readingMinutes } from "@/data/posts";
import { Reveal } from "@/components/Reveal";
import { seo } from "@/lib/seo";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/blog/")({
  head: () =>
    seo({
      title: `Blog — ${site.handle} | ${site.name}`,
      description: `Notes on web development, VPS hosting and building software in Zimbabwe, by ${site.handle} of ${site.name}.`,
      path: "/blog",
    }),
  component: BlogPage,
});

function BlogPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 pt-28 sm:pt-32">
      <Reveal>
        <p className="font-mono text-sm text-primary">~/blog</p>
        <div className="mt-2 flex items-end gap-4">
          <h1 className="font-mono text-3xl font-bold tracking-tight sm:text-4xl">
            Notes &amp; writing
          </h1>
          <span aria-hidden className="mb-2 h-px flex-1 bg-border" />
          <span aria-hidden className="mb-2 font-mono text-xs text-primary">
            ▮
          </span>
        </div>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Short notes on building software, running servers and keeping things online — from Harare.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {site.posts.map((post, i) => (
          <Reveal key={post.slug} delay={i * 80}>
            <Link
              to="/blog/$slug"
              params={{ slug: post.slug }}
              className="card-lift group flex h-full flex-col rounded-lg border border-border bg-card p-6"
            >
              <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
                <span className="text-primary">{String(i + 1).padStart(3, "0")}</span>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </div>
              <h2 className="mt-4 font-mono text-lg font-semibold leading-snug group-hover:text-primary">
                {post.title}
              </h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded border border-border px-2 py-0.5 font-mono text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="mt-5 flex items-center justify-between font-mono text-xs text-muted-foreground">
                <span>{readingMinutes(postBodies[post.slug] ?? [])} min read</span>
                <span className="text-primary transition-transform group-hover:translate-x-1">
                  Read →
                </span>
              </p>
            </Link>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-16 rounded-lg border border-border bg-card p-6 sm:flex sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Have a topic I should cover, or a question about one of these posts?
          </p>
          <a
            href={`mailto:${site.email}?subject=${encodeURIComponent("Blog topic suggestion")}`}
            className="btn-hard mt-4 inline-block rounded-md bg-primary px-4 py-2 font-mono text-sm font-semibold text-primary-foreground sm:mt-0"
          >
            Suggest a topic
          </a>
        </div>
      </Reveal>

      <p className="mt-12">
        <Link to="/" className="font-mono text-sm text-primary hover:underline">
          ← Back to home
        </Link>
      </p>
    </main>
  );
}
