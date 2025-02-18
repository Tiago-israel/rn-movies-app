import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";
import { ptBRTexts } from "./pt-br";
import { usTexts } from "./en";
import { useUserStore } from "../store";

const i18n = new I18n({
  en: usTexts,
  "pt-BR": ptBRTexts,
});

export function initializeLanguage(language: string) {
  i18n.locale = language ?? "pt-BR";
}

export function setLocation(languageCode: string) {
  i18n.locale = languageCode;
}

export function getText(key: keyof typeof usTexts) {
  return i18n.t(key);
}
