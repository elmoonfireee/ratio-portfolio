import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionTitle from "./SectionTitle";
import ProjectCarousel from "./projects/ProjectCarousel";
import { getProjectsPath } from "@/data/projects";

export default function Projects({ content, locale, projects }) {
  return (
    <section id="realizacje" className="section-padding bg-brand-ink">
      <div className="section-shell">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <SectionTitle eyebrow={content.eyebrow} title={content.title} lead={content.lead} />
          <div className="max-w-2xl lg:justify-self-end">
            <p className="text-sm leading-7 text-white/50">{content.note}</p>
            <Link href={getProjectsPath(locale)} className="btn-primary mt-6">
              {content.allProjectsCta}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <ProjectCarousel content={content} locale={locale} projects={projects} />
      </div>
    </section>
  );
}
