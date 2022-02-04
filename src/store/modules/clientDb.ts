import ClientApi from "@/domain/api/client";

import { APP_DISPATCH } from "./app";

const CLIENT_STORE_NAME = "entities/clientDb"; 
const ACTIONS = {
  _CREATE_CLIENT: "CREATE_CLIENT"
};
export const CLIENT_DB_DISPATCH = {
  CREATE_CLIENT: `${CLIENT_STORE_NAME}/${ACTIONS._CREATE_CLIENT}`
}

export const CLIENT_DB_GETTERS = {
  ITEMS: `${CLIENT_STORE_NAME}`,
}

export default {
    namespaced: true,
    actions: {
      CREATE_CLIENT: async (store: any, data: any) => {
        store.dispatch(APP_DISPATCH.SET_LOADING, {name: `client.ts/${ACTIONS._CREATE_CLIENT}`, value: true, opacity: 0.5} , { root: true });
        const items = await ClientApi.getItems(data.filters);
        store.dispatch("create", { entity: ACTIONS._CREATE_CLIENT,  data: items });
        store.dispatch(APP_DISPATCH.SET_LOADING, {name: `client.ts/${ACTIONS._CREATE_CLIENT}`, value: false} , { root: true });
      }
    }
};
