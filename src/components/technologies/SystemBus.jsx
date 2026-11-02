import TechnologyDetails from "./TechnologyDetails";

function activateWithKeyboard(event, callback) {
  if (event.key !== "Enter" && event.key !== " ") return;

  event.preventDefault();
  callback();
}

function BusTechnologyButton({
  technology,
  index,
  isActive,
  onSelect,
  detailsId,
  vertical = false
}) {
  const Icon = technology.Icon;

  return (
    <button
      type="button"
      className={`hover-fine-technology-button focus-ring relative z-10 text-left ${
        vertical ? "flex w-full items-center gap-4 py-3" : "flex w-full flex-col items-center text-center"
      }`}
      aria-pressed={isActive}
      aria-controls={detailsId}
      onClick={() => onSelect(technology.id)}
      onKeyDown={(event) => activateWithKeyboard(event, () => onSelect(technology.id))}
    >
      <span
        className={`flex h-14 w-14 shrink-0 items-center justify-center border bg-brand-black transition-colors motion-reduce:transition-none ${
          isActive
            ? "border-brand-orange text-brand-orange"
            : "hover-fine-technology-icon border-white/20 text-white/50"
        }`}
      >
        <Icon size={22} aria-hidden="true" />
      </span>
      <span className={vertical ? "min-w-0" : "mt-4 min-w-0"}>
        <span className="block font-mono text-[0.65rem] tracking-[0.14em] text-white/30">
          {String(index).padStart(2, "0")}
        </span>
        <span
          className={`mt-1 block text-sm font-semibold leading-tight transition-colors motion-reduce:transition-none ${
            isActive ? "text-brand-orange" : "text-white/65"
          }`}
        >
          {technology.title}
        </span>
      </span>
    </button>
  );
}

export default function SystemBus({
  technologies,
  activeTechnology,
  activeIndex,
  onSelect,
  ariaLabel
}) {
  const detailsId = "system-bus-technology-details";
  const progress = technologies.length > 1
    ? activeIndex / (technologies.length - 1)
    : 0;

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      data-technologies-variant="system-bus"
    >
      <div className="relative hidden overflow-hidden border-y border-white/10 bg-technical-grid bg-[size:44px_44px] px-8 py-16 lg:block">
        <div className="absolute left-8 right-8 top-[5.45rem] h-px bg-white/15" aria-hidden="true">
          <span
            className="block h-full origin-left bg-brand-orange transition-[width] duration-300 motion-reduce:transition-none"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <div
          className="grid"
          style={{ gridTemplateColumns: `repeat(${technologies.length}, minmax(0, 1fr))` }}
          role="group"
          aria-label={ariaLabel}
        >
          {technologies.map((technology, index) => (
            <BusTechnologyButton
              key={technology.id}
              technology={technology}
              index={index}
              isActive={activeIndex === index}
              onSelect={onSelect}
              detailsId={detailsId}
            />
          ))}
        </div>
      </div>

      <div className="border-y border-white/10 bg-technical-grid bg-[size:36px_36px] px-5 py-7 sm:px-7 lg:hidden">
        <div className="relative">
          <div className="absolute bottom-7 left-7 top-7 w-px bg-white/15" aria-hidden="true">
            <span
              className="block w-full origin-top bg-brand-orange transition-[height] duration-300 motion-reduce:transition-none"
              style={{ height: `${progress * 100}%` }}
            />
          </div>

          <div className="space-y-3" role="group" aria-label={ariaLabel}>
            {technologies.map((technology, index) => (
              <BusTechnologyButton
                key={technology.id}
                technology={technology}
                index={index}
                isActive={activeIndex === index}
                onSelect={onSelect}
                detailsId={detailsId}
                vertical
              />
            ))}
          </div>
        </div>
      </div>

      <TechnologyDetails
        technology={activeTechnology}
        detailsId={detailsId}
        index={activeIndex}
      />
    </div>
  );
}
