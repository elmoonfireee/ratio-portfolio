export default function TechnologyDetails({ technology, detailsId, index }) {
  const Icon = technology.Icon;

  return (
    <div
      id={detailsId}
      key={technology.id}
      className="technology-details-enter relative overflow-hidden border-y border-white/10 bg-brand-ink/65 px-5 py-6 sm:px-7 sm:py-7 lg:px-9"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-brand-orange/70" aria-hidden="true" />
      <div className="grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-start">
        <div className="flex h-14 w-14 items-center justify-center border border-brand-orange/45 text-brand-orange">
          <Icon size={24} aria-hidden="true" />
        </div>

        <div>
          <p className="font-mono text-xs tracking-[0.18em] text-brand-orange">
            {String(index).padStart(2, "0")}
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-white">
            {technology.title}
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/60 sm:text-base">
            {technology.description}
          </p>
        </div>

        <div
          className="technology-details-index hidden sm:block"
          data-index={String(index).padStart(2, "0")}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
