import { processIcons } from "@/data/icons";
import SectionTitle from "./SectionTitle";

export default function Process({ content }) {
  return (
    <section id="proces" className="section-padding bg-brand-black">
      <div className="section-shell">
        <SectionTitle
          eyebrow={content.eyebrow}
          title={content.title}
          lead={content.lead}
          align="center"
        />

        <div className="relative mt-14 grid gap-6 lg:grid-cols-5">
          <div className="absolute left-[10%] right-[10%] top-10 hidden h-px bg-white/10 lg:block" />
          {content.steps.map((step, index) => {
            const Icon = processIcons[index];
            return (
              <article key={step.title} className="relative text-center">
                <div className="relative z-10 mx-auto mb-6 flex h-20 w-20 items-center justify-center border border-white/15 bg-brand-black text-brand-orange">
                  <Icon size={27} aria-hidden="true" />
                </div>
                <p className="font-mono text-sm text-brand-orange">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-lg font-semibold leading-snug text-white">
                  {step.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/60">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
