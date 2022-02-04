import UserApi from "@/domain/api/user";

import { APP_DISPATCH } from "./app";

const USER_STORE_NAME = "entities/userDb"; 
const ACTIONS = {
  _CREATE_USER: "CREATE_USER"
};
export const USER_DB_DISPATCH = {
  CREATE_USER: `${USER_STORE_NAME}/${ACTIONS._CREATE_USER}`
}

export const USER_DB_GETTERS = {
  ITEMS: `${USER_STORE_NAME}`,
}

export default {
    namespaced: true,
    actions: {
      CREATE_USER: async (store: any, data: any) => {
        store.dispatch(APP_DISPATCH.SET_LOADING, {name: `user.ts/${ACTIONS._CREATE_USER}`, value: true, opacity: 0.5} , { root: true });
        const _userApi = new UserApi();
        const items = await _userApi.getItems(data.filters);
        store.dispatch("create", { entity: ACTIONS._CREATE_USER,  data: items });
        store.dispatch(APP_DISPATCH.SET_LOADING, {name: `user.ts/${ACTIONS._CREATE_USER}`, value: false} , { root: true });
      }
    }
};
