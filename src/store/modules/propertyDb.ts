import PropertyApi from "@/domain/api/property";

import { APP_DISPATCH } from "./app";

const PROPERTY_STORE_NAME = "entities/propertyDb"; 
const ACTIONS = {
  _CREATE_PROPERTY: "CREATE_PROPERTY"
};
export const PROPERTY_DB_DISPATCH = {
  CREATE_PROPERTY: `${PROPERTY_STORE_NAME}/${ACTIONS._CREATE_PROPERTY}`
}

export const PROPERTY_DB_GETTERS = {
  ITEMS: `${PROPERTY_STORE_NAME}`,
}

export default {
    namespaced: true,
    actions: {
      CREATE_PROPERTY: async (store: any, data: any) => {
        store.dispatch(APP_DISPATCH.SET_LOADING, {name: `property.ts/${ACTIONS._CREATE_PROPERTY}`, value: true, opacity: 0.5} , { root: true });
        const items = await PropertyApi.getItems(data.filters);
        store.dispatch("create", { entity: ACTIONS._CREATE_PROPERTY,  data: items });
        store.dispatch(APP_DISPATCH.SET_LOADING, {name: `property.ts/${ACTIONS._CREATE_PROPERTY}`, value: false} , { root: true });
      }
    }
};