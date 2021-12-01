import { RouteRecordRaw } from "vue-router";

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
            views: [
                {
                    path: "/", alias: "/", component: loadComp("layout/Layout"), meta: { pageName: "routes.index" },
                    children: [
                        // tslint:disable-next-line:max-line-length
                        { path: "/adm/dashboard", name: "dashboard", component: loadComp("dashboard/DashboardAdm.vue"), meta: { pageName: "routes.dashboard", icon: "chart-bar", showAddItem: true, showInMenu: true } } as RouteRecordRaw,
                    ]
                } as RouteRecordRaw
            ],
            adm: [
                {
                    path: "/adm", alias: "/", component: loadComp("layout/LayoutAdm"),
                    children: [
                    ]
                } as RouteRecordRaw
            ],
        }
    },
    getters: {
        getRoutes: (state: any) => (RoleCode: string): RouteRecordRaw => state.routes[
            (state.routerAlias[RoleCode] ? state.routerAlias[RoleCode] : "views")
        ],
        getPath: (state: any) => (RoleCode: string) => state.routerAlias[RoleCode],
        getFirstRoute: (state: any) => (RoleCode: string) => state.routes[state.routerAlias[RoleCode]][0].children[0].path,
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
