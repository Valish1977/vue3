import AppView from '@/AppView.vue'
import { App, createApp } from "vue";
import FontAwesomeIcon from '@/plugins/icons';
import { AppPreloadService, PreloaderSettersName, HelloPreloaderOpacitySettings } from '@/services/app_preload_service';
import StoreService from '@/store';
import AuthService from './auth_service';
import RouterService from './router_service';

export default class MainService {
    private static _instance: MainService;
    private _app: App<Element>;
    private constructor() {
        this._app = createApp(AppView);
    }
    public static get Instance(): MainService {
        if (!this._instance) {
            this._instance = new this();
        }
        return this._instance;
    }
    public get app(): App<Element> {
        return this._app;
    }
    public appComponents(): void {
        this._app.component('FontAwesomeIcon', FontAwesomeIcon).mount('#app');
    }
    public runApp(): void {
        const auth = new AuthService();
        AppPreloadService.Instance.startLoader(PreloaderSettersName.StartMain, HelloPreloaderOpacitySettings.OpacityMedium);
        // if no auth, user exist in local store?
        if (!StoreService.Instance.store.getters.getUser.auth) {
            // console.log("no user");
            // check user in localStorage
            if (auth.checkUserInLocalStorage()) {
                RouterService.Instance.router.push({ path: "/login" });
            }
        }
    }
}