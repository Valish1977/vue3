import { ROUTES_GETTERS } from "@/store/modules/routes";
import Vue from "vue";
import Filter from "../api/filters";

const FILTER_STORE_NAME = "filters"; 
const GETTERS = {
    STR_QUERY: "STR_QUERY", // возвращает строку фильтра для формирования запроса
    // возвращает строку фильтра для формирования запроса для вставки в блок and || or
    STR_QUERY_INSERT: "STR_QUERY_INSERT",
    // возвращает строку фильтра для отображения в компоненте (для показа пользователю в читабельном виде)
    ARR_VIEW: "ARR_VIEW",
    REFERENCE: "REFERENCE"
};
const ACTIONS = {
    SET_MODEL: "SET_MODEL",
    SET_CONDITIONS: "SET_CONDITIONS",
    SET_TEMPLATE: "SET_TEMPLATE",
    DEL_TEMPLATE: "DEL_TEMPLATE",
    SELECT_TEMPLATE: "SELECT_TEMPLATE",
    SET_REQUEST_FILTER: "SET_REQUEST_FILTER",
    SET_USE_FILTER: "SET_USE_FILTER",
    SET_QUICK_SEARCH: "SET_QUICK_SEARCH", // ставим отметку что прошли изменения в быстром поиске
    SET_REFERENCE: "SET_REFERENCE",
    SET_ITEMS: "SET_ITEMS"
};
export const FILTER_GETTERS = {
    REFERENCE: `${FILTER_STORE_NAME}/${GETTERS.REFERENCE}`
}
export const FILTER_DISPATCH = {
    SET_REFERENCE: `${FILTER_STORE_NAME}/${ACTIONS.SET_REFERENCE}`
}

export enum FILTER_REFERENCE {
    REF_VERSIONS = "ref_version",
    COUNTRY = "ref_country",
    STATE = "ref_state",
    LANG = "ref_lang",
    BEDROOM = "ref_bedroom",
    GUEST = "ref_guest",
    SORT_BY = "ref_sortBy",
    ADVANCED_ITEMS = "ref_advancedItems"
}

/*
 * Private mutations
 */
