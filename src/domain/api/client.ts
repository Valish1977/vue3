import StoreService from "@/store/index";
import AxiosService from "@/core/axios_service";
import { CLIENT_FORM_GETTERS } from "@/store/modules/clientForm";
import { Data } from "@/enums/enum_other";

enum CLIENT_FORM_API {
  USER = "api/user",
  CLIENT = "api/register",
  CHANGE_PASS = "api/change_pass",
  CHANGE_LOGIN = "api/change_login",
  CHECK_EMAIL = "api/checkmail"
}

export interface GuestData {
  firstName: string,
  lastName: string,
  companyName: string | null,
  email: string,
  phone: string | null,
  cellPhone: string | null,
  address1: string | null,
  address2: string | null
}

export interface SubmitClientData {
  fts: number,
  data: GuestData
}
export default class ClientApi {
public static async getItems(query: string) {
  const items = await AxiosService.Instance.axios.get(CLIENT_FORM_API.USER + query).then((response: any) => {
    /* TODO: заменяна строка if (response.status === 200 || response.status === 206) { */
      if (response.status === 200 || response.status === 304) {
        return response.data;
      } else {
        return false;
      }
  }).catch((error: any) => {
    console.log(error);
    return false;
  });
  return items;
}
public static insertItem(data: GuestData) {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    AxiosService.Instance.axios.post(CLIENT_FORM_API.CLIENT,
      data,
      { headers: { Prefer: "return=representation" } }
    ).then(
      (response: any) => {
        if (response.status === 200) {
          resolve(response.data);
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
public static updateItem() {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    const obj: any = StoreService.Instance.store.getters[CLIENT_FORM_GETTERS.ITEMS];
    const json: any = {};
    for (const key in obj) {
      if (key !== "hash" && key !== "hash2" && key !== "hashLogin"  && key !== "login"  && key !== "email" && key !== "prefs"  && key !== "del_reason"  && key !== "del") {
        json[key] = obj[key];
      }
    }
    json.id = StoreService.Instance.store.getters.getUser.id;
    AxiosService.Instance.axios.patch(`${CLIENT_FORM_API.CLIENT}?id=eq.${StoreService.Instance.store.getters.getUser.id}`,
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
public static updatePass(oldpass: string, newpass: string) {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    AxiosService.Instance.axios.post(CLIENT_FORM_API.CHANGE_PASS,
      {
        oldpass,
        newpass
      }
    )
      .then(
        (response: any) => {
          if (response.status === 200) {
            resolve(response.data);
          } else {
            reject("err updatePass: response.status - " + response.status);
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

public static updateLogin(upass: string, newlogin: string) {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    AxiosService.Instance.axios.post(CLIENT_FORM_API.CHANGE_LOGIN,
      {
        upass,
        newlogin
      }
    )
      .then(
        (response: any) => {
          if (response.status === 200) {
            resolve(response.data);
          } else {
            reject("err updatePass: response.status - " + response.status);
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

public static async searchDuplicateEmail(email: string) {
  const items = await AxiosService.Instance.axios.get(`${CLIENT_FORM_API.CHECK_EMAIL}?email=${email}`).then(
    (response: any) => {
      if (response.status === 200) {
        return response.data;
      } else {
        return false;
      }
    },
    (err: any) => {
      console.log("sdsdsd", err);
      console.log(err);
      return false;
    }
  ).catch((error: any) => {
    
    return false;
  });
  return items;
}

public static uploadFile(fileList: Data[]): Promise<any> {
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

public static async delFile(fileList: Data[]): Promise<any> {
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