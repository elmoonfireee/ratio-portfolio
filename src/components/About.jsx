import Image from "next/image";
import { featureIcons } from "@/data/icons";
import SectionTitle from "./SectionTitle";

export default function About({ content }) {
  return (
    <section id="o-nas" className="section-padding bg-brand-ink">
      <div className="section-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="relative">
          <div className="technical-frame bg-brand-black p-8">
            <Image
              src="/brand/ratio-logo-card.png"
              alt={content.imageAlt}
              width={1302}
              height={720}
              sizes="(max-width: 1024px) 90vw, 520px"
              className="h-auto w-full object-contain"
            />
          </div>
          <div className="absolute -bottom-5 right-6 hidden border border-brand-orange/40 bg-brand-black px-5 py-4 text-sm text-white/70 shadow-orange sm:block">
            <span className="block text-xs uppercase text-brand-orange">
              RATIO
            </span>
            Smart Innovations
          </div>
        </div>

        <div>
          <SectionTitle
            eyebrow={content.eyebrow}
            title={content.title}
            lead={content.lead}
          />
          <p className="mt-7 max-w-2xl leading-8 text-white/60">
            {content.text}
          </p>

          <div className="mt-10 grid gap-px bg-white/10 sm:grid-cols-2">
            {content.features.map((title, index) => {
              const Icon = featureIcons[index];
              return (
                <article
                  key={title}
                  className="bg-brand-black p-5"
                >
                  <Icon
                    size={22}
                    className="text-brand-orange"
                    aria-hidden="true"
                  />
                  <h3 className="mt-5 text-lg font-semibold text-white">
                    {title}
                  </h3>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
