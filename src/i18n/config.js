export const locales = ["pl", "en"];
export const defaultLocale = "pl";

export function isLocale(locale) {
  return locales.includes(locale);
}
