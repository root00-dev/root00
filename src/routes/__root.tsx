import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  lazyRouteComponent,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useMemo, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Nav } from "@/components/Nav";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { themeInitScript } from "@/lib/theme";
import { ogImage } from "@/lib/seo";

function NotFoundComponent() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5">
      <div className="terminal-window w-full max-w-lg px-6 py-6 [transform:none] hover:[transform:none]">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-dot-red/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-dot-amber/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-dot-green/60" />
        </div>
        <p className="mt-5 font-mono text-sm text-terminal-muted">
          <span className="text-primary">➜</span> cd {"<this page>"}
        </p>
        <h1 className="mt-2 font-mono text-lg text-terminal-fg">404: no such file or directory</h1>
        <p className="mt-3 text-sm text-terminal-muted">
          The page you're looking for doesn't exist or has moved.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/"
            className="rounded-md bg-primary px-4 py-2 font-mono text-sm font-semibold text-primary-foreground"
          >
            cd ~
          </Link>
          <Link
            to="/blog"
            className="rounded-md border border-white/20 px-4 py-2 font-mono text-sm text-terminal-fg hover:border-primary"
          >
            ls blog/
          </Link>
        </div>
      </div>
    </main>
  );
}

function ErrorComponent({ error: rawError, reset }: { error: unknown; reset: () => void }) {
  const error = useMemo(
    () => (rawError instanceof Error ? rawError : new Error(String(rawError))),
    [rawError],
  );
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "_root — Developer & Cloud Hosting | StyleNET Devs" },
      {
        name: "description",
        content:
          "Software development and managed cloud hosting by _root of StyleNET Devs, Harare, Zimbabwe.",
      },
      { name: "author", content: "_root — StyleNET Devs" },
      { name: "theme-color", content: "#0e1116" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: ogImage },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: ogImage },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
    scripts: [{ children: themeInitScript }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: lazyRouteComponent(() => Promise.resolve({ default: NotFoundComponent })),
  errorComponent: lazyRouteComponent(() => Promise.resolve({ default: ErrorComponent })),
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Nav />
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <WhatsAppButton />
    </QueryClientProvider>
  );
}
