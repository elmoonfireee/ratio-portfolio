export const projectCategories = [
  "Smart Home",
  "Building Automation",
  "Security",
  "Energy Management",
  "IT Infrastructure"
];

export const projectRoutes = {
  pl: "/pl/realizacje",
  en: "/en/projects"
};

export const projects = [
  {
    slug: "smart-home-comfort-demo",
    isDemo: true,
    category: "Smart Home",
    year: "2026",
    featuredImage: "/projects/neutral-smart-home.svg",
    galleryImages: [
      { src: "/projects/neutral-smart-home.svg", alt: { pl: "Neutralna wizualizacja panelu smart home", en: "Neutral smart home panel visualization" } },
      { src: "/projects/neutral-automation.svg", alt: { pl: "Neutralny schemat automatyki budynkowej", en: "Neutral building automation schematic" } }
    ],
    status: { pl: "Projekt demonstracyjny", en: "Demo project" },
    location: { pl: "Przykładowy region obsługi", en: "Example service region" },
    title: { pl: "Scenariusze komfortu w domu demonstracyjnym", en: "Comfort scenarios in a demo home" },
    shortDescription: {
      pl: "Neutralny przykład pokazujący, jak może wyglądać opis projektu smart home bez wskazywania realnego klienta.",
      en: "A neutral example showing how a smart home project description can be structured without referencing a real client."
    },
    fullDescription: {
      pl: "Ten wpis jest wyłącznie demonstracją struktury przyszłej realizacji RATIO Smart Innovations. Nie opisuje prawdziwego domu, klienta, adresu ani zakończonego wdrożenia.",
      en: "This entry only demonstrates the structure of a future RATIO Smart Innovations project. It does not describe a real home, client, address or completed implementation."
    },
    scopeOfWork: {
      pl: ["Koncepcja scen komfortu", "Przykładowy dobór czujników", "Schemat sterowania oświetleniem i roletami"],
      en: ["Comfort scene concept", "Example sensor selection", "Lighting and shading control outline"]
    },
    systemsAndTechnologies: ["Loxone Miniserver", "Touch Pure", "Tree sensors", "Lighting control", "Shading automation"],
    keyFunctions: {
      pl: ["Sceny dzienne i wieczorne", "Automatyczne rolety", "Powiadomienia techniczne", "Sterowanie z aplikacji"],
      en: ["Day and evening scenes", "Automated blinds", "Technical notifications", "App-based control"]
    },
    testimonial: { enabled: false, quote: { pl: "", en: "" }, author: "" }
  },
  {
    slug: "building-automation-coming-soon",
    isDemo: true,
    category: "Building Automation",
    year: "2026",
    featuredImage: "/projects/neutral-automation.svg",
    galleryImages: [
      { src: "/projects/neutral-automation.svg", alt: { pl: "Neutralna wizualizacja automatyki budynku", en: "Neutral building automation visualization" } },
      { src: "/projects/neutral-security.svg", alt: { pl: "Neutralna wizualizacja integracji bezpieczeństwa", en: "Neutral security integration visualization" } }
    ],
    status: { pl: "Wkrótce", en: "Coming soon" },
    location: { pl: "Wielkopolska / Dolny Śląsk", en: "Greater Poland / Lower Silesia" },
    title: { pl: "Automatyka budynku — miejsce na case study", en: "Building automation — case study placeholder" },
    shortDescription: {
      pl: "Przykładowa karta przygotowana pod przyszły, zweryfikowany opis automatyki budynkowej.",
      en: "An example card prepared for a future verified building automation case study."
    },
    fullDescription: {
      pl: "Opis zostanie zastąpiony po dostarczeniu prawdziwych materiałów, zdjęć i potwierdzonego zakresu. Aktualnie jest to neutralny placeholder.",
      en: "This description will be replaced after real materials, images and a confirmed scope are provided. For now it is a neutral placeholder."
    },
    scopeOfWork: {
      pl: ["Analiza potrzeb budynku", "Przykładowa logika automatyki", "Plan integracji instalacji technicznych"],
      en: ["Building needs analysis", "Example automation logic", "Technical systems integration plan"]
    },
    systemsAndTechnologies: ["Loxone", "HVAC integration", "Access control", "Alarm signals", "Network infrastructure"],
    keyFunctions: {
      pl: ["Harmonogramy pracy", "Integracja HVAC", "Sygnalizacja zdarzeń", "Panel administracyjny"],
      en: ["Operating schedules", "HVAC integration", "Event signaling", "Administration panel"]
    },
    testimonial: { enabled: false, quote: { pl: "", en: "" }, author: "" }
  },
  {
    slug: "energy-it-infrastructure-demo",
    isDemo: true,
    category: "Energy Management",
    year: "2026",
    featuredImage: "/projects/neutral-energy.svg",
    galleryImages: [
      { src: "/projects/neutral-energy.svg", alt: { pl: "Neutralny schemat zarządzania energią", en: "Neutral energy management schematic" } },
      { src: "/projects/neutral-it.svg", alt: { pl: "Neutralny schemat infrastruktury IT", en: "Neutral IT infrastructure schematic" } }
    ],
    status: { pl: "Projekt demonstracyjny", en: "Demo project" },
    location: { pl: "Przykładowy obszar techniczny", en: "Example technical service area" },
    title: { pl: "Energia i infrastruktura IT — demonstracja", en: "Energy and IT infrastructure — demo" },
    shortDescription: {
      pl: "Neutralny przykład łączący zarządzanie energią, sieć LAN/Wi‑Fi i stabilną pracę systemu smart home.",
      en: "A neutral example combining energy management, LAN/Wi‑Fi networking and reliable smart home operation."
    },
    fullDescription: {
      pl: "Wpis demonstracyjny pokazuje typ pól, które można wypełnić dla prawdziwej realizacji. Nie zawiera wyników, parametrów ani danych konkretnej inwestycji.",
      en: "This demo entry shows the type of fields that can be completed for a real project. It does not include results, parameters or data from a specific investment."
    },
    scopeOfWork: {
      pl: ["Koncepcja monitoringu zużycia", "Przykładowa architektura sieci", "Lista integracji technicznych"],
      en: ["Consumption monitoring concept", "Example network architecture", "Technical integrations list"]
    },
    systemsAndTechnologies: ["Loxone Energy Manager", "LAN", "Wi‑Fi", "UPS-ready network cabinet", "Technical notifications"],
    keyFunctions: {
      pl: ["Podgląd zużycia", "Stabilna sieć dla automatyki", "Powiadomienia o stanie instalacji", "Przygotowanie pod rozwój"],
      en: ["Consumption overview", "Stable network for automation", "Installation status notifications", "Expansion-ready setup"]
    },
    testimonial: { enabled: false, quote: { pl: "", en: "" }, author: "" }
  }
];

export function getProjectBySlug(slug) {
  return projects.find((project) => project.slug === slug);
}

export function getProjectPath(locale, slug) {
  return locale === "pl" ? `/pl/realizacje/${slug}` : `/en/projects/${slug}`;
}

export function getProjectsPath(locale) {
  return locale === "pl" ? "/pl/realizacje" : "/en/projects";
}
