import AxiosService from "@/core/axios_service";
import StoreService from "@/store/index";

const PROPERTY_FORM_API = {
  PROPERTY: "api/property",
  LR_RESERVATIONS: "/services/lr/reservations",
  CHANGE_PASS: "api/change_pass",
  CHANGE_LOGIN: "api/change_login",
  CHECK_EMAIL: "api/checkmail"
}
export default class PropertyApi {
public static async getItems(query: any) {
  const items = await AxiosService.Instance.axios.get(PROPERTY_FORM_API.PROPERTY + query.filters, { headers: { Prefer: "count=exact" } }).then(
    (response: any) => {
      if (response.status === 200 || response.status === 206) {
        if (query.pagination !== undefined && query.pagination) {
          const count = response.headers["content-range"].split("/");
          StoreService.Instance.store.dispatch("app/setPaginationData", {
            paginationName: query.paginationName,
            name: "total",
            data: parseInt(count[1], 10)
          });
        }
        return response.data;
      } else {
        return false;
      }
    },
    (err: any) => {
      console.log(err);
    }
  ).catch((error: any) => {
    console.log(error);
    return false;
  });
  return items;
}
public static async getPropertys(query: any) {
  const items = await AxiosService.Instance.axios.get(PROPERTY_FORM_API.PROPERTY + query, { headers: { Prefer: "count=exact" } }).then(
    (response: any) => {
      if (response.status === 200 || response.status === 206) {
        return response.data;
      } else {
        return false;
      }
    },
    (err: any) => {
      console.log(err);
      return false;
    }
  ).catch((error: any) => {
    console.log(error);
    return false;
  });
  return items;
}
public static async getCalendarList(query: string) {
  const items = await AxiosService.Instance.axios.get(`${PROPERTY_FORM_API.LR_RESERVATIONS}${query}`, { headers: { Prefer: "count=exact" } }).then(
    (response: any) => {
      if (response.status === 200) {
        return response.data;
      } else {
        return false;
      }
    },
    (err: any) => {
      console.log(err);
      return false;
    }
  ).catch((error: any) => {
    console.log(error);
    return false;
  });
  return items;
}
public static insertItem() {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    const data = StoreService.Instance.store.getters["propertyForm/ITEMS"];
    const json: any = {};
    for (const v in data) {
      if (
        v === "client" ||
        v === "def_price_float"
      ) {
        continue;
      } else {
        json[v] = data[v];
      }
    }
    json.fts = StoreService.Instance.store.state.propertyForm.fts;
    AxiosService.Instance.axios.post("/api/property",
      json,
      { headers: { Prefer: "return=representation" } }
    ).then(
      (response: any) => {
        if (response.status === 201) {
          resolve(response.data[0]);
        } else {
          reject("err insert item: response.status - " + response.status);
        }
      },
      (err: any) => {
        reject(err);
      }
    ).catch((error: any) => {
      reject(error);
    });
  });
}
public static updateItem(id: any) {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    const dataProperty = StoreService.Instance.store.getters["propertyForm/ITEMS"];
    const prop: any = {};
    for (const v in dataProperty) {
      if (
        v === "client" ||
        v === "def_price_float"
      ) {
      /* if (v === "pages" || v === "beds" || v === "client" || v === "fees" || v === "extras" ) { */
        continue;
      } else {
        prop[v] = dataProperty[v];
      }
    }
    prop.fts = StoreService.Instance.store.state.propertyForm.fts;
    AxiosService.Instance.axios.patch("/api/property?id=eq." + id,
      prop,
      { headers: { Prefer: "return=representation" } }
    )
      .then(
        (response: any) => {
          if (response.status === 200 && response.data.length > 0) {
            resolve(response.data[0]);
          } else {
            reject("err update item: response.status - " + response.status);
          }
        },
        (err: any) => {
          reject(err);
        }
      )
      .catch((error: any) => {
        reject(error);
      });
  });
}
public static deleteItem(data: any) {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    AxiosService.Instance.axios.patch("/api/property?id=eq." + data.id,
      data,
      { headers: { Prefer: "return=representation" } }
    ).then(
      (response: any) => {
        if (response.status === 200 && response.data.length > 0) {
          resolve(true);
        } else {
          reject("err deleteItem: response.status - " + response.status);
        }
      },
      (err: any) => {
        reject(err);
      }
    ).catch((error: any) => {
      reject(error);
    });
  });
}
public static searchDuplicateCard() {  // проверка на наличие дубликата записи
  return new Promise((resolve, reject) => {
    const changes: any = StoreService.Instance.store.state.propertyForm.changes;
    const origin: any = StoreService.Instance.store.state.propertyForm.origin;
    if (changes.code === undefined || changes.code === origin.code) {
      resolve([]);
      return;
    }
    AxiosService.Instance.axios.get("/api/property?code=eq." + changes.code).then((response: any) => {
      if (response.status === 200) {
        resolve(response.data);
      } else {
        reject(false);
      }
    }, (err: any) => {
      reject(err);
    }).catch((error: any) => {
      reject(error);
    });
  });
}
}
