import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Fragment, type ReactNode } from "react";
import { site, waLink } from "@/data/site";
import { postBodies, readingMinutes, type Block } from "@/data/posts";
import { absoluteUrl, ogImage, seo } from "@/lib/seo";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const index = site.posts.findIndex((p) => p.slug === params.slug);
    const body = postBodies[params.slug];
    if (index === -1 || !body) throw notFound();
    return { index, post: site.posts[index]! };
  },
  head: ({ loaderData, params }) => {
    const post = loaderData?.post;
    if (!post) return {};
    const path = `/blog/${params.slug}`;
    const base = seo({
      title: `${post.title} — ${site.handle}`,
      description: post.excerpt,
      path,
      type: "article",
    });
    return {
      ...base,
      meta: [
        ...base.meta,
        { property: "article:published_time", content: post.date },
        ...post.tags.map((tag) => ({ property: "article:tag", content: tag })),
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            url: absoluteUrl(path),
            image: ogImage,
            keywords: post.tags.join(", "),
            author: { "@type": "Person", name: site.handle, url: absoluteUrl("/") },
            publisher: { "@type": "Organization", name: site.name },
          }),
        },
      ],
    };
  },
  component: PostPage,
});

/** Renders `inline code` spans inside plain text. */
function inline(text: string): ReactNode {
  return text.split(/(`[^`]+`)/g).map((part, i) =>
    part.startsWith("`") && part.endsWith("`") ? (
      <code
        key={i}
        className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground"
      >
        {part.slice(1, -1)}
      </code>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 className="mt-12 font-mono text-xl font-bold text-foreground sm:text-2xl">
          <span aria-hidden className="mr-2 text-primary">
            #
          </span>
          {block.text}
        </h2>
      );
    case "p":
      return <p className="mt-5 leading-[1.8] text-muted-foreground">{inline(block.text)}</p>;
    case "list":
      return (
        <ul className="mt-5 space-y-2.5">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 leading-relaxed text-muted-foreground">
              <span aria-hidden className="mt-0.5 font-mono text-primary">
                ▸
              </span>
              <span>{inline(item)}</span>
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote className="mt-8 border-l-2 border-primary pl-5 font-mono text-lg leading-relaxed text-foreground">
          {block.text}
        </blockquote>
      );
    case "code":
      return (
        <figure className="terminal-window mt-6 overflow-hidden [transform:none] hover:[transform:none]">
          <figcaption className="flex items-center justify-between border-b border-white/10 px-4 py-2 font-mono text-[11px] text-terminal-muted">
            <span className="flex gap-1.5" aria-hidden>
              <span className="h-2.5 w-2.5 rounded-full bg-dot-red/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-dot-amber/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-dot-green/60" />
            </span>
            <span>{block.lang}</span>
          </figcaption>
          <pre className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-relaxed text-terminal-fg">
            <code>{block.code}</code>
          </pre>
        </figure>
      );
  }
}

function PostPage() {
  const { index, post } = Route.useLoaderData();
  const body = postBodies[post.slug] ?? [];
  const newer = site.posts[index - 1];
  const older = site.posts[index + 1];

  return (
    <main id="main" className="mx-auto max-w-3xl px-5 pb-24 pt-28 sm:pt-32">
      <nav aria-label="Breadcrumb" className="font-mono text-sm">
        <Link to="/" className="text-muted-foreground hover:text-primary">
          ~
        </Link>
        <span className="text-muted-foreground">/</span>
        <Link to="/blog" className="text-muted-foreground hover:text-primary">
          blog
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-primary">{post.slug}</span>
      </nav>

      <article>
        <header className="mt-6 border-b border-border pb-8">
          <h1 className="font-mono text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-muted-foreground">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden>·</span>
            <span>{readingMinutes(body)} min read</span>
            <span aria-hidden>·</span>
            <span className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded border border-border px-2 py-0.5">
                  {tag}
                </span>
              ))}
            </span>
          </div>
        </header>

        <div className="pb-4">
          {body.map((block, i) => (
            <BlockView key={i} block={block} />
          ))}
        </div>
      </article>

      <aside className="mt-14 rounded-xl border border-border bg-surface p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div>
          <p className="font-mono text-sm font-semibold">
            <span className="text-primary">$</span> Need this done for you?
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            I build and host web apps for businesses in Zimbabwe and beyond.
          </p>
        </div>
        <div className="mt-4 flex shrink-0 gap-3 sm:mt-0">
          <a
            href="/#contact"
            className="btn-hard rounded-md bg-primary px-4 py-2 font-mono text-sm font-semibold text-primary-foreground"
          >
            Get a quote
          </a>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-border px-4 py-2 font-mono text-sm font-semibold hover:border-primary hover:text-primary"
          >
            WhatsApp
          </a>
        </div>
      </aside>

      <nav aria-label="More posts" className="mt-10 grid gap-4 sm:grid-cols-2">
        {older ? (
          <Link
            to="/blog/$slug"
            params={{ slug: older.slug }}
            className="card-lift rounded-lg border border-border p-4"
          >
            <span className="font-mono text-xs text-muted-foreground">← Older</span>
            <span className="mt-1 block font-mono text-sm font-semibold">{older.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {newer && (
          <Link
            to="/blog/$slug"
            params={{ slug: newer.slug }}
            className="card-lift rounded-lg border border-border p-4 sm:text-right"
          >
            <span className="font-mono text-xs text-muted-foreground">Newer →</span>
            <span className="mt-1 block font-mono text-sm font-semibold">{newer.title}</span>
          </Link>
        )}
      </nav>
    </main>
  );
}
