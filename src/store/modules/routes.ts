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
            adm: [
                {
                    path: "/adm", alias: "/", component: loadComp("layout/LayoutAdm"),
                    children: [
                    ]
                }
            ],
        }
    },
    getters: {
        getRoutes: (state: any) => (RoleCode: string) => state.routes[state.routerAlias[RoleCode]],
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
        setCurrentRoute({ commit }, currentRoute: any) {
            commit("SET_CURRENT_ROUTE", currentRoute);
        }
    }
};
export default routes;
