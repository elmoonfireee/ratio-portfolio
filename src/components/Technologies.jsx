"use client";

import { useMemo, useState } from "react";
import { Cpu } from "lucide-react";
import { technologyIcons } from "@/data/icons";
import LoxonePartner from "./LoxonePartner";
import SectionTitle from "./SectionTitle";
import SystemBus from "./technologies/SystemBus";

export default function Technologies({ content, partner }) {
  const [activeTechnologyId, setActiveTechnologyId] = useState("loxone");

  const technologies = useMemo(
    () => [
      {
        id: "loxone",
        title: content.mainTitle,
        description: content.mainText,
        Icon: Cpu,
        isCore: true
      },
      ...content.items.map((item, index) => ({
        id: `technology-${index + 1}`,
        title: item.title,
        description: item.description,
        Icon: technologyIcons[index],
        isCore: false
      }))
    ],
    [content]
  );

  const activeIndex = Math.max(
    technologies.findIndex((technology) => technology.id === activeTechnologyId),
    0
  );
  const activeTechnology = technologies[activeIndex];

  const selectTechnology = (technologyId) => {
    setActiveTechnologyId(technologyId);
  };

  return (
    <section id="technologie" className="section-padding overflow-hidden bg-brand-black">
      <div className="section-shell">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <SectionTitle
              eyebrow={content.eyebrow}
              title={content.title}
              lead={content.lead}
            />
            <p className="mt-6 max-w-3xl text-sm leading-7 text-white/50">
              {content.note}
            </p>
          </div>

          <LoxonePartner content={partner} signature />
        </div>

        <div className="mt-10">
          <SystemBus
            technologies={technologies}
            activeTechnology={activeTechnology}
            activeIndex={activeIndex}
            onSelect={selectTechnology}
            ariaLabel={content.title}
          />
        </div>
      </div>
    </section>
  );
}
