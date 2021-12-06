export enum BusState {
  notifyBus = "setNotifyBus",
  default = "default",
  guest = "guest"
}
export enum RouterRoleNames {
  client = "client",
  default = "default",
  guest = "guest"
}
export enum RouterPath {
  baseAlias = "/",
  layout = "/",
  error = "/:pathMatch(.*)*",
  login = "/login",
  index = "/index",
  cabinet = "/cabinet",
  dashboard = "/dashboard"
}
export enum RouterName {
  layout = "layout",
  error = "error404",
  login = "login",
  index = "index",
  cabinet = "cabinet",
  dashboard = "dashboard"
}
export enum RouterComponent {
  layout = "layout/Layout.vue",
  error = "error/Error404.vue",
  login = "login/Login.vue",
  index = "index/Index.vue",
  cabinet = "cabinet/Cabinet.vue",
  dashboard = "dashboard/Dashboard.vue"
}

export class RouterConfig {
  public static routerAlias = {
    client: RouterRoleNames.client,
  };
  public static routes = {
    default: [
        { path: RouterPath.index, alias: RouterPath.baseAlias, name: RouterName.index, component: RouterComponent.index, meta: { pageName: "routes.index", search: true, breadcrumbs: false, header: true, footer: "large" } },
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
        }
    ],
    client: [
        {
            path: RouterPath.layout, name: RouterName.layout, component: RouterComponent.layout, meta: { pageName: "routes.index" },
            children: [
              { path: RouterPath.cabinet, name: RouterName.cabinet, component: RouterComponent.cabinet, meta: { pageName: "routes.cabinet", search: false, breadcrumbs: true, header: true, footer: "large" } },
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