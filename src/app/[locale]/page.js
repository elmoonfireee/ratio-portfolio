import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import HomeExperience from "@/components/HomeExperience";
import Process from "@/components/Process";
import Projects from "@/components/Projects";
import Services from "@/components/Services";
import Technologies from "@/components/Technologies";
import { PrivacyPolicyProvider } from "@/components/privacy/PrivacyPolicyProvider";
import { siteConfig } from "@/data/site";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/getMessages";
import { getProjects } from "@/lib/storyblok-content";

export const revalidate = 300;

export default async function Home({ params }) {
  const { locale: requestedLocale } = await params;
  const locale = isLocale(requestedLocale) ? requestedLocale : defaultLocale;
  const messages = getMessages(locale);
  const services = messages.services.items;
  const projects = siteConfig.features.showHomepagePortfolio
    ? await getProjects(locale)
    : [];
  const nav = {
    ...messages.nav,
    items: messages.nav.items.filter(
      (item) => siteConfig.features.showHomepagePortfolio || item.href !== "#realizacje"
    )
  };
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: `${siteConfig.url}/${locale}`,
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    logo: `${siteConfig.url}/brand/logo_ratio_białe.png`,
    description: messages.meta.description,
    slogan: siteConfig.tagline,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    areaServed: [
      { "@type": "AdministrativeArea", name: locale === "pl" ? "Wielkopolska" : "Greater Poland" },
      { "@type": "AdministrativeArea", name: locale === "pl" ? "Dolny Śląsk" : "Lower Silesia" }
    ],
    brand: {
      "@type": "Brand",
      name: siteConfig.name
    },
    knowsAbout: ["Loxone", "Smart home", "Building automation", "System integration"],
    serviceType: services.map((service) => service.title)
  };

  return (
    <PrivacyPolicyProvider content={messages.privacyPolicy}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomeExperience
        locale={locale}
        messages={messages}
        nav={nav}
        showHomepagePortfolio={siteConfig.features.showHomepagePortfolio}
      >
        <Services content={messages.services} services={services} />
        <Process content={messages.process} />
        {siteConfig.features.showHomepagePortfolio ? (
          <Projects content={messages.projects} locale={locale} projects={projects} />
        ) : null}
        <Technologies content={messages.technologies} partner={messages.partner} />
        <About content={messages.about} />
        <Contact locale={locale} content={messages.contact} />
      </HomeExperience>
      <Footer locale={locale} content={messages.footer} nav={nav} partner={messages.partner} />
    </PrivacyPolicyProvider>
  );
}
