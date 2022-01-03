import { APP_DISPATCH } from "./app";

// import { getItems } from "@/api/client";
export default {
    namespaced: true,
    actions: {
      CREATE_CLIENT: async (store: any, data: any) => {
        store.dispatch(APP_DISPATCH.SET_LOADING, {name: "client.ts/CREATE_CLIENT", value: true, opacity: 0.5} , { root: true });
        // const items = await getItems(data);
        // store.dispatch("create", { entity: "client",  data: items });
        store.dispatch(APP_DISPATCH.SET_LOADING, {name: "client.ts/CREATE_CLIENT", value: false} , { root: true });
      }
    }
};
