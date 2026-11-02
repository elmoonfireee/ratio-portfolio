import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProjectPath } from "@/data/projects";

export default function ProjectCard({ project, locale, labels, index = 0 }) {
  return (
    <article className="hover-fine-project-card overflow-hidden border border-white/10 bg-brand-ink transition duration-300">
      <Link href={getProjectPath(locale, project.slug)} className="focus-ring block">
        <div className="relative aspect-[16/10] overflow-hidden bg-brand-black">
          <Image src={project.featuredImage} alt={project.featuredImageAlt?.[locale] || project.title[locale]} fill sizes="(max-width: 768px) 100vw, 50vw" className="hover-fine-project-card-image object-cover opacity-80 transition duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent" />
          <div className="absolute left-5 top-5 border border-brand-orange/35 bg-brand-black/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand-orange">
            {project.status[locale]}
          </div>
          <div className="absolute bottom-5 right-5 font-mono text-5xl text-white/10">{String(index + 1).padStart(2, "0")}</div>
        </div>
        <div className="p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-brand-orange">{project.category}</p>
          <h3 className="mt-3 text-xl font-semibold text-white">{project.title[locale]}</h3>
          <p className="mt-3 text-sm text-white/50">{labels.location}: {project.location[locale]}</p>
          <p className="mt-4 leading-7 text-white/60">{project.shortDescription[locale]}</p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-orange">
            {labels.details} <ArrowRight size={16} aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  );
}
