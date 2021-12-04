export enum AppStoreActions {
  setLoading = 'app/setLoading',
  setWindowWidth = "app/setWindowWidth",
  setBus = 'app/setBus',
  setSideBar = 'app/setSideBar',
  setPaginationData = "app/setPaginationData",
  resetPaginationData = 'app/resetPaginationData',
}
export enum AppStoreGetters {
  getLoading = 'app/getLoading',
  getSideBar = "app/getSideBar",
  windowWidth = "app/windowWidth",
  getBus = 'app/getBus',
  getBusState = 'app/getBusState',
  getPaginationData = 'app/getPaginationData'
}
export enum AuthStoreActions {
  unsetUser = 'auth/unsetUser',
  setUser = 'auth/setUser',
}
export enum AuthStoreGetters {
  getUser = 'auth/getUser',
}
export enum LangStoreActions {
  setLanguage = 'lang/setLanguage',
}
export enum LangStoreGetters {
  language = 'lang/language',
}

export enum RouterRoleNames {
  adm = "adm",
  default = "default",
  guest = "guest"
}
export enum RouterPath {
  layout = "/",
  error = "/:pathMatch(.*)*",
  login = "/login",
  dashboard = "/dashboard"
}
export enum RouterName {
  layout = "layout",
  error = "error404",
  login = "login",
  dashboard = "dashboard"
}
export enum RouterComponent {
  layout = "layout/Layout.vue",
  error = "error/Error404.vue",
  login = "login/Login.vue",
  dashboard = "dashboard/Dashboard.vue"
}
export enum RouterStoreActions {
  setCurrentRoute = 'routes/setCurrentRoute',
}
export enum RouterStoreGetters {
  getRoutes = 'routes/getRoutes',
  getDefaultRoutes = "routes/getDefaultRoutes",
  getPath = "routes/getPath",
  getFirstRoute = "routes/getFirstRoute",
  getCurrentRoute = "routes/getCurrentRoute",
}

export class RouterConfig {
  public static routerAlias = {
    stf_adm: RouterRoleNames.adm,
  };
  public static routes = {
    default: [
        {
          path: RouterPath.error,
          name: RouterName.error,
          component: RouterComponent.error,
          meta: { showToolbar: false, showDrawer: false, showAddItem: false, showInMenu: false }
        },
        {
          path: RouterPath.login,
          name: RouterName.login,
          component: RouterComponent.login,
          meta: { showToolbar: false, showDrawer: false, showAddItem: false, showInMenu: false }
        },
    ],
    guest: [
        {
            path: RouterPath.layout, name: RouterName.layout, component: RouterComponent.layout, meta: { pageName: "routes.index" },
            children: [
                { path: RouterPath.dashboard, name: RouterName.dashboard, component: RouterComponent.dashboard, meta: { pageName: "routes.dashboard", icon: "chart-bar", showAddItem: true, showInMenu: true } },
            ]
        }
    ],
    adm: [
        {
            path: RouterPath.layout, name: RouterName.layout, component: RouterComponent.layout, meta: { pageName: "routes.index" },
            children: [
              { path: RouterPath.dashboard, name: RouterName.dashboard, component: RouterComponent.dashboard, meta: { pageName: "routes.dashboard", icon: "chart-bar", showAddItem: true, showInMenu: true } },
          ]
        }
    ],
  };
}
export class ReferenceConfig {
    public static referenceList = {
        ref_lang: [],
        ref_group: [],
        ref_pm_role: [],
        ref_role: [],
        ref_tz: [],
        ref_us_county: [],
        ref_state: [],
        ref_property_type: [],
        ref_client_status: [],
        ref_order_type: [],
        ref_order_status: [],
        ref_db_err: [],
        ref_charged_from: []
      }
}