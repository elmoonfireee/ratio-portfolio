export const PRODUCTION_SITE_URL = "https://ratiosmart.pl";

export const siteConfig = {
  name: "RATIO Smart Innovations",
  tagline: "Smart home. Inteligentnie zaprojektowane.",
  // Production URLs must always use the canonical RATIO domain. The environment
  // variable remains useful for local development only.
  url: (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL
    : PRODUCTION_SITE_URL
  ).replace(/\/$/, ""),
  ogImage: "/brand/ratio-logo-card.png",
  contact: {
    phone: "+48 576 412 390",
    email: "kontakt@ratiosmart.pl",
    taxId: "8971950553"
  },
  features: {
    showHomepagePortfolio: false
  }
};
