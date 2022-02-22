import OrderApi from "@/domain/api/order";

import { APP_DISPATCH } from "./app";

const ORDER_STORE_NAME = "entities/orderDb"; 
const ACTIONS = {
  _CREATE_ORDER: "CREATE_ORDER"
};
export const ORDER_DB_DISPATCH = {
  CREATE_ORDER: `${ORDER_STORE_NAME}/${ACTIONS._CREATE_ORDER}`
}

export const ORDER_DB_GETTERS = {
  ITEMS: ORDER_STORE_NAME,
}

export default {
    namespaced: true,
    actions: {
      CREATE_ORDER: async (store: any, data: any) => {
        store.dispatch(APP_DISPATCH.SET_LOADING, {name: `order.ts/${ACTIONS._CREATE_ORDER}`, value: true, opacity: 0.5} , { root: true });
        const items = await OrderApi.getItems(data);
        store.dispatch("create", { entity: ACTIONS._CREATE_ORDER,  data: items });
        store.dispatch(APP_DISPATCH.SET_LOADING, {name: `order.ts/${ACTIONS._CREATE_ORDER}`, value: false} , { root: true });
      }
    }
};
