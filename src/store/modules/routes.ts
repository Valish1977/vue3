import { RouteRecordRaw } from "vue-router";

export enum ROUTES_DISPATCH {
    SET_CURRENT_ROUTE = 'routes/setCurrentRoute',
}
export enum ROUTES_GETTERS {
    GET_ROUTES = 'routes/getRoutes',
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
    DASHBOARD = "/dashboard",
    DASHBOARD2 = "/dashboardtwo",

  }
  export enum ROUTER_NAME {
    LAYOUT = "layout",
    ERROR = "error404",
    LOGIN = "login",
    DASHBOARD = "dashboard",
    DASHBOARD2 = "dashboardtwo",
  }
  export enum ROUTER_COMPONENT {
    LAYOUT = "layout/Layout.vue",
    ERROR = "error/Error404.vue",
    LOGIN = "login/Login.vue",
    DASHBOARD = "dashboard/Dashboard.vue",
    DASHBOARD2 = "dashboard/Dashboardtwo.vue",
  }
  
export class RouterConfig {
  public static routerAlias = {
    stf_adm: ROUTER_ROLE_NAMES.STF_ADM,
  };
  public static routes = {
    default: [
     {
        path: ROUTER_PATH.ERROR,
        name: ROUTER_NAME.ERROR,
        component: ROUTER_COMPONENT.ERROR,
        meta: { showToolbar: false, showDrawer: false, showAddItem: false, showInMenu: false }
      },
    ],
    guest: [
      {
        path: ROUTER_PATH.LOGIN,
        name: ROUTER_NAME.LOGIN,
        component: ROUTER_COMPONENT.LOGIN,
        meta: { showToolbar: false, showDrawer: false, showAddItem: false, showInMenu: false }
      }
    ],
    adm: [
        {
          path: ROUTER_PATH.LAYOUT, name: ROUTER_NAME.LAYOUT, component: ROUTER_COMPONENT.LAYOUT, meta: { pageName: "routes.dashboard" },
          children: [
            { path: ROUTER_PATH.DASHBOARD, name: ROUTER_NAME.DASHBOARD, component: ROUTER_COMPONENT.DASHBOARD, meta: { pageName: "routes.dashboard", icon: "chart-bar", search: true, breadcrumbs: false, header: true, footer: "large" } },
            { path: ROUTER_PATH.DASHBOARD2, name: ROUTER_NAME.DASHBOARD2, component: ROUTER_COMPONENT.DASHBOARD2, meta: { pageName: "routes.dashboard2", icon: "house-user", search: true, breadcrumbs: false, header: true, footer: "large" } },
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
        getFirstRoute: (state: any) => (RoleCode: string) => 
          state.routes[RoleCode !== "" ? state.routerAlias[RoleCode] : ROUTER_ROLE_NAMES.GUEST ][0].children ? 
          (state.routes[RoleCode !== "" ? state.routerAlias[RoleCode] : ROUTER_ROLE_NAMES.GUEST ][0].children[0].path) :
          (state.routes[RoleCode !== "" ? state.routerAlias[RoleCode] : ROUTER_ROLE_NAMES.GUEST ][0].path),
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