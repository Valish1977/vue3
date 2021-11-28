// import { getItems } from "@/api/client";
export default {
    namespaced: true,
    actions: {
      CREATE_CLIENT: async (store, data) => {
        store.dispatch("app/setLoading", {name: "client.ts/CREATE_CLIENT", value: true, opacity: 0.5} , { root: true });
        // const items = await getItems(data);
        // store.dispatch("create", { entity: "client",  data: items });
        store.dispatch("app/setLoading", {name: "client.ts/CREATE_CLIENT", value: false} , { root: true });
      }
    }
};
