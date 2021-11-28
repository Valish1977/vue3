const auth = {
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
        SET_USER: (state: any, { item }) => {
            state.user = item;
        }
    },
    actions: {
        setUser({ commit }, newUser: any) {
            commit("SET_USER", { item: newUser });
        },
        unsetUser({ commit }) {
            commit("SET_USER", { item: { auth: false } });
        }
    },
    getters: {
        getUser: (state: any) => state.user
    }
};

export default auth;
