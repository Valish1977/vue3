import StoreService from '@/store'
import { createWebHistory, createRouter, Router, RouterOptions, RouteLocationNormalized, NavigationGuardNext } from "vue-router";
import { AppPreloadService, PreloaderSettersName, HelloPreloaderOpacitySettings } from '@/services/app_preload_service';
import Error404 from "@/views/Error404.vue";
import LoginView from "@/views/Login.vue";
import MainService from "@/core/main_service";


export default class RouterService{
  private static _instance: RouterService;
  public static get Instance(): RouterService {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }
  private _router: Router;
  private _redirectRoute = false;
  private _store = StoreService.Instance.store;
  private _appPreloadService = AppPreloadService.Instance;
  private _routerOtions: RouterOptions = {
    history: createWebHistory(),
    routes: [
      {
        path: '/:pathMatch(.*)*',
        name: "error404",
        component: Error404,
        meta: { showToolbar: false, showDrawer: false, showAddItem: false, showInMenu: false }
      },
      {
        path: process.env.BASE_URL + "/login",
        name: "login",
        component: LoginView,
        meta: { showToolbar: false, showDrawer: false, showAddItem: false, showInMenu: false }
      },
    ]
  }
  private constructor () {
    this._router = createRouter(this._routerOtions);
    this.setCurrentRoutes();
    this._ititialRouterEach();
  }
  public get router(): Router { return this._router; }

  public resetRouter(): void {
    this._router = createRouter(this._routerOtions);
     this._router.install(MainService.Instance.app);
    this.setCurrentRoutes();
  }

  public setCurrentRoutes() {
    const routes: any = JSON.parse(
      JSON.stringify(
        StoreService.Instance.store.getters.getRoutes(
          StoreService.Instance.store.getters.getUser.RoleCode
        )
      )
    );
    console.log(this._router.getRoutes());
    this._router.addRoute(routes[0]);
    console.log(this._router.getRoutes());
  }

  private _ititialRouterEach() {
    this._redirectRoute = false;
    this._router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): void => {
      if ( !this._redirectRoute  ) {
        if (to.matched.length > 0) {
          // если роут существует и не выбросит в редирект
          // навешиваем обработчик на false - нужно чтобы запустить лоадер дабы показать загрузку страницы
          this._appPreloadService.startLoader(PreloaderSettersName.RouterBeforeEach, HelloPreloaderOpacitySettings.OpacityMedium);
        }
      }
      setTimeout(() => {  // this delay is necessary for "loading.." window has time to appear
        console.log("beforeEach",to.path, to.matched.length)
        console.log(this._router);
        if (to.matched.length > 0) { // is route exist?
          switch ((to.path).toLowerCase()) { // route processing
            case "/login":
              if (this._store.getters.getUser.auth ) {
                this._redirectRoute  = true;
                next(this._store.getters.getFirstRoute(this._store.getters.getUser.RoleCode));
              } else {
                if (to.path === "/") {
                  next(this._store.getters.getFirstRoute(this._store.getters.getUser.RoleCode));
                }
                next();
              }
              break;
            default:
              if (to.path === "/") {
                next(this._store.getters.getFirstRoute(this._store.getters.getUser.RoleCode));
              }
              return next();
          }
        } else {
          next(this._store.getters.getFirstRoute(this._store.getters.getUser.RoleCode));
          // next("/404"); if route isn"t exist go to /404
        }
      }, 500);
    });
    // eslint-disable-next-line
    this._router.afterEach((to: RouteLocationNormalized): void => {
      this._store.dispatch("setCurrentRoute", to); // без этого не работает пагинация !!!
      this._appPreloadService.stopLoader(PreloaderSettersName.RouterAfterEach);
    });
  }
}
