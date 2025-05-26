import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["pt", "en", "fr", "es"],

  // Used when no locale matches
  defaultLocale: "pt",

  // Only add locale prefix when needed (pt won't have prefix)
  localePrefix: "as-needed",
});
