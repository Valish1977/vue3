
interface Data {
    [key: string]: unknown
  }
const app = {
    namespaced: true,
    state: () => ({
        sidebar: false,
        countLoad: 0,
        opacityLoad: 1,
        windowWidth: 1200,
        bus: {},
        paginationArr: {},
        pagination: {
            total: 0,
            page: 1,
            offset: 0,
            limit: 25,
            pageSize: [25, 50, 100]
        }
    }),
    mutations: {
        SET_DATA: (state: any, { type, items }): void => {
            state[type] = items;
        },
        SET_LOAD: (state: any, data: any): void => {
            if (data.opacity !== undefined) {
                state.opacityLoad = data.opacity;
            }
            if (data.value) {
                state.countLoad++;
            } else {
                if (state.countLoad > 0) {
                    state.countLoad--;
                }
            }
        },
        SET_PAGINATION_DATA: (state: any, data: any): void => {
            if (state.paginationArr[data.paginationName] === undefined) {
                state.paginationArr[data.paginationName] = Object.assign({}, state.pagination);
            }
            if (data.name === "pageSize") {
                state.paginationArr[data.paginationName].limit = data.data[0];
                return;
            }
            if (data.name === "page") {
                state.paginationArr[data.paginationName].offset = (data.data * state.paginationArr[data.paginationName].limit - state.paginationArr[data.paginationName].limit);
            }
            state.paginationArr[data.paginationName][data.name] = data.data;
        },
        RESET_PAGINATION_DATA: (state: any, paginationName: any): void => {
            state.paginationArr[paginationName] = Object.assign({}, state.pagination);
        },
        SET_BUS: (state: any, data: any): void => {
            const name: string = (data.name !== undefined) ? data.name : data;
            let st = false;
            if (state.bus[name] !== undefined) {
                st = !state.bus[name].state;
            }
            const obj: any = {state: st};

            if (data.data !== undefined) {
                obj.data = data.data;
            }
            state.bus[name] = obj;
        }
    },
    actions: {
        setPaginationData({ commit }, data: any) { // данные пагинации
            commit("SET_PAGINATION_DATA", {paginationName: data.paginationName, name: data.name, data: data.data});
        },
        resetPaginationData({ commit }, paginationName: any) { // данные пагинации
            commit("RESET_PAGINATION_DATA", paginationName);
        },
        setWindowWidth({ commit }, newData) { // изменяем значение сайдбара
            commit("SET_DATA", { type: "windowWidth", items: newData });
        },
        setSideBar({ commit }, newData: any) { // изменяем значение сайдбара
            commit("SET_DATA", { type: "sidebar", items: newData });
        },
        setLoading({ commit }, data) {
            commit("SET_LOAD", data);
        },
        setBus({ commit }, data: any) {
            commit("SET_BUS", data);
        }
    },
    getters: {
        getBusState: (state: any) => (name: string) =>
            state.bus[name] !== undefined ? state.bus[name].state : undefined,
        getBus: (state: any) => (name: string) =>
            state.bus[name] !== undefined ? state.bus[name].data : undefined,
        getPaginationData: (state: any) => (name: string) =>
            state.paginationArr[name] !== undefined ? state.paginationArr[name] : state.pagination,
        getSideBar: (state: any) => state.sidebar,
        getLoading: (state: any) => state.countLoad,
        windowWidth: (state: any) => state.windowWidth
    }
};

export default app;
