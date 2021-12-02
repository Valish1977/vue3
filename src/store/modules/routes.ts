import { RouteRecordRaw } from "vue-router";
import { RouterConfig, RouterRoleNames } from "@/config";

const routes = {
    state: {
        currentRoute: {},
        routerAlias: RouterConfig.routerAlias,
        routes: RouterConfig.routes
    },
    getters: {
        getDefaultRoutes: (state: any): RouteRecordRaw => state.routes[RouterRoleNames.default],
        getRoutes: (state: any) => (RoleCode: string): RouteRecordRaw => state.routes[
            (state.routerAlias[RoleCode] ? state.routerAlias[RoleCode] : RouterRoleNames.guest)
        ],
        getPath: (state: any) => (RoleCode: string) => state.routerAlias[RoleCode],
        getFirstRoute: (state: any) => (RoleCode: string) => state.routes[RoleCode !== "" ? state.routerAlias[RoleCode] : RouterRoleNames.guest ][0].children[0].path,
        getCurrentRoute: (state: any) => state.currentRoute
    },
    mutations: {
        SET_CURRENT_ROUTE: (state: any, currentRoute: any) => {
            state.currentRoute = currentRoute;
        }
    },
    actions: {
        setCurrentRoute({ commit }: any, currentRoute: any) {
            commit("SET_CURRENT_ROUTE", currentRoute);
        }
    }
};
export default routes;
