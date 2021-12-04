import StoreService from '@/store'
import { createWebHistory, createRouter, Router, RouterOptions, RouteLocationNormalized, NavigationGuardNext } from "vue-router";
import { AppPreloadService, PreloaderSettersNameCore, HelloPreloaderOpacitySettings } from '@/services/app_preload_service';
import { AuthStoreGetters, RouterStoreActions, RouterStoreGetters } from '@/config';

export default class RouterService{
  private static _instance: RouterService;
  public static get Instance(): RouterService {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }
  private _defaultRouters = StoreService.Instance.store.getters[RouterStoreGetters.getDefaultRoutes];
  private _defaultAllRouterNames: string[] = [];
  private _router: Router;
  private _redirectRoute = false;
  private _store = StoreService.Instance.store;
  private _appPreloadService = AppPreloadService.Instance;
  private _routerOtions: RouterOptions = {
    history: createWebHistory(),
    routes: []
  }
  private constructor () {
    this._router = createRouter(this._routerOtions);
    this._getDefaultAllRouterNames();
    this._addRouteFn(this._defaultRouters);
    this.setCurrentRoutes();
    this._ititialRouterEach();
  }
  public get router(): Router { return this._router; }
  // tslint:disable:max-line-length
  private  _lazyLoadComponent(component: string) {
    return () => import(`@/views/${component}`);
  }
  private _getDefaultAllRouterNames() {
    for( const v of this._defaultRouters ) {
      this._defaultAllRouterNames.push(v.name);
    }
  }
  public resetRouter(): void {
    const arrRoutes = this._router.getRoutes();
    for ( const v of arrRoutes) {
      const name = v.name as string;
      if (this._defaultAllRouterNames.indexOf(name) === -1) {
        this._router.removeRoute(name)
      }
    }
    this.setCurrentRoutes();
  }

  public setCurrentRoutes() {
    const routes = StoreService.Instance.store.getters[RouterStoreGetters.getRoutes](
      StoreService.Instance.store.getters[AuthStoreGetters.getUser].RoleCode
    )
    this._addRouteFn(routes);
  }
  private _addRouteFn(routes: any, parentRouteName: any = undefined): void {
    if (Array.isArray(routes)) {
      for (const route of routes) {
        const currentRoute = Object.assign({}, route);
        currentRoute.component = this._lazyLoadComponent(route.component);
        if (parentRouteName !== undefined) {
          this._router.addRoute(parentRouteName, currentRoute);
        } else {
          this._router.addRoute(currentRoute);
        }
        if (route.children) {
          this._addRouteFn(route.children, route.name);
        }
      }
    }
  }
  private _ititialRouterEach() {
    this._redirectRoute = false;
    this._router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): void => {
      if ( !this._redirectRoute  ) {
        if (to.matched.length > 0) {
          // если роут существует и не выбросит в редирект
          // навешиваем обработчик на false - нужно чтобы запустить лоадер дабы показать загрузку страницы
          this._appPreloadService.startLoader(PreloaderSettersNameCore.RouterBeforeEach, HelloPreloaderOpacitySettings.OpacityMedium);
        }
      }
      setTimeout(() => {  // this delay is necessary for "loading.." window has time to appear
        if (to.matched.length > 0) { // is route exist?
          switch ((to.path).toLowerCase()) { // route processing
            case "/login":
              if (this._store.getters[AuthStoreGetters.getUser].auth ) {
                this._redirectRoute  = true;
                next(this._store.getters[RouterStoreGetters.getFirstRoute](this._store.getters[AuthStoreGetters.getUser].RoleCode));
              } else {
                if (to.path === "/") {
                  next(this._store.getters[RouterStoreGetters.getFirstRoute](this._store.getters[AuthStoreGetters.getUser].RoleCode));
                }
                next();
              }
              break;
            default:
              if (to.path === "/") {
                next(this._store.getters[RouterStoreGetters.getFirstRoute](this._store.getters[AuthStoreGetters.getUser].RoleCode));
              }
              return next();
          }
        } else {
          next(this._store.getters[RouterStoreGetters.getFirstRoute](this._store.getters[AuthStoreGetters.getUser].RoleCode));
          // next("/404"); if route isn"t exist go to /404
        }
      }, 500);
    });
    // eslint-disable-next-line
    this._router.afterEach((to: RouteLocationNormalized): void => {
      this._store.dispatch(RouterStoreActions.setCurrentRoute, to); // без этого не работает пагинация !!!
      this._appPreloadService.stopLoader(PreloaderSettersNameCore.RouterAfterEach);
    });
  }
}
