export enum AUTH_DISPATCH {
    UNSET_USER = 'auth/unsetUser',
    SET_USER = 'auth/setUser',
}
export enum AUTH_GETTERS {
    GET_USER = 'auth/getUser',
}
const auth = {
    namespaced: true,
    state: {
        user: {
            auth: false,
            id: 0,
            RoleCode: "",
            auth_token: "",
            prefs_changed: "",
            auth_token_exp: "",
            refresh_token: ""
        },
        prefs: ""
    },
    mutations: {
        SET_USER: (state: any, { item }: any) => {
            state.user = item;
        }
    },
    actions: {
        setUser({ commit }: any, newUser: any) {
            commit("SET_USER", { item: newUser });
        },
        unsetUser({ commit }: any) {
            commit("SET_USER", { item: { auth: false } });
        }
    },
    getters: {
        getUser: (state: any) => state.user
    }
};

export default auth;
