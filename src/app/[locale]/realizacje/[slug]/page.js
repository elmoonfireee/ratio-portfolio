import { notFound, redirect } from "next/navigation";
import ProjectDetailPage from "@/components/projects/ProjectDetailPage";
import { getProjectPath, projects } from "@/data/projects";
import { siteConfig } from "@/data/site";
import { getMessages } from "@/i18n/getMessages";
import { getProjectBySlug, getProjects } from "@/lib/storyblok-content";

export function generateStaticParams() { return projects.map((project) => ({ locale: "pl", slug: project.slug })); }

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const project = locale === "pl" ? await getProjectBySlug("pl", slug) : null;
  if (locale !== "pl" || !project) return {};
  const title = project.seoTitle?.pl || `${project.title.pl} | Realizacje`;
  const description = project.seoDescription?.pl || project.shortDescription.pl;
  return { title, description, robots: { index: !project.noindex && !project.isDemo, follow: true }, alternates: { canonical: getProjectPath("pl", slug), languages: { pl: getProjectPath("pl", slug), en: getProjectPath("en", slug) } }, openGraph: { title, description, url: getProjectPath("pl", slug), siteName: siteConfig.name, images: [{ url: project.featuredImage }] }, twitter: { card: "summary_large_image", title, description, images: [project.featuredImage] } };
}

export default async function Page({ params }) {
  const { locale } = await params;
  if (locale !== "pl") notFound();
  redirect("/pl");
}
