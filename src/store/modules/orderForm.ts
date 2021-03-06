import { Data } from "@/enums/enum_other";

/* 
private const
*/
const ORDER_FORM_STORE_NAME = "orderForm"; 
const GETTERS = {
  CHANGES: "CHANGES",
  IS_CHANGED: "IS_CHANGED",
  FTS: "FTS",
  ITEMS: "ITEMS",
  ORIGINS: "ORIGINS",
  TYPE: "TYPE",
  IS_LOADING: "IS_LOADING",
  IS_SAVING: "IS_SAVING",
  IS_VISIBLE: "IS_VISIBLE"
};
const MUTATIONS = {
  ADD: "ADD",
  MODIFY: "MODIFY",
  REMOVE: "REMOVE",
  RESET_CHANGES: "RESET_CHANGES",
  RESET_FTS: "RESET_FTS",
};
const ACTIONS = {
  LOAD: "LOAD",
  SAVE: "SAVE",
  CLOSE: "CLOSE",
  UPDATE: "UPDATE",
  COPY: "COPY",
};
/* 
public const
*/
export interface RuleForm {
  priority_lvl: number,
  touch_up: boolean,
  next_arrival_dt: Date | null,
  owner_arrival: boolean | null,
  order_status_id: number | null,
  order_type_id: number | null,
  charged_from_id: number | null,
  scheduled_dt: Date | null,
  due_date: Date | null,
  third_company: boolean,
  worker_id: number | null,
  third_company_id: number | null,
  property_id: number | null,
  entry_code: string,
  canceled: boolean,
  completed: boolean,
  done_dt: Date | null,
  manager: string | null,
  change_comment: string | null,
  user_id: number | null,
  client_id: number | null,
  order_status_comment: string | null,
  title: string | null,
  checks: boolean | null,
  plan_min: string | null,
  total_sum: string | null,
}

export const ORDER_FORM_DISPATCH = {
  CLOSE: `${ORDER_FORM_STORE_NAME}/${ACTIONS.CLOSE}`,
  LOAD: `${ORDER_FORM_STORE_NAME}/${ACTIONS.LOAD}`,
  SAVE: `${ORDER_FORM_STORE_NAME}/${ACTIONS.SAVE}`,
  UPDATE: `${ORDER_FORM_STORE_NAME}/${ACTIONS.UPDATE}`,
  COPY: `${ORDER_FORM_STORE_NAME}/${ACTIONS.COPY}`
}
export const ORDER_FORM_COMMIT = {
  MODIFY: `${ORDER_FORM_STORE_NAME}/${MUTATIONS.MODIFY}`,
  ADD: `${ORDER_FORM_STORE_NAME}/${MUTATIONS.ADD}`,
  REMOVE: `${ORDER_FORM_STORE_NAME}/${MUTATIONS.REMOVE}`,
  RESET_CHANGES: `${ORDER_FORM_STORE_NAME}/${MUTATIONS.RESET_CHANGES}`,
  RESET_FTS: `${ORDER_FORM_STORE_NAME}/${MUTATIONS.RESET_FTS}`
}
export const ORDER_FORM_GETTERS = {
  IS_CHANGED: `${ORDER_FORM_STORE_NAME}/${GETTERS.IS_CHANGED}`,
  FTS: `${ORDER_FORM_STORE_NAME}/${GETTERS.FTS}`,
  ITEMS: `${ORDER_FORM_STORE_NAME}/${GETTERS.ITEMS}`,
  ORIGINS: `${ORDER_FORM_STORE_NAME}/${GETTERS.ORIGINS}`,
  TYPE: `${ORDER_FORM_STORE_NAME}/${GETTERS.TYPE}`,
  IS_LOADING: `${ORDER_FORM_STORE_NAME}/${GETTERS.IS_LOADING}`,
  IS_SAVING: `${ORDER_FORM_STORE_NAME}/${GETTERS.IS_SAVING}`,
  IS_VISIBLE: `${ORDER_FORM_STORE_NAME}/${GETTERS.IS_VISIBLE}`
}
/*
 * Private mutations
 */
