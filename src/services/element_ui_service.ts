import I18nService from '@/core/i18n_service';

export default class ElementUiService {
  private static _instance: ElementUiService;
  private _options: any;
  private constructor(){
    this._options = {
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        i18n:  (key: any): any => I18nService.Instance.i18n.global.locale,
    }
  }
  public get options(): any {
    return this._options;
  }
  public static get Instance(): ElementUiService {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }
}
