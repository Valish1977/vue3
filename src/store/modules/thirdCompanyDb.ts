import ThirdCompanyApi from "@/domain/api/thirdCompany";

import { APP_DISPATCH } from "./app";

const THIRD_COMPANY_STORE_NAME = "entities/thirdCompanyDb"; 
const ACTIONS = {
  _CREATE_THIRD_COMPANY: "CREATE_THIRD_COMPANY"
};
export const THIRD_COMPANY_DB_DISPATCH = {
  CREATE_THIRD_COMPANY: `${THIRD_COMPANY_STORE_NAME}/${ACTIONS._CREATE_THIRD_COMPANY}`
}

export const THIRD_COMPANY_DB_GETTERS = {
  ITEMS: `${THIRD_COMPANY_STORE_NAME}`,
}

export default {
    namespaced: true,
    actions: {
      CREATE_THIRD_COMPANY: async (store: any, data: any) => {
        store.dispatch(APP_DISPATCH.SET_LOADING, {name: `thirdCompany.ts/${ACTIONS._CREATE_THIRD_COMPANY}`, value: true, opacity: 0.5} , { root: true });
        const items = await ThirdCompanyApi.getItems(data.filters);
        store.dispatch("create", { entity: ACTIONS._CREATE_THIRD_COMPANY,  data: items });
        store.dispatch(APP_DISPATCH.SET_LOADING, {name: `thirdCompany.ts/${ACTIONS._CREATE_THIRD_COMPANY}`, value: false} , { root: true });
      }
    }
};
