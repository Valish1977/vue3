import StoreService from '@/store';
import { APP_DISPATCH, APP_GETTERS } from '@/store/modules/app';
export enum HelloPreloaderOpacitySettings {
    Step = 0.05,
    OpacityFull = 1,
    OpacityNull = 0,
    OpacityMedium = 0.5

}
export enum DoomElementById {
    HellopreloaderPreload = 'hellopreloader_preload'
}
export enum PreloaderSettersNameCore {
    WindowOnload = 'App.vue/window.onload',
    StartMain = 'main.ts/start main',
    RouterBeforeEach = "main.ts/router.beforeEach",
    RouterAfterEach = "main.ts/router.afterEach"
}

export class AppPreloadService {
    private static _instance: AppPreloadService;
    private constructor(){
        // do nothing.
    }
    public static get Instance(): AppPreloadService {
        if (!this._instance) {
            this._instance = new this();
        }
        this._instance.setupInstance();
        return this._instance;
    }
    private hellopreloaderStatus = false;
    private hellopreloader: HTMLElement | null = null;

    private setupInstance(): void {
        window.onload = () => {
            this.hellopreloader = document.getElementById(DoomElementById.HellopreloaderPreload);
            this.stopLoader(PreloaderSettersNameCore.WindowOnload);
            setTimeout(() => {
                this._loaderDisabled();
            }, 250);
        };
    }
    public startLoader(name: string, opacity?: number): void {
        StoreService.Instance.store.dispatch(APP_DISPATCH.SET_LOADING, { name, value: true, opacity: opacity?? 0 });
    }
    public stopLoader(name: string, opacity?: number): void {
        StoreService.Instance.store.dispatch(APP_DISPATCH.SET_LOADING, { name, value: false, opacity: opacity?? 0 }); 
    }
    private _loaderEnabled(val: any): void {
        if (this.hellopreloader !== null) {
            this.hellopreloaderStatus = true;
            this.hellopreloader.style.display = "block";
            const interhellopreloader = setInterval(() => {
                if (!this.hellopreloaderStatus) {
                    clearInterval(interhellopreloader);
                }
                const newOpacityVal = parseFloat(this.hellopreloader!.style.opacity? this.hellopreloader!.style.opacity : HelloPreloaderOpacitySettings.OpacityNull.toString()) + HelloPreloaderOpacitySettings.Step;
                this.hellopreloader!.style.opacity = newOpacityVal.toString();
                if (newOpacityVal >= val) {
                    clearInterval(interhellopreloader);
                }
            }, 16);
        }
    }
    public get countLoaded() {
        return StoreService.Instance.store.getters[APP_GETTERS.GET_LOADING]; // отслеживаем загрузку модулей
    }
    public watchCountLoaded(): void {
        // управление окном загрузки вкл/выкл
        if (this.countLoaded > 0) {
            this._loaderEnabled(StoreService.Instance.store.state.app.opacityLoad); // выставляем полупрозрачность
        } else {
            this._loaderDisabled();
        }
    }
    private _loaderDisabled(): void {
        if (this.hellopreloader) {
            this.hellopreloaderStatus = false;
            const interhellopreloader2 = setInterval(() => {
                if (this.hellopreloaderStatus) {
                    clearInterval(interhellopreloader2);
                }
                const newOpacityVal = parseFloat(this.hellopreloader!.style.opacity? this.hellopreloader!.style.opacity : HelloPreloaderOpacitySettings.OpacityFull.toString()) - HelloPreloaderOpacitySettings.Step;
                this.hellopreloader!.style.opacity = newOpacityVal.toString();
                if (newOpacityVal <= 0.05) {
                    clearInterval(interhellopreloader2);
                    this.hellopreloader!.style.display = "none";
                }
            }, 16);
        }
    }
}