import { notFound, redirect } from "next/navigation";
import ProjectDetailPage from "@/components/projects/ProjectDetailPage";
import { getProjectPath, projects } from "@/data/projects";
import { siteConfig } from "@/data/site";
import { getMessages } from "@/i18n/getMessages";
import { getProjectBySlug, getProjects } from "@/lib/storyblok-content";

export function generateStaticParams() { return projects.map((project) => ({ locale: "en", slug: project.slug })); }

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const project = locale === "en" ? await getProjectBySlug("en", slug) : null;
  if (locale !== "en" || !project) return {};
  const title = project.seoTitle?.en || `${project.title.en} | Projects`;
  const description = project.seoDescription?.en || project.shortDescription.en;
  return { title, description, robots: { index: !project.noindex && !project.isDemo, follow: true }, alternates: { canonical: getProjectPath("en", slug), languages: { pl: getProjectPath("pl", slug), en: getProjectPath("en", slug) } }, openGraph: { title, description, url: getProjectPath("en", slug), siteName: siteConfig.name, images: [{ url: project.featuredImage }] }, twitter: { card: "summary_large_image", title, description, images: [project.featuredImage] } };
}

export default async function Page({ params }) {
  const { locale } = await params;
  if (locale !== "en") notFound();
  redirect("/en");
}
