import { useStore } from 'vuex';
export class DoomElementById {
    static hellopreloaderPreload = 'hellopreloader_preload';
}
export class LoadingAppStore {
    static setter = 'app/setLoading';
    static getter = 'app/getLoading';
}
export class AppSettersName {
    static windowOnload = 'App.vue/window.onload';
}


export class AppService {
    private static _instance: AppService;
    private constructor(){
        // do nothing.
    }
    public static get Instance(): AppService {
        if (!this._instance) {
            this._instance = new this();
        }
        this._instance.setupInstance();
        return this._instance;
    }

    private store = useStore();
    private hellopreloaderStatus = false;
    private hellopreloader: HTMLElement | null = null;

    private setupInstance(): void {
        window.onload = () => {
            this.hellopreloader = document.getElementById(DoomElementById.hellopreloaderPreload);
            this.stopLoader(AppSettersName.windowOnload);
            setTimeout(() => {
                this._loaderDisabled();
            }, 250);
        };
    }
    public startLoader(name: string): void {
        this.store?.dispatch(LoadingAppStore.setter, { name, value: true });
    }
    public stopLoader(name: string): void {
        this.store?.dispatch(LoadingAppStore.setter, { name, value: false }); 
    }
    private _loaderEnabled(val: any): void {
        if (this.hellopreloader !== null) {
            this.hellopreloaderStatus = true;
            this.hellopreloader.style.display = "block";
            const interhellopreloader = setInterval(() => {
                if (!this.hellopreloaderStatus) {
                    clearInterval(interhellopreloader);
                }
                const newOpacityVal = parseFloat(this.hellopreloader!.style.opacity? this.hellopreloader!.style.opacity : '0') + 0.05;
                this.hellopreloader!.style.opacity = newOpacityVal.toString();
                if (newOpacityVal >= val) {
                    clearInterval(interhellopreloader);
                }
            }, 16);
        }
    }
    public get countLoaded() {
        return this.store?.getters[LoadingAppStore.getter]; // отслеживаем загрузку модулей
    }
    public watchCountLoaded(): void {
        // управление окном загрузки вкл/выкл
        if (this.countLoaded > 0) {
            this._loaderEnabled(this.store.state.app.opacityLoad); // выставляем полупрозрачность
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
                const newOpacityVal = parseFloat(this.hellopreloader!.style.opacity? this.hellopreloader!.style.opacity : '0') + 0.05;
                this.hellopreloader!.style.opacity = newOpacityVal.toString();
                if (newOpacityVal <= 0.05) {
                    clearInterval(interhellopreloader2);
                    this.hellopreloader!.style.display = "none";
                }
            }, 16);
        }
    }
}