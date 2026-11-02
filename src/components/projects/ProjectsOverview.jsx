"use client";

import { useMemo, useState } from "react";
import ProjectCard from "@/components/ProjectCard";

export default function ProjectsOverview({ locale, content, projects }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const projectCategories = useMemo(
    () => [...new Set(projects.map((project) => project.category).filter(Boolean))],
    [projects]
  );
  const visibleProjects = useMemo(
    () => activeCategory === "All" ? projects : projects.filter((project) => project.category === activeCategory),
    [activeCategory]
  );

  return (
    <>
      <div className="mt-10 flex flex-wrap gap-3" aria-label={content.filtersAria}>
        {["All", ...projectCategories].map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`project-filter-button hover-fine-project-filter focus-ring border px-4 py-2 text-sm font-semibold transition ${activeCategory === category ? "border-brand-orange bg-brand-orange text-brand-black" : "border-white/10 text-white/70"}`}
            aria-pressed={activeCategory === category}
          >
            {category === "All" ? content.allFilter : category}
          </button>
        ))}
      </div>

      {visibleProjects.length ? (
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleProjects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} locale={locale} labels={content.cardLabels} index={index} />
          ))}
        </div>
      ) : (
        <div className="mt-12 border border-dashed border-brand-orange/40 bg-brand-orange/5 p-8 text-white/70">
          <h2 className="text-2xl font-semibold text-white">{content.emptyTitle}</h2>
          <p className="mt-3 max-w-2xl leading-7">{content.emptyText}</p>
        </div>
      )}
    </>
  );
}
