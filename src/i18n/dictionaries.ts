import { cache } from "react";
import type { Locale } from "@/i18n/config";
import en from "@/i18n/messages/en.json";
import pt from "@/i18n/messages/pt-PT.json";

export type Dictionary = typeof import("@/i18n/messages/en.json");

export const dictionaries: Record<Locale, Dictionary> = {
  "pt-PT": pt as Dictionary,
  en: en as Dictionary,
};

export const getDictionary = cache(async (locale: Locale): Promise<Dictionary> => dictionaries[locale]);
