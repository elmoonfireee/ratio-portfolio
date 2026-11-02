import "../globals.css";
import { siteConfig } from "@/data/site";
import { defaultLocale, isLocale, locales } from "@/i18n/config";
import { getMessages } from "@/i18n/getMessages";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale: requestedLocale } = await params;
  const locale = isLocale(requestedLocale) ? requestedLocale : defaultLocale;
  const messages = getMessages(locale);
  const canonical = `/${locale}`;

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: messages.meta.title,
      template: `%s | ${siteConfig.name}`
    },
    description: messages.meta.description,
    applicationName: siteConfig.name,
    keywords: messages.meta.keywords,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    alternates: {
      canonical,
      languages: {
        pl: "/pl",
        en: "/en",
        "x-default": "/pl"
      }
    },
    openGraph: {
      type: "website",
      locale: messages.meta.locale,
      url: canonical,
      siteName: siteConfig.name,
      title: messages.meta.title,
      description: messages.meta.description,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1302,
          height: 720,
          alt: siteConfig.name
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: messages.meta.title,
      description: messages.meta.description,
      images: [siteConfig.ogImage]
    },
    robots: {
      index: true,
      follow: true
    },
    icons: {
      icon: "/favicon.svg"
    }
  };
}

export default async function LocaleLayout({ children, params }) {
  const { locale: requestedLocale } = await params;
  const locale = isLocale(requestedLocale) ? requestedLocale : defaultLocale;
  const messages = getMessages(locale);

  return (
    <html lang={locale}>
      <body>
        <a href="#main-content" className="skip-link">
          {messages.skipLink}
        </a>
        {children}
      </body>
    </html>
  );
}
