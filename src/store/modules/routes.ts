import { RouteRecordRaw } from "vue-router";
import Layout from "@/views/layout/Layout.vue";
// tslint:disable:max-line-length

const routes = {
    state: {
        currentRoute: {},
        routerAlias: {
            stf_adm: "adm",
        },
        routes: {
            default: [
                {
                  path: '/:pathMatch(.*)*',
                  name: "error404",
                  component: "Error404.vue",
                  meta: { showToolbar: false, showDrawer: false, showAddItem: false, showInMenu: false }
                },
                {
                  path: "/login",
                  name: "login",
                  component: "Login.vue",
                  meta: { showToolbar: false, showDrawer: false, showAddItem: false, showInMenu: false }
                },
            ],
            guest: [
                {
                    path: "/", name: "layout", component: "layout/Layout.vue", meta: { pageName: "routes.index" },
                    children: [
                        // tslint:disable-next-line:max-line-length
                        { path: "/dashboard", name: "dashboard", component: "dashboard/Dashboard.vue", meta: { pageName: "routes.dashboard", icon: "chart-bar", showAddItem: true, showInMenu: true } },
                    ]
                }
            ],
            adm: [
                {
                    path: "/adm", alias: "/", name: "layout", component: "layout/Layout.vue",
                    children: [
                    ]
                }
            ],
        }
    },
    getters: {
        getDefaultRoutes: (state: any): RouteRecordRaw => state.routes["default"],
        getRoutes: (state: any) => (RoleCode: string): RouteRecordRaw => state.routes[
            (state.routerAlias[RoleCode] ? state.routerAlias[RoleCode] : "guest")
        ],
        getPath: (state: any) => (RoleCode: string) => state.routerAlias[RoleCode],
        getFirstRoute: (state: any) => (RoleCode: string) => state.routes[RoleCode !== "" ? state.routerAlias[RoleCode] : "guest" ][0].children[0].path,
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
