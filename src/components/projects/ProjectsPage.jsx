import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectsOverview from "@/components/projects/ProjectsOverview";

export default function ProjectsPage({ locale, messages, projects }) {
  const content = messages.projectsPage;
  return (
    <>
      <Navbar locale={locale} content={messages.nav} />
      <main id="main-content" className="min-h-screen bg-brand-black pt-20">
        <section className="relative isolate overflow-hidden border-b border-white/10 py-20 sm:py-24">
          <div className="absolute inset-0 bg-technical-grid bg-[size:44px_44px] opacity-[0.07]" />
          <div className="absolute right-[-10rem] top-10 h-96 w-96 border border-brand-orange/20" />
          <div className="section-shell relative">
            <nav aria-label={content.breadcrumbsAria} className="text-sm text-white/50">
              <Link href={`/${locale}`} className="hover-fine-breadcrumb">{content.home}</Link>
              <span className="mx-3 text-brand-orange">/</span>
              <span className="text-white/80">{content.current}</span>
            </nav>
            <p className="section-eyebrow mt-12"><span />{content.eyebrow}</p>
            <h1 className="mt-5 max-w-5xl text-balance text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">{content.title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/65">{content.intro}</p>
            <ProjectsOverview locale={locale} content={content} projects={projects} />
          </div>
        </section>
      </main>
      <Footer locale={locale} content={messages.footer} nav={messages.nav} partner={messages.partner} />
    </>
  );
}
