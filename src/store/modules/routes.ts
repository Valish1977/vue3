import { RouteRecordRaw } from "vue-router";

export enum ROUTES_DISPATCH {
    SET_CURRENT_ROUTE = 'routes/setCurrentRoute',
}
export enum ROUTES_GETTERS {
    GET_ROURES = 'routes/getRoutes',
    GET_DEFAULT_ROUTES = "routes/getDefaultRoutes",
    GET_PATH = "routes/getPath",
    GET_FIRST_ROUTE = "routes/getFirstRoute",
    GET_CURRENT_ROUTE = "routes/getCurrentRoute",
}

  export enum ROUTER_ROLE_NAMES {
    STF_ADM = "adm",
    DEFAULT = "default",
    GUEST = "guest"
  }
  export enum ROUTER_PATH {
    BASE_ALISAS = "/",
    LAYOUT = "/",
    ERROR = "/:pathMatch(.*)*",
    LOGIN = "/login",
    INDEX = "/dashboard",

  }
  export enum ROUTER_NAME {
    LAYOUT = "layout",
    ERROR = "error404",
    LOGIN = "login",
    INDEX = "dashboard",
  }
  export enum ROUTER_COMPONENT {
    LAYOUT = "layout/Layout.vue",
    ERROR = "error/Error404.vue",
    LOGIN = "login/Login.vue",
    INDEX = "dashboard/Dashboard.vue",
  }
  
export class RouterConfig {
  public static routerAlias = {
    stf_adm: ROUTER_ROLE_NAMES.STF_ADM,
  };
  public static routes = {
    default: [
        { path: ROUTER_PATH.INDEX, alias: ROUTER_PATH.BASE_ALISAS, name: ROUTER_NAME.INDEX, component: ROUTER_COMPONENT.INDEX, meta: { pageName: "routes.index", search: true, breadcrumbs: false, header: true, footer: "large" } },
        {
          path: ROUTER_PATH.ERROR,
          name: ROUTER_NAME.ERROR,
          component: ROUTER_COMPONENT.ERROR,
          meta: { showToolbar: false, showDrawer: false, showAddItem: false, showInMenu: false }
        },
        {
          path: ROUTER_PATH.LOGIN,
          name: ROUTER_NAME.LOGIN,
          component: ROUTER_COMPONENT.LOGIN,
          meta: { showToolbar: false, showDrawer: false, showAddItem: false, showInMenu: false }
        },
    ],
    guest: [
      {
          path: ROUTER_PATH.LAYOUT, name: ROUTER_NAME.LAYOUT, component: ROUTER_COMPONENT.LAYOUT, meta: { pageName: "routes.index" },
          children: [
            { path: ROUTER_PATH.INDEX, alias: ROUTER_PATH.BASE_ALISAS, name: ROUTER_NAME.INDEX, component: ROUTER_COMPONENT.INDEX, meta: { pageName: "routes.index", search: true, breadcrumbs: false, header: true, footer: "large" } },
          ]
      }
    ],
    adm: [
        {
            path: ROUTER_PATH.LAYOUT, name: ROUTER_NAME.LAYOUT, component: ROUTER_COMPONENT.LAYOUT, meta: { pageName: "routes.index" },
            children: [
              { path: ROUTER_PATH.INDEX, alias: ROUTER_PATH.BASE_ALISAS, name: ROUTER_NAME.INDEX, component: ROUTER_COMPONENT.INDEX, meta: { pageName: "routes.index", search: true, breadcrumbs: false, header: true, footer: "large" } },
            ]
        }
    ],
  };
}

const SET_CURRENT_ROUTE = "P__SET_CURREN_ROUTE";
export default {
    namespaced: true,
    state: {
        currentRoute: {},
        routerAlias: RouterConfig.routerAlias,
        routes: RouterConfig.routes
    },
    getters: {
        getDefaultRoutes: (state: any): RouteRecordRaw => state.routes[ROUTER_ROLE_NAMES.DEFAULT],
        getRoutes: (state: any) => (RoleCode: string): RouteRecordRaw => state.routes[
            (state.routerAlias[RoleCode] ? state.routerAlias[RoleCode] : ROUTER_ROLE_NAMES.GUEST)
        ],
        getPath: (state: any) => (RoleCode: string) => state.routerAlias[RoleCode],
        getFirstRoute: (state: any) => (RoleCode: string) => state.routes[RoleCode !== "" ? state.routerAlias[RoleCode] : ROUTER_ROLE_NAMES.GUEST ][0].children[0].path,
        getCurrentRoute: (state: any) => state.currentRoute
    },
    mutations: {
        [SET_CURRENT_ROUTE]: (state: any, currentRoute: any) => {
            state.currentRoute = currentRoute;
        }
    },
    actions: {
        setCurrentRoute({ commit }: any, currentRoute: any) {
            commit(SET_CURRENT_ROUTE, currentRoute);
        }
    }
};