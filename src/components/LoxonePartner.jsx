import Image from "next/image";

export default function LoxonePartner({ content, compact = false, signature = false }) {
  return (
    <div
      className={
        signature
          ? "inline-flex border-l border-brand-orange/50 pl-4"
          : `border border-white/10 bg-white/[0.03] ${compact ? "p-4" : "p-5"}`
      }
    >
      <div className="flex items-center gap-4">
        <a
          href="https://www.loxone.com/"
          target="_blank"
          rel="noopener noreferrer"
          className={`${
            signature ? "w-24 sm:w-28" : compact ? "w-28" : "w-32"
          } loxone-partner-link focus-ring shrink-0 overflow-hidden`}
          aria-label="Loxone"
        >
          <Image
            src="/brand/loxone-partner-logo.png"
            alt={content.logoAlt}
            width={1418}
            height={523}
            className="h-auto w-full object-cover"
          />
        </a>
        <div>
          <p className="text-sm font-semibold text-white">{content.title}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-brand-orange">
            {content.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
