/* The Business Term workspace with an English / 中文 switch (language demo).
 *
 * The language is plain host state. The switch is a public `FilterPills`; the app is
 * `BusinessTermApp` given one of two content objects. There is no i18n provider and
 * no change inside the components: every visible text already arrives as a prop with
 * an English default, so a second language is a second object. Records are data and
 * keep the language they were written in; the page and form copy switch at once and
 * nothing the user typed is lost.
 */
import React from "react";
import { FilterPills } from "marketing-hub";
import { BusinessTermApp, englishContent, seedTerms } from "./BusinessTermApp";
import { zhContent, zhSeedTerms } from "./localized/zh";

export type Locale = "en" | "zh";

const CONTENT = { en: englishContent, zh: zhContent };
const SWITCH_LABEL = { en: "Language", zh: "语言" };
const LANGUAGES = [
  { id: "en", label: "English" },
  { id: "zh", label: "中文" },
];

/**
 * @param props.initialLocale language shown first; it also picks which seed records start in the list
 */
export function LocalizedBusinessTermApp({ initialLocale = "en" }: { initialLocale?: Locale }) {
  const [locale, setLocale] = React.useState<Locale>(initialLocale);
  /* Seeds are read once: switching language later must not reset the list. */
  const [terms] = React.useState(() => (initialLocale === "zh" ? zhSeedTerms : seedTerms));
  return (
    <>
      <div style={{ position: "fixed", left: "50%", bottom: 16, transform: "translateX(-50%)", zIndex: 20 }}>
        <FilterPills label={SWITCH_LABEL[locale]} items={LANGUAGES} value={locale} onChange={({ id }) => setLocale(id as Locale)} />
      </div>
      <div lang={locale === "zh" ? "zh-CN" : "en"}>
        <BusinessTermApp terms={terms} content={CONTENT[locale]} />
      </div>
    </>
  );
}
