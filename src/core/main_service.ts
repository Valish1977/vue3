import AppView from '@/AppView.vue'
import { App, createApp } from "vue";
import FontAwesomeIcon from '@/plugins/icons';
import { AppPreloadService, HelloPreloaderOpacitySettings, PreloaderSettersNameCore } from '@/services/app_preload_service';
import StoreService from '@/store';
import AuthService from './auth_service';
import RouterService from './router_service';
import Filter from "@/components/filters/api/filters";
import VuexService from './vuex_service';
import { ReferenceConfig, RouterPath } from '@/config';
import { FilterApi, FilterDispatch } from '@/components/filters/enums';

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
    public runApp({ authorization = false } = {}): void {
        AppPreloadService.Instance.startLoader(PreloaderSettersNameCore.StartMain, HelloPreloaderOpacitySettings.OpacityMedium);
        // if no auth, user exist in local store?
        this._setReferences();
        if (authorization) this._setupAuthorized();
    }
    private _setupAuthorized() {
        const auth = new AuthService();
        if (!StoreService.Instance.store.getters.getUser.auth) {
            if (auth.checkUserInLocalStorage()) {
                RouterService.Instance.router.push({ path: RouterPath.login });
            }
        }
    }
    private _setReferences() {
        StoreService.Instance.store.dispatch(FilterDispatch.SET_REFERENCES, ReferenceConfig.referenceList);
        VuexService.Instance.axios.get(FilterApi.GET_REF_VERSION, {
        }).then((response: any) => {
            Filter.testVersions( response.data );
        }, (err: any) => {
             //
        });
    }
}