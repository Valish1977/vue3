// load DTO from server and transform to internal format
import Vue from "vue";
import store from "@/store/index";
import StoreService from "@/store/index";
import AxiosService from "@/core/axios_service";
import { Data } from "@/enums/enum_other";

export default class OrderApi {
public static async getItems(query: any) {
  const items = await AxiosService.Instance.axios.get("/api/order" + query.filters, { headers: { Prefer: "count=exact" } }).then(
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
public static async getOrders(query: any) {
  const items = await AxiosService.Instance.axios.get("/api/order" + query, { headers: { Prefer: "count=exact" } }).then(
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
    const data = StoreService.Instance.store.getters["orderForm/ITEMS"];
    const json: any = {};
    for (const v in data) {
      if (
        v === "plan_hour" || v === "canceled" || v === "completed"
      ) {
        continue;
      } else {
        json[v] = data[v];
      }
    }
    json.fts = StoreService.Instance.store.state.orderForm.fts;
    AxiosService.Instance.axios.post("/api/order",
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

public static editStatus(val: any, id: any) {
  // eslint-disable-next-line no-unused-vars
  const data: any =  {order_status_id: val};
  if (val !== 5 && val !== 6) {
    data.done_dt = null;
  }
  return new Promise((resolve, reject) => {
    AxiosService.Instance.axios.patch("/api/order?id=eq." + id,
      data,
      { headers: { Prefer: "return=representation" } }
    ).then(
      (response: any) => {
        if (response.status === 200 && response.data.length > 0) {
          resolve(true);
        } else {
          reject("err verify item: response.status - " + response.status);
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

public static editData(data: any) {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    AxiosService.Instance.axios.patch("/api/order?id=eq." + data.id,
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

public static setMessage(id: number, comment: string) {
/*   // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
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
    json.fts = StoreService.Instance.store.state.orderForm.fts;
    AxiosService.Instance.axios.post("/api/order",
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
  }); */
}
public static updateItem(id: any) {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    const dataOrder = StoreService.Instance.store.getters["orderForm/ITEMS"];
    const prop: any = {};
    for (const v in dataOrder) {
      if (
        v === "plan_hour" || v === "canceled" || v === "completed"
      ) {
      /* if (v === "pages" || v === "beds" || v === "client" || v === "fees" || v === "extras" ) { */
        continue;
      } else {
        prop[v] = dataOrder[v];
      }
    }
    prop.fts = StoreService.Instance.store.state.orderForm.fts;
    AxiosService.Instance.axios.patch("/api/order?id=eq." + id,
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
    AxiosService.Instance.axios.patch("/api/order?id=eq." + data.id,
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

public static uploadFile(fileList: Data[]) {
  return new Promise((resolve, reject) => {
    if (fileList.length > 0) {
      const formData = new FormData();
      for (const p of fileList) {
        formData.append(p.response[0], p.raw);
      }
      AxiosService.Instance.axios.post(
        "/uploader/upload",
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      ).then((response: any) => {
        if (response.status === 200) {
          resolve(true);
        } else {
          reject("err upload: response.status - " + response.status);
        }
      }, (err: any) => {
        reject(err);
      }).catch((error: any) => {
        reject(error);
      });
    } else {
      resolve(true);
    }
  });
}

public static delFile(fileList: any) {
  return new Promise((resolve, reject) => {
    if (fileList.length === 0) {
      resolve(false);
    } else {
      AxiosService.Instance.axios.post(
        "/uploader/delete",
        fileList
      ).then((response: any) => {
        if (response.status === 200) {
          resolve(true);
        } else {
          reject("err delFile: response.status - " + response.status);
        }
      }, (err: any) => {
        if (err.response.status === 404 ) { // 404 код в случае если фотки нет, удалить нужно с базы
          resolve(true);
        } else if (err.response.status === 500) { // ошибка вылетает когда файл отсутствует
          resolve(true);
        } else {
          reject(err);
        }
      }).catch((error: any) => {
        reject(error);
      });
    }
  });
}
}