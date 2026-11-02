"use client";

import { useMemo, useState } from "react";
import { serviceIconKeys, serviceIcons } from "@/data/icons";
import SectionTitle from "./SectionTitle";
import ServiceConsole from "./services/ServiceConsole";

export default function Services({ content, services = content.items }) {
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);

  const preparedServices = useMemo(
    () =>
      services.map((service, index) => ({
        ...service,
        Icon: serviceIconKeys[service.iconKey] || serviceIcons[index % serviceIcons.length],
        index,
        number: String(index + 1).padStart(2, "0")
      })),
    [services]
  );

  return (
    <section id="uslugi" className="section-padding overflow-hidden bg-brand-ink">
      <div className="section-shell">
        <SectionTitle
          eyebrow={content.eyebrow}
          title={content.title}
          lead={content.lead}
        />

        <div className="mt-12">
          <ServiceConsole
            activeIndex={activeServiceIndex}
            labels={content.demo}
            onSelect={setActiveServiceIndex}
            services={preparedServices}
          />
        </div>
      </div>
    </section>
  );
}
