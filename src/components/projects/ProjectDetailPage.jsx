import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectGallery from "@/components/projects/ProjectGallery";
import { getProjectPath, getProjectsPath } from "@/data/projects";

function List({ items }) {
  return <ul className="mt-4 grid gap-3 text-white/65">{items.map((item) => <li key={item} className="border-l border-brand-orange/60 pl-4 leading-7">{item}</li>)}</ul>;
}

export default function ProjectDetailPage({ locale, messages, project, projects }) {
  const content = messages.projectDetail;
  const index = projects.findIndex((item) => item.slug === project.slug);
  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <>
      <Navbar locale={locale} content={messages.nav} />
      <main id="main-content" className="min-h-screen bg-brand-black pt-20">
        <article>
          <header className="section-shell py-10 sm:py-14">
            <nav aria-label={content.breadcrumbsAria} className="text-sm text-white/50">
              <Link href={`/${locale}`} className="hover-fine-breadcrumb">{content.home}</Link>
              <span className="mx-3 text-brand-orange">/</span>
              <Link href={getProjectsPath(locale)} className="hover-fine-breadcrumb">{content.projects}</Link>
              <span className="mx-3 text-brand-orange">/</span>
              <span className="text-white/80">{project.title[locale]}</span>
            </nav>
            <div className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
              <div className="min-w-0">
                <p className="section-eyebrow"><span />{project.category}</p>
                <h1 className="mt-5 w-full min-w-0 max-w-full break-words text-balance text-4xl font-semibold leading-tight text-white [overflow-wrap:anywhere] sm:text-5xl">{project.title[locale]}</h1>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-white/65">{project.shortDescription[locale]}</p>
              </div>
              <dl className="grid gap-3 border border-white/10 bg-brand-ink p-5 sm:grid-cols-3">
                <div><dt className="text-xs uppercase tracking-[0.16em] text-brand-orange">{content.status}</dt><dd className="mt-2 text-white">{project.status[locale]}</dd></div>
                <div><dt className="text-xs uppercase tracking-[0.16em] text-brand-orange">{content.location}</dt><dd className="mt-2 text-white">{project.location[locale]}</dd></div>
                <div><dt className="text-xs uppercase tracking-[0.16em] text-brand-orange">{content.year}</dt><dd className="mt-2 text-white">{project.year}</dd></div>
              </dl>
            </div>
          </header>

          <div className="section-shell">
            <div className="relative aspect-[16/9] overflow-hidden border border-white/10 bg-brand-ink">
              <Image src={project.featuredImage} alt={project.featuredImageAlt?.[locale] || project.title[locale]} fill priority sizes="100vw" className="object-cover" />
            </div>
          </div>

          <section className="section-shell grid gap-8 py-16 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="border border-white/10 bg-brand-ink p-6">
              <h2 className="text-2xl font-semibold text-white">{content.overview}</h2>
              <p className="mt-4 whitespace-pre-line leading-8 text-white/65">{project.fullDescription[locale]}</p>
              {project.isDemo ? <p className="mt-5 border border-brand-orange/30 bg-brand-orange/10 p-4 text-sm leading-7 text-brand-orange">{content.demoNotice}</p> : null}
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="border border-white/10 p-6"><h2 className="text-2xl font-semibold text-white">{content.scope}</h2><List items={project.scopeOfWork[locale]} /></div>
              <div className="border border-white/10 p-6"><h2 className="text-2xl font-semibold text-white">{content.functions}</h2><List items={project.keyFunctions[locale]} /></div>
            </div>
          </section>

          <section className="section-shell pb-16">
            <h2 className="text-2xl font-semibold text-white">{content.technologies}</h2>
            <div className="mt-5 flex flex-wrap gap-2">{project.systemsAndTechnologies.map((item) => <span key={item} className="border border-white/10 px-3 py-2 text-sm text-white/70">{item}</span>)}</div>
          </section>

          <ProjectGallery images={project.galleryImages} locale={locale} content={content} />

          <section className="section-shell grid gap-5 pb-20 md:grid-cols-3">
            <Link href={getProjectPath(locale, previous.slug)} className="btn-secondary justify-center"><ArrowLeft size={18} />{content.previous}</Link>
            <Link href={`/${locale}#kontakt`} className="btn-primary justify-center">{content.cta}<ArrowRight size={18} /></Link>
            <Link href={getProjectPath(locale, next.slug)} className="btn-secondary justify-center">{content.next}<ArrowRight size={18} /></Link>
          </section>
        </article>
      </main>
      <Footer locale={locale} content={messages.footer} nav={messages.nav} partner={messages.partner} />
    </>
  );
}
