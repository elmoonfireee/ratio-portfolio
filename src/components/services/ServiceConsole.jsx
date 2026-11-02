import { ChevronDown } from "lucide-react";
import ServiceDetails from "./ServiceDetails";
import { activateWithKeyboard } from "./serviceKeyboard";

export default function ServiceConsole({ activeIndex, labels, onSelect, services }) {
  const activeService = services[activeIndex];

  return (
    <div data-services-variant="console">
      <div className="hidden gap-8 lg:grid lg:grid-cols-[minmax(20rem,0.78fr)_minmax(0,1.22fr)]">
        <div className="border-y border-white/10" role="group" aria-label={labels.servicesListLabel}>
          {services.map((service) => {
            const isActive = service.index === activeIndex;

            return (
              <button
                key={service.title}
                type="button"
                className={`hover-fine-service-item focus-ring relative grid w-full grid-cols-[3rem_1fr_auto] items-center gap-4 border-b border-white/10 px-4 py-4 text-left transition-colors motion-reduce:transition-none last:border-b-0 ${
                  isActive ? "bg-brand-black text-white" : "text-white/55"
                }`}
                aria-controls="service-console-desktop-detail"
                aria-pressed={isActive}
                onClick={() => onSelect(service.index)}
                onKeyDown={(event) => activateWithKeyboard(event, () => onSelect(service.index))}
              >
                <span className={`font-mono text-xs ${isActive ? "text-brand-orange" : "text-white/55"}`}>
                  {service.number}
                </span>
                <span className="text-sm font-medium leading-6">{service.title}</span>
                <span
                  className={`hover-fine-service-marker h-2 w-2 border transition-colors motion-reduce:transition-none ${
                    isActive ? "border-brand-orange bg-brand-orange" : "border-white/25"
                  }`}
                  aria-hidden="true"
                />
                {isActive ? <span className="absolute inset-y-0 left-0 w-px bg-brand-orange" aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>

        <ServiceDetails id="service-console-desktop-detail" key={activeService.number} service={activeService} />
      </div>

      <div className="border-t border-white/10 lg:hidden" role="group" aria-label={labels.servicesListLabel}>
        {services.map((service) => {
          const isActive = service.index === activeIndex;
          const panelId = `service-console-mobile-panel-${service.index}`;

          return (
            <div key={service.title} className="border-b border-white/10">
              <button
                type="button"
                className="focus-ring grid min-h-16 w-full grid-cols-[2.5rem_1fr_auto] items-center gap-3 py-4 text-left"
                aria-controls={panelId}
                aria-expanded={isActive}
                onClick={() => onSelect(service.index)}
                onKeyDown={(event) => activateWithKeyboard(event, () => onSelect(service.index))}
              >
                <span className={`font-mono text-xs ${isActive ? "text-brand-orange" : "text-white/55"}`}>
                  {service.number}
                </span>
                <span className={`text-sm font-medium leading-6 ${isActive ? "text-white" : "text-white/65"}`}>
                  {service.title}
                </span>
                <ChevronDown
                  size={18}
                  className={`text-brand-orange transition-transform motion-reduce:transition-none ${isActive ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>

              {isActive ? (
                <ServiceDetails
                  id={panelId}
                  service={service}
                  compact
                  className="mb-5"
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
