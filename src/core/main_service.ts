import AppView from '@/views/app_view/AppView.vue'
import { App, createApp } from "vue";
import { AppPreloadService, HelloPreloaderOpacitySettings, PreloaderSettersNameCore } from '@/services/app_preload_service';
import { CoreCallback } from './core_callback';

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
    public runApp(): void {
        AppPreloadService.Instance.startLoader(PreloaderSettersNameCore.StartMain, HelloPreloaderOpacitySettings.OpacityMedium);
        CoreCallback.runApp();
    }
}