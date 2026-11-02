import { siteConfig } from "@/data/site";
import { locales } from "@/i18n/config";

export const revalidate = 300;

export default async function sitemap() {
  const homePages = locales.map((locale) => ({
    url: `${siteConfig.url}/${locale}`,
    changeFrequency: "monthly",
    priority: locale === "pl" ? 1 : 0.9,
    alternates: { languages: { pl: `${siteConfig.url}/pl`, en: `${siteConfig.url}/en` } }
  }));
  return homePages;
}
