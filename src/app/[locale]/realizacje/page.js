import { notFound, redirect } from "next/navigation";
import ProjectsPage from "@/components/projects/ProjectsPage";
import { siteConfig } from "@/data/site";
import { getMessages } from "@/i18n/getMessages";
import { getProjects } from "@/lib/storyblok-content";

export function generateStaticParams() { return [{ locale: "pl" }]; }

export const dynamicParams = false;
export const revalidate = 300;

export async function generateMetadata() {
  const messages = getMessages("pl");
  return { title: messages.projectsPage.metaTitle, description: messages.projectsPage.metaDescription, alternates: { canonical: "/pl/realizacje", languages: { pl: "/pl/realizacje", en: "/en/projects" } }, openGraph: { title: messages.projectsPage.metaTitle, description: messages.projectsPage.metaDescription, url: "/pl/realizacje", siteName: siteConfig.name, images: [{ url: siteConfig.ogImage }] }, twitter: { card: "summary_large_image", title: messages.projectsPage.metaTitle, description: messages.projectsPage.metaDescription, images: [siteConfig.ogImage] } };
}

export default async function Page({ params }) {
  const { locale } = await params;
  if (locale !== "pl") notFound();
  redirect("/pl");
}
