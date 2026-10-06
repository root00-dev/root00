import { site } from "@/data/site";

export const absoluteUrl = (path = "/") => new URL(path, site.url).toString();

export const ogImage = absoluteUrl("/og.png");

type SeoInput = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
};

/** Per-route meta + canonical link. Child routes override the root defaults by name/property. */
export function seo({ title, description, path, type = "website" }: SeoInput) {
  const url = absoluteUrl(path);
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: url },
      { property: "og:image", content: ogImage },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:site_name", content: site.name },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
