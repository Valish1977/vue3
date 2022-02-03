import StoreService from '@/store'
import { createWebHistory, createRouter, Router, RouterOptions, RouteLocationNormalized, NavigationGuardNext } from "vue-router";
import { AppPreloadService, PreloaderSettersNameCore, HelloPreloaderOpacitySettings } from '@/services/app_preload_service';
import { ROUTER_PATH, ROUTES_DISPATCH, ROUTES_GETTERS } from '@/store/modules/routes';
import { AUTH_GETTERS } from '@/store/modules/auth';

export default class RouterService {
  private static _instance: RouterService;
  public static get Instance(): RouterService {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }
  private _defaultRouters = StoreService.Instance.store.getters[ROUTES_GETTERS.GET_DEFAULT_ROUTES];
  private _defaultAllRouterNames: string[] = [];
  private _router: Router;
  private _isLoading = false;
  private _store = StoreService.Instance.store;
  private _appPreloadService = AppPreloadService.Instance;
  private _routerOtions: RouterOptions = {
    history: createWebHistory(),
    routes: []
  }
  private constructor() {
    this._router = createRouter(this._routerOtions);
    this._getDefaultAllRouterNames();
    this._addRouteFn(this._defaultRouters);
    this.setCurrentRoutes();
    this._ititialRouterEach();
  }
  public get router(): Router { return this._router; }
  // tslint:disable:max-line-length
  private _lazyLoadComponent(component: string) {
    return () => import(`@/views/${component}`);
  }
  private _getDefaultAllRouterNames() {
    for (const v of this._defaultRouters) {
      this._defaultAllRouterNames.push(v.name);
    }
  }
  public resetRouter(): void {
    const arrRoutes = this._router.getRoutes();
    for (const v of arrRoutes) {
      const name = v.name as string;
      if (this._defaultAllRouterNames.indexOf(name) === -1) {
        this._router.removeRoute(name)
      }
    }
    this.setCurrentRoutes();
  }

  public setCurrentRoutes() {
    const role = StoreService.Instance.store.getters[AUTH_GETTERS.GET_USER].RoleCode;
    const routes = StoreService.Instance.store.getters[ROUTES_GETTERS.GET_ROUTES](role);
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
    const arrRoutes = this._router.getRoutes();
  }
  
  private _ititialRouterEach() {
    this._isLoading = false;
    this._router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): void => {
      const arrRoutes = this._router.getRoutes();
      const isRoute = arrRoutes.find((v: any) => to.path === v.path);
      if (!this._isLoading) {
        this._appPreloadService.startLoader(PreloaderSettersNameCore.RouterBeforeEach, HelloPreloaderOpacitySettings.OpacityMedium);
        this._isLoading = true;
      }
      setTimeout(() => {  // this delay is necessary for "loading.." window has time to appear
        const isAuth = this._store.getters[AUTH_GETTERS.GET_USER].auth;
        if (to.matched.length > 0) { // is route exist?
          switch ((to.path).toLowerCase()) { // route processing
            case ROUTER_PATH.LOGIN:
              if (isAuth) {
                next(this._store.getters[ROUTES_GETTERS.GET_FIRST_ROUTE](this._store.getters[AUTH_GETTERS.GET_USER].RoleCode));
              } else {
                if (to.path === ROUTER_PATH.BASE_ALISAS) {
                  next(ROUTER_PATH.LOGIN);
                } else {
                  next();
                }
              }
              break;
            default:
              if (to.path === ROUTER_PATH.BASE_ALISAS) {
                next(this._store.getters[ROUTES_GETTERS.GET_FIRST_ROUTE](this._store.getters[AUTH_GETTERS.GET_USER].RoleCode));
              } else if (to.path !== "" && isRoute && to.matched[0].path === ROUTER_PATH.ERROR) {
                next(to.fullPath);
              } else {
                next();
              }
          }
        } else {
          next(this._store.getters[ROUTES_GETTERS.GET_FIRST_ROUTE](this._store.getters[AUTH_GETTERS.GET_USER].RoleCode));
        }
      }, 500);
    });
    // eslint-disable-next-line
    this._router.afterEach((to: RouteLocationNormalized): void => {
      this._appPreloadService.stopLoader(PreloaderSettersNameCore.RouterBeforeEach, HelloPreloaderOpacitySettings.OpacityMedium);
      this._isLoading = false;
      this._store.dispatch(ROUTES_DISPATCH.SET_CURRENT_ROUTE, to); // без этого не работает пагинация !!!
    });
  }
}
