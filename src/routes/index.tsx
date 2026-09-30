import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About, Projects, Services, Contact, Footer } from "@/components/Sections";
import { site, mailLink } from "@/data/site";

const title = "_root — Developer & Cloud Hosting | StyleNET Devs";
const description =
  "_root of StyleNET Devs in Harare, Zimbabwe: full-stack web and software development plus managed VPS and cloud hosting. Build it, host it, keep it running.";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: "_root",
      alternateName: "Gladmore Chituku",
      jobTitle: "Software Developer",
      email: mailLink,
      address: { "@type": "PostalAddress", addressLocality: "Harare", addressCountry: "ZW" },
      worksFor: { "@type": "Organization", name: site.name },
      sameAs: [site.github],
    },
    {
      "@type": "Organization",
      name: site.name,
      alternateName: site.altName,
      description: "Software development and cloud hosting (VPS) in Harare, Zimbabwe.",
      address: { "@type": "PostalAddress", addressLocality: "Harare", addressCountry: "ZW" },
    },
  ],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(jsonLd),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Projects />
        <Services />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
