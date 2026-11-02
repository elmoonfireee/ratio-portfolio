export default function ServiceDetails({ service, className = "", compact = false, id }) {
  const Icon = service.Icon;

  return (
    <article
      id={id}
      aria-live="polite"
      className={`relative isolate overflow-hidden border border-white/10 bg-brand-black ${
        compact ? "p-5" : "min-h-[30rem] p-7 sm:p-9 lg:p-12"
      } ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-technical-grid bg-[size:40px_40px] opacity-20" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-brand-orange" />
      <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 border-b border-l border-white/10" />
      <div className="pointer-events-none absolute bottom-7 right-7 flex items-center gap-2" aria-hidden="true">
        <span className="h-1.5 w-1.5 bg-brand-orange" />
        <span className="h-px w-16 bg-white/15" />
      </div>

      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-6">
          <div className="flex h-14 w-14 items-center justify-center border border-brand-orange/50 bg-brand-orange/10 text-brand-orange sm:h-16 sm:w-16">
            <Icon size={compact ? 23 : 27} aria-hidden="true" />
          </div>
          <span className={`font-mono leading-none text-white/[0.08] ${compact ? "text-5xl" : "text-7xl sm:text-8xl"}`}>
            {service.number}
          </span>
        </div>

        <div className={compact ? "mt-7" : "mt-12 lg:mt-auto lg:pt-20"}>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-brand-orange">
            {service.number} / 08
          </p>
          <h3 className={`mt-4 max-w-2xl font-semibold leading-tight text-white ${compact ? "text-xl" : "text-3xl sm:text-4xl"}`}>
            {service.title}
          </h3>
          <p className={`mt-5 max-w-2xl text-white/65 ${compact ? "text-sm leading-7" : "text-base leading-8 sm:text-lg"}`}>
            {service.description}
          </p>
        </div>
      </div>
    </article>
  );
}
