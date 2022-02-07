import Vue from "vue";
import ExcelApi from "../api/excel";
const api = new ExcelApi();
// Public
const GETTERS = {
    GET_EXCEL_DATA: "GET_EXCEL_DATA"
};
const ACTIONS = {
    SET_EXCEL_DATA: "SET_EXCEL_DATA"
};
const EXCEL_STORE_NAME = "excel"; 

export const EXCEL_GETTERS = {
    GET_EXCEL_DATA: `${EXCEL_STORE_NAME}/${GETTERS.GET_EXCEL_DATA}`,
}
export const EXCEL_DISPATCH = {
    SET_EXCEL_DATA: `${EXCEL_STORE_NAME}/${ACTIONS.SET_EXCEL_DATA}`,
}
/*
 * Private mutations
 */
const SET_EXCEL_DATA = "P__SET_EXCEL_DATA";

export default {
    namespaced: true,
    state: {
        created: false,
        data: {},
        key: "",
        group: "",
        settings: false,
        typeResponse: "withConcatenatedArrays"
    },
    mutations: {
        [SET_EXCEL_DATA]: (state: any, data: any) => {
            if (data.name === "data") {
                if (data.params !== undefined) {
                    state["key"] = data.params.key;
                    state["group"] = data.params.group;
                    if (data.params.settings !== undefined) {
                        state["settings"] = data.params.settings;
                    }
                    if (data.params.created !== undefined) {
                        state["created"] = data.params.created;
                    }
                    if (data.params.typeResponse !== undefined) {
                        state["typeResponse"] = data.params.typeResponse;
                    }
                }
                state["data"] = data.data;
            } else {
                state[data.name] = data.data;
            }
        }
    },
    actions: {
        [ACTIONS.SET_EXCEL_DATA]({ commit }: any, data: any) {
            commit(SET_EXCEL_DATA, data);
        }
    },
    getters: {
        [GETTERS.GET_EXCEL_DATA]: (state: any,) => state
    }
};
