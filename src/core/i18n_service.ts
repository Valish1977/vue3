import StoreService from "@/store";
import { LANG_DISPATCH } from "@/store/modules/lang";
import enLocale from "element-plus/lib/locale/lang/en";
import esLocale from "element-plus/lib/locale/lang/es";
import { createI18n, I18nOptions, LocaleMessages} from "vue-i18n";

export default class I18nService {
  private static _instance: I18nService;
  private _store = StoreService.Instance.store;
  public static get Instance(): I18nService {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }
  private constructor(){
    this._i18n = createI18n({
      locale: 'en',
      fallbackLocale: this._startLang,
      messages: this._loadLocaleMessages()
    } as I18nOptions);
  }

  private get _startLang() { return localStorage.getItem("language")?? (process.env.VUE_APP_I18N_LOCALE || "en"); }
  
  private _i18n: any;
  public get i18n(): any { return this._i18n; }
  
  private _loadElementLocale(locale: string): any {
    switch (locale) {
      case "en":
      return enLocale;
      case "es":
      return esLocale;
      default:
      return enLocale;
    }
  }


  private _loadLocaleMessages(): LocaleMessages {
    const locales = require.context("@/locales", true, /[A-Za-z0-9-_,\s]+\.json$/i);
    const messages: LocaleMessages = {};

    locales.keys().forEach((key) => {
      const matched = key.match(/([A-Za-z0-9-_]+)\./i);
      if (matched && matched.length > 1) {
        const locale = matched[1];
        messages[locale] = locales(key);
        Object.assign(messages[locale],  this._loadElementLocale(locale));
      }
    });
    const lang = localStorage.getItem("language");
    if (lang) {
      this._store.dispatch(LANG_DISPATCH.SET_LANGUAGE, lang);
    } else {
      this._store.dispatch(LANG_DISPATCH.SET_LANGUAGE, this._startLang);
      localStorage.setItem('language', this._startLang);
    }
    return messages;
  }
}