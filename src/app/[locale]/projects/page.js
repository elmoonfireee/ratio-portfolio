import { notFound, redirect } from "next/navigation";
import ProjectsPage from "@/components/projects/ProjectsPage";
import { siteConfig } from "@/data/site";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/getMessages";
import { getProjects } from "@/lib/storyblok-content";

export function generateStaticParams() { return [{ locale: "en" }]; }

export const dynamicParams = false;
export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { locale: requestedLocale } = await params;
  const locale = isLocale(requestedLocale) ? requestedLocale : defaultLocale;
  const messages = getMessages(locale);
  if (locale !== "en") return {};
  return { title: messages.projectsPage.metaTitle, description: messages.projectsPage.metaDescription, alternates: { canonical: "/en/projects", languages: { pl: "/pl/realizacje", en: "/en/projects" } }, openGraph: { title: messages.projectsPage.metaTitle, description: messages.projectsPage.metaDescription, url: "/en/projects", siteName: siteConfig.name, images: [{ url: siteConfig.ogImage }] }, twitter: { card: "summary_large_image", title: messages.projectsPage.metaTitle, description: messages.projectsPage.metaDescription, images: [siteConfig.ogImage] } };
}

export default async function Page({ params }) {
  const { locale: requestedLocale } = await params;
  if (requestedLocale !== "en") notFound();
  redirect("/en");
}
