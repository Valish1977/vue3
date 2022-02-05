import AxiosService from "@/core/axios_service";
import StoreService from "@/store/index";
export default class ThirdCompanyApi {
public static async getItems(query: any) {
  const items = await AxiosService.Instance.axios.get("/api/third_company" + query.filters, { headers: { Prefer: "count=exact" } }).then(
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

public static async getThirdCompanys(query: any) {
  const items = await AxiosService.Instance.axios.get("/api/third_company" + query, { headers: { Prefer: "count=exact" } }).then(
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

public static insertItem() {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    const obj = StoreService.Instance.store.getters["thirdCompanyForm/ITEMS"];
    const json: any = {};
    for (const key in obj) {
      if (key !== "hash2" && key !== "id") {
        json[key] = obj[key];
      }
    }
    json.fts = StoreService.Instance.store.state.thirdCompanyForm.fts;
    AxiosService.Instance.axios.post("/api/third_company",
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
    )
      .catch((error: any) => {
        reject(error);
      });
  });
}

public static updateItem() {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    const obj: any = StoreService.Instance.store.getters["thirdCompanyForm/ITEMS"];
    const json: any = {};
    for (const key in obj) {
      if (key !== "hash" && key !== "hash2"  && key !== "prefs"  && key !== "del_reason"  && key !== "del") {
        json[key] = obj[key];
      }
    }
    json.id = StoreService.Instance.store.state.thirdCompanyForm.id;
    json.fts = StoreService.Instance.store.state.thirdCompanyForm.fts;
    AxiosService.Instance.axios.patch("/api/third_company?id=eq." + StoreService.Instance.store.state.thirdCompanyForm.id,
      json,
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
    AxiosService.Instance.axios.patch("/api/third_company?id=eq." + data.id,
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

public static searchDuplicateField(field: any) {  // проверка на наличие дубликата записи
  return new Promise((resolve, reject) => {
    const changes = StoreService.Instance.store.state.thirdCompanyForm.changes;
    const origin = StoreService.Instance.store.state.thirdCompanyForm.origin;
    if (changes[field] === undefined || changes[field] === origin[field]) {
      resolve([]);
      return;
    }
    AxiosService.Instance.axios.get("/api/third_company?" + field + "=eq." + changes[field]).then((response: any) => {
      if (response.status === 200) {
        resolve(response.data);
      } else {
        reject("err searchDuplicateField -  " + field + ": response.status - " + response.status);
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
}
