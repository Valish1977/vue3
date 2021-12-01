import { RouteRecordRaw } from "vue-router";
import Layout from "@/views/layout/Layout.vue";
import Dashboard from "@/views/dashboard/Dashboard.vue";
// tslint:disable:max-line-length
function loadComp(component: string) {
    return () => import(`@/views/${component}`);
}

const routes = {
    state: {
        currentRoute: {},
        routerAlias: {
            stf_adm: "adm",
        },
        routes: {
            guest: [
                {
                    path: "/", alias: "/", name: "Layout", component: Layout, meta: { pageName: "routes.index" },
                    children: [
                        // tslint:disable-next-line:max-line-length
                        { path: "/dashboard", name: "dashboard", component: Dashboard, meta: { pageName: "routes.dashboard", icon: "chart-bar", showAddItem: true, showInMenu: true } } as RouteRecordRaw,
                    ]
                }
            ],
            adm: [
                {
                    path: "/adm", alias: "/", component: loadComp("layout/Layout"),
                    children: [
                    ]
                }
            ],
        }
    },
    getters: {
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
