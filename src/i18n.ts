
import store from "./store/index";
import { createI18n, LocaleMessages} from "vue-i18n";
import enLocale from "element-plus/lib/locale/lang/en";
import esLocale from "element-plus/lib/locale/lang/es";
function loadElementLocale(locale: string): any {
  switch (locale) {
    case "en":
    return enLocale;
    case "es":
    return esLocale;
    default:
    return enLocale;
  }
}
let startLang: string | null = localStorage.getItem("language");
if (!startLang) {
  startLang = process.env.VUE_APP_I18N_LOCALE || "en";
}

function loadLocaleMessages(): LocaleMessages {
  const locales = require.context("./locales", true, /[A-Za-z0-9-_,\s]+\.json$/i);
  const messages: LocaleMessages = {};
  
  locales.keys().forEach((key) => {
    
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
      Object.assign(messages[locale],  loadElementLocale(locale));
    }
  });
  const lang = localStorage.getItem("language");
  if (lang) {
    store.dispatch("setLanguage", lang);
  } else {
    store.dispatch("setLanguage", startLang);
    localStorage.setItem("language", startLang as string);
  }
  return messages;
}
export const i18n = createI18n({
  locale: 'en',
  fallbackLocale: startLang,
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  messages: loadLocaleMessages() as any
});
