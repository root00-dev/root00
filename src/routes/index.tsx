import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { About, Projects, Services, Process, Contact, Footer } from "@/components/Sections";
import { site } from "@/data/site";
import { absoluteUrl, ogImage, seo } from "@/lib/seo";

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
      url: absoluteUrl("/"),
      image: ogImage,
      email: site.email,
      address: { "@type": "PostalAddress", addressLocality: "Harare", addressCountry: "ZW" },
      worksFor: { "@type": "Organization", name: site.name },
      sameAs: [site.github],
    },
    {
      "@type": "ProfessionalService",
      name: site.name,
      url: absoluteUrl("/"),
      image: ogImage,
      email: site.email,
      telephone: site.whatsapp,
      alternateName: site.altName,
      description: "Software development and cloud hosting (VPS) in Harare, Zimbabwe.",
      address: { "@type": "PostalAddress", addressLocality: "Harare", addressCountry: "ZW" },
      areaServed: "ZW",
      sameAs: [site.github],
    },
    {
      "@type": "WebSite",
      name: `${site.handle} — ${site.name}`,
      url: absoluteUrl("/"),
    },
  ],
};

export const Route = createFileRoute("/")({
  head: () => ({
    ...seo({ title, description, path: "/" }),
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
      <main id="main">
        <Hero />
        <About />
        <Projects />
        <Services />
        <Process />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
