const lang = {
    namespaced: true,
    state: {
        language: "en"
    },
    mutations: {
        SET_LANGUAGE: (state: any, { item }) => {
            state.language = item;
        }
    },
    actions: {
        setLanguage({ commit }, newData: any) { // добавляем автоматически добавляемые фильтры
            commit("SET_LANGUAGE", { item: newData });
        }
    },
    getters: {
        language: (state: any) => state.language
    }
};

export default lang;