const SET_TYPE = "P__SET_TYPE";
const SET_ID = "P__SET_ID";
const SET_FTS = "P__SET_FTS";
const SET_LOADING = "P__SET_LOADING";
const SET_ORIGIN = "P__SET_ORIGIN";
const SET_SAVING = "P__SET_SAVING";
const SET_VISIBLE = "P__SET_VISIBLE";
export default {
  namespaced: true,
  state: {
    name: "order",
    primary_key: "id",
    fts: null, // ???????? fts
    id: null,
    type: null,
    changes: {},
    createdItemsCounter: 1,
    isVisible: false,
    isLoading: false,
    isSaving: false,
    origin: null,
    originVersion: null,
    fields: () => <RuleForm>{
      user_id: null,
      client_id: null,
      property_id: null,
      order_type_id: 2,
      order_status_id: null,
      order_status_comment: null,
      due_date: null,
      scheduled_dt: null,
      next_arrival_dt: null,
      done_dt: null,
      canceled: false, // ?????????????????? ??????????????
      completed: false, // ?????????????????? ??????????????
      owner_arrival: null,
      worker_id: null,
      title: null,
      priority_lvl: 2,
      charged_from_id: null,
      checks: null,
      plan_min: null,
      third_company: false,
      third_company_id: null,
      touch_up: false,
      total_sum: null,
      entry_code: '',
      manager: null,
      change_comment: null
    }
  },
  getters: {
    [GETTERS.TYPE](state: any) {
      return state.type;
    },
    [GETTERS.IS_LOADING](state: any) {
      return state.isLoading;
    },
    [GETTERS.IS_SAVING](state: any) {
      return state.isSaving;
    },
    [GETTERS.IS_VISIBLE](state: any) {
      return state.isVisible;
    },
    [GETTERS.FTS](state: any) {
      return state.fts;
    },
    [GETTERS.ORIGINS](state: any) {
      return state.origin;
    },
    [GETTERS.IS_CHANGED](state: any) {
      return Object.keys(state.changes).length > 0;
    },
    [GETTERS.ITEMS](state: any) {
      const result = Object.assign({}, getData(state.origin), getData(state.changes));
      const obj = Object.entries(result)
        .filter(([, value]) => value !== undefined)
        .reduce((acc: any, [name, value]) => {
          acc[name] = value;
          return acc;
        }, {});
      return obj;
    },
    [GETTERS.CHANGES](state: any) {
      return JSON.stringify(state.changes);
    }
  },
  mutations: {
    [MUTATIONS.ADD](state: any, text: any) {
      const localId = `new:${state.createdItemsCounter++}`;
      state.changes[localId] = { text, checked: false };
    },
    [MUTATIONS.MODIFY](state: any, { name, data }: any) {
      if (state.origin === null) { return; }
      const origin = state.origin[name];
      let change = state.changes[name];
      if (origin === undefined && change === undefined) {
        return;
      }
      if (change === undefined) {
        state.changes[name] = getData(data);
        return;
      }
      if (typeof data === "object" && data !== null) {
        change = getData(data);
      } else {
        change = data;
      }
      const isItemsEqual = (t1: any, t2: any) => {
        if (t1 === undefined && t2 === undefined) {
          return true;
        }
        if (t1 === undefined || t2 === undefined) {
          return false;
        }
        if (t1 !== t2) {
          return false;
        }
        return true;
      };
      if (isItemsEqual(origin, change)) {
        delete state.changes[name];
      } else {
        state.changes[name] = change;
      }
    },
    [MUTATIONS.REMOVE](state: any, name: string) {
      if (state.origin[name] !== undefined) {
        state.changes[name] = undefined;
        return;
      }
      delete state.changes[name];
    },
    [MUTATIONS.RESET_CHANGES](state: any) {
      state.changes = {};
      state.fts = new Date().getTime().toString();
    },
    [MUTATIONS.RESET_FTS](state: any) {
      state.fts = new Date().getTime().toString();
    },
    // private
    [SET_FTS](state: any, value: number) {
      state.fts = value;
    },
    [SET_ID](state: any, value: number) {
      state.id = value;
    },
    [SET_TYPE](state: any, value: string) {
      state.type = value;
    },
    [SET_VISIBLE](state: any, value: boolean) {
      state.isVisible = value;
    },
    [SET_LOADING](state: any, value: boolean) {
      state.isLoading = value;
    },
    [SET_ORIGIN](state: any, items: any) {
      state.changes = {};
      state.origin = items;
    },
    [SET_SAVING](state: any, value: boolean) {
      state.isSaving = value;
    }
  },
  actions: {
    [ACTIONS.CLOSE]({ state, getters, commit }: any) {
      commit(SET_VISIBLE, false);
      commit(SET_ORIGIN, null);
      commit(SET_ID, null);
      commit(SET_FTS, null);
      commit(SET_TYPE, null);
    },
    async [ACTIONS.COPY]({ state, getters, commit, rootGetters }: any, data: any) {
      if (state.isLoading || state.origin !== null) {
        return;
      }
      if (state.isVisible === false) {
        commit(SET_VISIBLE, true);
      }
      commit(SET_LOADING, true);
      const arrs = getData(state.fields);
      commit(SET_ID, null);
      commit(SET_TYPE, "add");
      const items = (data[state.primary_key] !== undefined) ?
        rootGetters["entities/" + state.name + "/find"](data[state.primary_key]) :
        data;
      if (items !== null) {
        for (const v in state.fields) {
          if (state.fields[v] !== undefined) {
            arrs[v] = state.fields[v];
            if (items[v] !== undefined) {
              arrs[v] = items[v];
            }
          }
        }
      }
      commit(SET_ORIGIN, arrs);
      commit(SET_FTS, new Date().getTime().toString());
      commit(SET_LOADING, false);
    },
    async [ACTIONS.LOAD]({ state, getters, commit, rootGetters }: any, data: any) {
      if (state.isLoading || state.origin !== null) {
        return;
      }
      if (state.isVisible === false) {
        commit(SET_VISIBLE, true);
      }
      commit(SET_LOADING, true);
      const arrs = getData(state.fields);
      if (data !== undefined && data[state.primary_key] !== undefined) {
        commit(SET_ID, data[state.primary_key]);
        commit(SET_TYPE, "edit");
        const items = rootGetters["entities/" + state.name + "/find"](data[state.primary_key]);
        if (items !== null) {
          for (const v in state.fields) {
            if (state.fields[v] !== undefined) {
              arrs[v] = state.fields[v];
              if (items[v] !== undefined) {
                arrs[v] = items[v];
              }
            }
          }
        }
      } else {
        commit(SET_ID, null);
        commit(SET_TYPE, "add");
      }
      commit(SET_ORIGIN, arrs);
      // ???????????????????? timestamp ?????????? (?????????????????????? ????????????, ???? ??????????????!)
      commit(SET_FTS, new Date().getTime().toString());
      commit(SET_LOADING, false);
    },
    // eslint-disable-next-line no-unused-vars
    async [ACTIONS.UPDATE]({ dispatch, state, getters, commit }: any, data: any) {
      if (state.isSaving) { return; }
      commit(SET_SAVING, true);
      await dispatch(
        "entities/update",
        { entity: state.name, where: data[state.primary_key], data: data.data },
        { root: true }
      );
      commit(SET_SAVING, false);
    },
    async [ACTIONS.SAVE]({ dispatch, state, getters, commit }: any, data: Data | null = null ) {
      // ?? data ???????????????????? ???????? ????????????, ???????? id, ???????? ????????????
      // ?? ???????????? ???????????????? ????????????, ?? ?????? ?????????????????? ???????????? ?????????????? ???????????????????? ?????????? ?? ?????????????????????? ??????????????,
      // ?????? ???????? ???????????? ?????????????? ?????????????????? ???????????? ?????????? (??.??. ???????????? ?????????????????????? ?????????????? ?????????? ?????????? ??????????????????)
      if (state.isSaving || !getters[GETTERS.IS_CHANGED]) {
        return;
      }
      commit(SET_SAVING, true);
      let result = {};
      if (data === null) {
        result = getData(getters[GETTERS.ITEMS]);
      } else if (typeof data !== "object") {
        result = Object.assign(getData(getters[GETTERS.ITEMS]), { [state.primary_key]: getData(data) });
      } else {
        const obj: any = {};
        for (const i in data) {
          if (typeof data[i] === "object") {
            obj[i] = getData(data[i]);
          } else {
            obj[i] = data[i];
          }
        }
        result = Object.assign(getData(getters[GETTERS.ITEMS]), obj);
      }
      if (state.id !== null) {
        await dispatch("entities/update", { entity: state.name, where: state.id, data: result }, { root: true });
      } else {
        await dispatch("entities/insert", { entity: state.name, data: result }, { root: true });
      }
      commit(SET_SAVING, false);
    }
  }
};
export function getData(data: any) {
  if (typeof data === "object" && data !== null) { // typeof null == "object" - ?????????????????????? ???????????? ?? ??????????
    if (Array.isArray(data)) {
      const arr: any = [];
      for (const i in data) {
        if (typeof data[i] === "object") {
          arr.push(getData(data[i]));
        } else {
          arr.push(data[i]);
        }
      }
      return arr;
    } else {
      const obj: any = {};
      for (const i in data) {
        if (typeof data[i] === "object") {
          obj[i] = getData(data[i]);
        } else {
          obj[i] = data[i];
        }
      }
      return obj;
    }
  } else {
    return data;
  }
}
