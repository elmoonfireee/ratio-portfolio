import pl from "../../messages/pl.json";
import en from "../../messages/en.json";
import { defaultLocale, isLocale } from "./config";

const dictionaries = { pl, en };

export function getMessages(locale) {
  return dictionaries[isLocale(locale) ? locale : defaultLocale];
}