const SET_REQUEST_FILTER = "P__SET_REQUEST_FILTER";
const SET_MODEL = "P__SET_MODEL";
const SET_FILTERS = "P__SET_FILTERS";
const SET_PREFS = "P__SET_PREFS";
const SET_CONDITIONS = "P__SET_CONDITIONS";
const SET_TEMPLATE = "P__SET_TEMPLATE";
const DEL_TEMPLATE = "P__DEL_TEMPLATE";
const SET_PAGE_NAME = "P__SET_PAGE_NAME";
const SET_LOADING = "P__SET_LOADING";
const SET_USE_FILTER = "P__SET_USE_FILTER";
const SET_QUICK_SEARCH = "P__SET_QUICK_SEARCH";
const SET_REFERENCE = "P__SET_REFERENCE";
const SET_ITEMS = "P__SET_ITEMS";
export default {
    namespaced: true,
    state: {
        model: {},
        prefs: {},
        conditions: [],
        filters: [], // список сохраненных фильтров
        pageName: "",
        isLoading: false,
        requestFilter: [],
        useFilter: [],
        quickSearch: false, // переключается между true - false для отслеживания изменения в быстром поиске
        references: {
            [FILTER_REFERENCE.LANG]: [],
            [FILTER_REFERENCE.STATE]: [],
            [FILTER_REFERENCE.COUNTRY]: [],
            [FILTER_REFERENCE.BEDROOM]: [
                "All Bedrooms",
                "Studio",
                "1 Bedroom",
                "2 Bedrooms",
                "3 Bedrooms"
            ],
            [FILTER_REFERENCE.GUEST]: [
                "All Guests",
                "1 Guest",
                "2 Guests",
                "3 Guests",
                "4 Guests",
                "5 Guests",
                "6 Guests",
                "7 Guests",
                "8 Guests"
            ],
            [FILTER_REFERENCE.SORT_BY]: [
                "property",
                "low to high",
                "high to low"
            ],
            [FILTER_REFERENCE.ADVANCED_ITEMS]: [
                {name: "In Condo Washer/Dryer", lrId: 1869}
            ]
        }
    },
    getters: {
        [GETTERS.STR_QUERY](state: any) {
            return parseState(state);
        },
        [GETTERS.REFERENCE]: (state: any) => (name: string) => state.references[name]?? [],
        [GETTERS.STR_QUERY_INSERT](state: any, getters: any, rootState: any, rootGetters: any) {
            return parseState(state, "insert");
        },
        [GETTERS.ARR_VIEW]: (state: any, getters: any, rootState: any) => {
            const result: any[] = [];
            let reference: any[] = [];
            let value = "";
            let label = "name";
            for (const v of state.useFilter) {
                label = "name";
                if (state.model[v.filter].params.label !== undefined) {
                    label = state.model[v.filter].params.label;
                }
                // в случае если справочник формируется пользовательской функцией
                // искать его в store до хука mounted компонента CompFilter бесполезно
                if (state.references[state.model[v.filter].params.reference] === undefined
                    && state.model[v.filter].params.reference !== undefined
                ) {
                    reference = [];
                    if (Array.isArray(state.model[v.filter].params.reference)) {
                        reference = state.model[v.filter].params.reference;
                    } else {
                        reference = state.references[state.model[v.filter].params.reference];
                    }
                    if (reference !== undefined) {
                        for (const n of reference) {
                            if (state.model[v.filter].component === "CompBool") {
                                const val: number = (v.value) ? 1 : 2;
                                if (typeСast(val) === typeСast(n.id)) {
                                    value = n[label];
                                    break;
                                }
                            } else {
                                if (state.model[v.filter].params.key !== undefined
                                    && n[state.model[v.filter].params.key] !== undefined
                                ) {
                                    if (typeСast(v.value) === typeСast(n[state.model[v.filter].params.key])) {
                                        value = n[label];
                                        break;
                                    }
                                } else {
                                    if (typeСast(v.value) === typeСast(n.id)) {
                                        value = n[label];
                                        break;
                                    }
                                }
                            }
                        }
                    } else {
                        // в случае если справочник прогружается позже (при асинхронном запросе)
                        // пытаемся значение получить из name при отправке
                        if ( v.name !== undefined ) {
                            value = v.name;
                        }
                    }
                } else {
                    if (v.name !== undefined) {
                        value = v.name;
                    } else {
                        if (state.model[v.filter].params.reference !== undefined) {
                            reference = [];
                            if (Array.isArray(state.model[v.filter].params.reference)) {
                                reference = state.model[v.filter].params.reference;
                            } else {
                                reference = state.references[state.model[v.filter].params.reference];
                            }
                            let key = "id";
                            if (state.model[v.filter].params.key !== undefined) {
                                key = state.model[v.filter].params.key;
                            }
                            const item = reference.find((t: any) => typeСast(t[key]) === typeСast(v.value));
                            if (item) {
                                value = item[label];
                            } else {
                                console.warn("!!!!!! A non-existent value is requested from the \"" +
                                    state.model[v.filter].params.reference + "\" reference: \"" + v.value + "\"");
                                continue;
                            }
                        } else {
                            value = v.value;
                        }
                    }
                }
                result.push(
                    {
                        operation: "filters.operations." + v.operation,
                        title: state.model[v.filter].params.textView,
                        condition: "filters.conditions." + v.condition,
                        value
                    });
            }
            return result;
        }
    },
    mutations: {
        [SET_REFERENCE](state: any, { name, items }: any) {
            state.references[name] = items;
        },
        [SET_ITEMS](state: any, { name, items }: any) {
            state.references[name] = items;
        },
        [SET_USE_FILTER](state: any, arr: any) {
            state.useFilter = arr;
        },
        [SET_REQUEST_FILTER](state: any, arr: any) {
            state.requestFilter = arr;
        },
        [SET_PAGE_NAME](state: any, name: any) {
            state.pageName = name;
        },
        [SET_MODEL](state: any, model: any) {
            state.model = model;
        },
        [SET_FILTERS](state: any, filters: any) {
            state.filters = filters;
        },
        [SET_PREFS](state: any, prefs: any) {
            state.prefs = prefs;
        },
        [SET_CONDITIONS](state: any, conditions: any) {
            state.conditions = conditions;
        },
        [SET_TEMPLATE](state: any, filterName: any) {
            const conditions: any = [];
            for (const v of state.conditions) {
                conditions.push(Object.assign({}, v));
            }
            if (state.prefs.filters === undefined) {
                state.prefs.filters = {};
            }
            if (state.prefs.filters[state.pageName] === undefined || state.prefs.filters[state.pageName].length === 0) {
                state.prefs.filters[state.pageName] = [];
            }
            state.prefs.filters[state.pageName].push({ name: filterName, code: conditions });
            state.filters = state.prefs.filters[state.pageName];
        },
        [DEL_TEMPLATE](state: any, index: any) {
            state.filters.splice(index, 1);
        },
        [SET_LOADING](state: any, value: any) {
            state.isLoading = value;
        },
        [SET_QUICK_SEARCH](state: any, value: any) {
            state.quickSearch = value;
        }
    },
    actions: {
        [ACTIONS.SET_QUICK_SEARCH]({ state, commit }: any, conditions: any) {
            commit(SET_CONDITIONS, conditions);
            commit(SET_QUICK_SEARCH, !state.quickSearch);
        },
        [ACTIONS.SET_USE_FILTER]({ state, commit }: any) {
            commit(SET_USE_FILTER, state.conditions);
        },
        [ACTIONS.SET_REQUEST_FILTER]({ commit }: any, arr: any) {
            commit(SET_REQUEST_FILTER, arr);
        },
        async [ACTIONS.SET_MODEL]({ state, dispatch, commit, rootState, rootGetters }: any, model: any) {
            if (typeof model !== "object") {
                return false;
            }
            commit(SET_LOADING, true);
            commit(SET_CONDITIONS, []);
            commit(SET_USE_FILTER, []);
            for (const v in model) {
                if (model[v].component !== undefined) {
                    model[v].key = v;
                }
            }
            commit(SET_MODEL, model);
            let prefs: any = localStorage.getItem("prefs");
            if (prefs !== null) {
                prefs = JSON.parse(prefs);
            }
            if (
                prefs === null
                || prefs.prefs_changed === undefined
                || typeСast(rootGetters.getUser.prefs_changed) !== typeСast(prefs.prefs_changed)
            ) {
                prefs = await Filter.getPrefs();
                if (!prefs || prefs === null || prefs === "") {
                    prefs = {};
                }
                localStorage.setItem("prefs", JSON.stringify(
                    { prefs_changed: rootGetters.getUser.prefs_changed, prefs }
                )
                );
            }
            if (prefs.prefs !== undefined) {
                prefs = prefs.prefs;
            }
            commit(SET_PREFS, prefs);
            const name: string = rootGetters[ROUTES_GETTERS.GET_CURRENT_ROUTE].name + "_" + rootGetters.getUser.RoleCode;
            commit(SET_PAGE_NAME, name);
            if (prefs.filters !== undefined && prefs.filters[name] !== undefined) {
                commit(SET_FILTERS, prefs.filters[name]);
            } else {
                commit(SET_FILTERS, []);
            }
            const conditions: any = [];
            let condition: any = {};
            // код выполняется при запросе с другого роута по определенному фильтру
            if (state.requestFilter.length > 0) {
                for (const v in state.requestFilter) {
                    if (state.model[state.requestFilter[v].filter] !== undefined) {
                        if (
                            state.model[state.requestFilter[v].filter].params.reference !== undefined
                            && !Array.isArray(state.model[state.requestFilter[v].filter].params.reference)
                        ) {
                            // формируем референсы
                            // в случае если справочник формируется пользовательской функцией
                            // искать его в store до хука mounted компонента CompFilter бесполезно
                            // tslint:disable-next-line:max-line-length
                            if (state.references[state.model[state.requestFilter[v].filter].params.reference] !== undefined) {
                                dispatch(FILTER_DISPATCH.SET_REFERENCE,
                                    { name: state.model[state.requestFilter[v].filter].params.reference },
                                    { root: true }
                                );
                            }
                        }
                        // далее формируем условия отображаемого фильтра
                        condition = Object.assign({}, state.requestFilter[v]);
                        condition.component = state.model[state.requestFilter[v].filter].component;
                        conditions.push(condition);
                    }
                }
            } else {
                // если нет запроса с другого роута, смотрим есть ли в модели требования на фильтр по умолчанию
                for (const v in state.model) {
                    if (state.model[v].query === undefined) {
                        continue;
                    }
                    if (state.model[v].params.reference !== undefined
                        && !Array.isArray(state.model[v].params.reference)
                    ) {
                        // формируем референсы
                        // в случае если справочник формируется пользовательской функцией
                        // искать его в store до хука mounted компонента CompFilter бесполезно
                        if (state.references[state.model[v].params.reference] !== undefined) {
                            dispatch(FILTER_DISPATCH.SET_REFERENCE,
                                { name: state.model[v].params.reference },
                                { root: true });
                        }
                    }
                    // далее формируем условия отображаемого фильтра
                    if (Array.isArray(state.model[v].query)) {
                        for (const i in state.model[v].query) {
                            if (state.model[v].query[i] !== undefined) {
                                condition = Object.assign({}, state.model[v].query[i]);
                                condition.component = state.model[v].component;
                                condition.filter = v;
                                conditions.push(condition);
                            }
                        }
                    } else {
                        condition = Object.assign({}, state.model[v].query);
                        condition.component = state.model[v].component;
                        condition.filter = v;
                        conditions.push(condition);
                    }
                }
            }

            if (conditions.length > 0) {
                commit(SET_CONDITIONS, conditions);
                commit(SET_REQUEST_FILTER, []);
                commit(SET_USE_FILTER, conditions);
            }
            commit(SET_LOADING, false);
        },
        [ACTIONS.SET_CONDITIONS]({ state, commit }: any, conditions: any) {
            if ( conditions.length > 0 ) {
                for ( const i in conditions ) {
                    if ( conditions[i] !== undefined && conditions[i].component === undefined ) {
                        conditions[i].component = state.model[conditions[i].filter].component;
                    }
                }
            }
            commit(SET_CONDITIONS, conditions);
        },
        async [ACTIONS.SET_TEMPLATE]({ state, commit }: any, filterName: any) {
            if (state.conditions.length === 0) {
                return true;
            }
            commit(SET_LOADING, true);
            commit(SET_TEMPLATE, filterName); // добавляем фильтр
            const prefs: any = getPrefsLocalStorage();
            prefs.prefs.filters = state.prefs.filters;
            const prefsChanged: any = await Filter.updatePrefs(prefs.prefs); // пишем фильтр в базу
            commit(SET_LOADING, false);
            if (prefsChanged) {
                // синхронизируем  prefs_changed в localStorage user и prefs
                updatePrefsChangeLocalStorage(prefsChanged, prefs);
            }
            return true;
        },
        async [ACTIONS.DEL_TEMPLATE]({ state, commit }: any, index: any) {
            commit(SET_LOADING, true);
            commit(DEL_TEMPLATE, index); // добавляем фильтр
            const prefs: any = getPrefsLocalStorage();
            prefs.prefs.filters = state.prefs.filters;
            const prefsChanged = await Filter.updatePrefs(prefs.prefs); // пишем фильтр в базу
            commit(SET_LOADING, false);
            if (prefsChanged) {
                // синхронизируем  prefs_changed в localStorage user и prefs
                updatePrefsChangeLocalStorage(prefsChanged, prefs);
            }
            return true;
        },
        [ACTIONS.SELECT_TEMPLATE]({ state, commit }: any, index: any) {
            commit(SET_CONDITIONS, state.filters[index].code);
        },
        [ACTIONS.SET_REFERENCE]({ state, dispatch, commit, rootState, rootGetters }: any, data: any) {
            let items: any[] = [];
            let lang = "ru";
            let name = "";
            if (typeof data === "object" && Array.isArray(data.items)) {
                name = data.name;
                if ( rootState.filters.model[name].remoteFn !== undefined ) {
                    let key = "id";
                    if ( rootState.filters.model[name].params.key !== undefined ) {
                        key = rootState.filters.model[name].params.key;
                    }
                    if ( rootState.filters.conditions.length > 0 ) {
                        for ( const v of rootState.filters.conditions ) {
                            if (typeСast(v.filter) === typeСast(name)) {
                                if ( state.references[name] !== undefined && state.references[name].length > 0 ) {
                                    if ( data.items.length > 0 ) {
                                        const item: any = data.items.find(
                                            (t: any) => typeСast(t[key]) === typeСast(v.value)
                                        );
                                        if ( item === undefined ) {
                                            for (const r of rootState.filters.useFilter) {
                                                if (r.filter === name) {
                                                    const itemOld: any = state.references[name].find(
                                                        (t: any) => typeСast(t[key]) === typeСast(r.value)
                                                    );
                                                    data.items.push(itemOld);
                                                }
                                            }
                                        }
                                    } else {
                                        for (const r of rootState.filters.useFilter) {
                                            if (r.filter === name) {
                                                const itemOld: any = state.references[name].find(
                                                    (t: any) => typeСast(t[key]) === typeСast(r.value)
                                                );
                                                data.items.push(itemOld);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (state.references[name] !== undefined && state.references[name].length > 0) {
                    // проверка на соответствие масиивов
                    let isEquals = true;
                    if (data.items.length !== state.references[name].length) {
                        isEquals = false;
                    }
                    if ( isEquals ) { // проходим по массиву в поисках различий
                        if ( data.items.length > 0 ) {
                            const prop = Object.keys(data.items[0]);
                            top:
                            for ( const i in data.items ) {
                                if ( data.items !== undefined ) {
                                    for ( const t of prop ) {
                                        if ( typeСast(data.items[i][t]) !== typeСast(state.references[name][i][t]) ) {
                                            isEquals = false;
                                            break top;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if ( !isEquals ) {
                        items = data.items;
                    } else {
                        items = state.references[name];
                    }
                } else {
                    items = data.items;
                }
            } else {
                name = data.name;
                // если запрашивается несуществующий референс, генерируем его и возвращаем пустой массив
                if ( state.references[name] !== undefined ) {
                    if ( state.references[name].length > 0 ) {
                        return;
                    }
                    const m: any = localStorage.getItem(name);
                    if (m) {
                        const ref = JSON.parse(m);
                        if (data.lvl !== undefined) {
                            for ( const n of ref ) {
                                if (typeСast(data.lvl) === typeСast(n.lvl)) {
                                    items.push( n );
                                }
                            }
                        } else {
                            items = ref;
                        }
                    }
                } else {
                    items = [];
                }
            }
            // определяем локаль
            lang = rootGetters.language;
            if ( items.length > 0 ) {
                for (const key in items) {
                    if (items[key].tr !== undefined && items[key].tr !== "") {
                        items[key].name = items[key].tr[lang];
                    }
                }
            }
            commit(SET_REFERENCE, { name, items });
        },
        [ACTIONS.SET_ITEMS]({ state, dispatch, commit, rootState, rootGetters }: any, data: any) {
            const arr: any = [];
            for (const v of state.references[data.name]) {
                arr.push(v);
            }
            for (const v of data.items) {
                arr.push(v);
            }
            commit(SET_ITEMS, {name: data.name, items: arr});
        }
    }
};
function getPrefsLocalStorage() {
    let prefs = localStorage.getItem("prefs");
    if (prefs !== null) {
        prefs = JSON.parse(prefs);
    }
    return prefs;
}
function updatePrefsChangeLocalStorage(prefsChanged: any, prefs: any) {
    let user: any = localStorage.getItem("user");
    if (user !== null) {
        user = JSON.parse(user);
    }
    prefs.prefs_changed = prefsChanged;
    user.prefs_changed = prefsChanged;
    localStorage.setItem("prefs", JSON.stringify(prefs));
    localStorage.setItem("user", JSON.stringify(user));
}
function typeСast(v: any) {
  if (typeof v === "string") {
    if (!!(parseFloat(v) % 1) && v.toString() === parseFloat(v).toString()) {
      return parseFloat(v);
    }
    if (!(parseFloat(v) % 1) && v.toString() === parseInt(v, 10).toString()) {
      return parseInt(v, 10);
    }
  }
  return v;
}
function parseState(state: any, type = ""): string {
    let filterToCond = "=";
    let InsertBlock = "=";
    let andCond = "&";
    if (type === "insert") {
        filterToCond = ".";
        InsertBlock = "";
        andCond = ",";
    }
    if (state.useFilter.length === 0) {
        return "";
    }
    let result = "";
    let condition = "";
    let value = "";
    if (state.useFilter.length === 1) {
        condition = state.useFilter[0].condition;
        value = transformFn(state, state.useFilter[0]);
        if (state.useFilter[0].condition === "ilike") {
            condition = "ilike";
            value = "*" + transformFn(state, state.useFilter[0]) + "*";
        }
        if (state.useFilter[0].condition === "*ilike") {
            condition = "ilike";
            value = "*" + transformFn(state, state.useFilter[0]);
        }
        if (state.useFilter[0].condition === "ilike*") {
            condition = "ilike";
            value = transformFn(state, state.useFilter[0]) + "*";
        }
        if (state.useFilter[0].condition === "cs") {
            value = "{" + transformFn(state, state.useFilter[0]) + "}";
        }
        return state.useFilter[0].filter + filterToCond + condition + "." + value;
    }
    const and: any = [];
    const or: any = [];
    for (let i = 0; i < state.useFilter.length; i++) {
        if (i === 0 && state.useFilter[i + 1].operation === "and") {
            and.push(state.useFilter[i]);
            continue;
        }
        if (i === 0 && state.useFilter[i + 1].operation === "or") {
            or.push([]);
            or[or.length - 1].push(state.useFilter[i]);
            continue;
        }
        if (state.useFilter[i + 1] === undefined) {
            if (state.useFilter[i].operation === "and" && state.useFilter[i - 1].operation === "and") {
                and.push(state.useFilter[i]);
                continue;
            }
            if (state.useFilter[i].operation === "and" && state.useFilter[i - 1].operation === "or") {
                and.push(state.useFilter[i]);
                continue;
            }
            if (state.useFilter[i].operation === "or" && state.useFilter[i - 1].operation === "and") {
                or[or.length - 1].push(state.useFilter[i]);
                continue;
            }
            if (state.useFilter[i].operation === "or" && state.useFilter[i - 1].operation === "or") {
                or[or.length - 1].push(state.useFilter[i]);
                continue;
            }
        }
        if (state.useFilter[i].operation === "and" && state.useFilter[i + 1].operation === "and") {
            and.push(state.useFilter[i]);
            continue;
        }
        if (state.useFilter[i].operation === "and" && state.useFilter[i + 1].operation === "or") {
            or.push([]);
            or[or.length - 1].push(state.useFilter[i]);
            continue;
        }
        if (state.useFilter[i].operation === "or" && state.useFilter[i + 1].operation === "and") {
            or[or.length - 1].push(state.useFilter[i]);
            continue;
        }
        if (state.useFilter[i].operation === "or" && state.useFilter[i + 1].operation === "or") {
            or[or.length - 1].push(state.useFilter[i]);
            continue;
        }
    }
    if (and.length === 0 && or.length === 1) {
        for (const v of or[0]) {
            condition = v.condition;
            value = transformFn(state, v);
            if (v.condition === "ilike") {
                condition = "ilike";
                value = "*" + transformFn(state, v) + "*";
            }
            if (v.condition === "*ilike") {
                condition = "ilike";
                value = "*" + transformFn(state, v);
            }
            if (v.condition === "ilike*") {
                condition = "ilike";
                value = transformFn(state, v) + "*";
            }
            if (v.condition === "cs") {
                value = "{" + transformFn(state, v) + "}";
            }
            if (result !== "") {
                result += ",";
            }
            result += v.filter + "." + condition + "." + value;
        }
        return "or" + InsertBlock + "(" + result + ")";
    }
    if (and.length > 0 && or.length === 0) {
        for (const v of and) {
            condition = v.condition;
            value = transformFn(state, v);
            if (v.condition === "ilike") {
                condition = "ilike";
                value = "*" + transformFn(state, v) + "*";
            }
            if (v.condition === "*ilike") {
                condition = "ilike";
                value = "*" + transformFn(state, v);
            }
            if (v.condition === "ilike*") {
                condition = "ilike";
                value = transformFn(state, v) + "*";
            }
            if (v.condition === "cs") {
                value = "{" + transformFn(state, v) + "}";
            }
            if (result !== "") {
                result += andCond;
            }
            result += v.filter + filterToCond + condition + "." + value;
        }
        return result;
    }
    for (const v of and) {
        condition = v.condition;
        value = transformFn(state, v);
        if (v.condition === "ilike") {
            condition = "ilike";
            value = "*" + transformFn(state, v) + "*";
        }
        if (v.condition === "*ilike") {
            condition = "ilike";
            value = "*" + transformFn(state, v);
        }
        if (v.condition === "ilike*") {
            condition = "ilike";
            value = transformFn(state, v) + "*";
        }
        if (v.condition === "cs") {
            value = "{" + transformFn(state, v) + "}";
        }
        if (result !== "") {
            result += ",";
        }
        result += v.filter + "." + condition + "." + value;
    }
    let str = "";
    for (const arr of or) {
        str = "";
        for (const v of arr) {
            condition = v.condition;
            value = transformFn(state, v);
            if (v.condition === "ilike") {
                condition = "ilike";
                value = "*" + transformFn(state, v) + "*";
            }
            if (v.condition === "*ilike") {
                condition = "ilike";
                value = "*" + transformFn(state, v);
            }
            if (v.condition === "ilike*") {
                condition = "ilike";
                value = transformFn(state, v) + "*";
            }
            if (v.condition === "cs") {
                value = "{" + transformFn(state, v) + "}";
            }
            if (str !== "") {
                str += ",";
            }
            str += v.filter + "." + condition + "." + value;
        }
        if (result !== "") {
            result += ",";
        }
        result += "or(" + str + ")";
    }
    return "and" + InsertBlock + "(" + result + ")";
}
function transformFn(state: any, field: any): any {
    const nameField = field.filter;
    if (state.model[nameField].transformFn !== undefined) {
        return state.model[nameField].transformFn(field.value);
    }
    return field.value;
}
