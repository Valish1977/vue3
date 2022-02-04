// load DTO from server and transform to internal format
import StoreService from "@/store/index";
import AxiosService from "@/core/axios_service";
import { APP_DISPATCH } from "@/store/modules/app";
import { USER_FORM_GETTERS } from "@/store/modules/userForm";

const CLIENT_FORM_API = {
  USER: "api/user",
  LOGIN: "api/rpc/login",
  REFRESH: "api/rpc/refresh",
  REGMAIL: "api/services/regmail",
  UPLOAD: "uploader/upload",
  DELETE: "uploader/delete",
}
export default class UserApi {
    private _store = StoreService.Instance.store;
    private _axios =  AxiosService.Instance.axios;
    public refreshToken(token: string) {
      return new Promise((resolve, reject) => {
        this._axios({
          headers: { Authorization: "none" },
          method: "post",
          url: CLIENT_FORM_API.REFRESH,
          data: {
            rt: token
          }
        })
          .then((response: any) => resolve(response))
          .catch((err: Error) => reject(err)
          );
      });
    }
    public loginIn(login: string, pass: string) {
      return new Promise((resolve, reject) => {
          this._axios.post(CLIENT_FORM_API.LOGIN, {
              ulogin: login,
              upass: pass,
              udata: {
                user_agent: navigator.userAgent,
                disp_width: window.screen.width,
                disp_height: window.screen.height,
                app_width: window.innerWidth,
                app_height: window.innerHeight,
                ratio: window.devicePixelRatio || 1,
                referrer: document.referrer
            }
          }).then((response: any) => resolve(response))
          .catch((err: any) => { 
            if (err.response) resolve(err.response); 
            else reject(err.message);
          }
          );
      });
  }
  public async getItems(query: any) {
    const items = await this._axios.get(CLIENT_FORM_API.USER + query.filters, { headers: { Prefer: "count=exact" } }).then(
      (response: any) => {
        if (response.status === 200 || response.status === 206) {
          if (query.pagination !== undefined && query.pagination) {
            const count = response.headers["content-range"].split("/");
            this._store.dispatch(APP_DISPATCH.SET_PAGINATION_DATA, {
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
      (err: Error) => {
        console.log(err);
      }
    ).catch((error: any) => {
      console.log(error);
      return false;
    });
    return items;
  }

  public async getUsers(query: any) {
    const items = await this._axios.get(CLIENT_FORM_API.USER + query, { headers: { Prefer: "count=exact" } }).then(
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
    ).catch((error: Error) => {
      console.log(error);
      return false;
    });
    return items;
  }

  public insertItem() {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      const obj = this._store.getters[USER_FORM_GETTERS.ITEMS];
      const json: any = {};
      for (const key in obj) {
        if (key !== "hash2" && key !== "id" && key !== "hour_rate_float") {
          json[key] = obj[key];
        }
      }
  
      json.fts = this._store.state.userForm.fts;
      this._axios.post(CLIENT_FORM_API.USER,
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
        .catch((error: Error) => {
          reject(error);
        });
    });
  }

  public sendMailFn(send: any, email: any, login: any, pass: any) {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      if (!send) {
        resolve(true);
      }
      this._axios.post(CLIENT_FORM_API.REGMAIL,
        {
          to: email,
          subject: "Registration FunQuest",
          login,
          pass
        }
      ).then(
        (response: any) => {
          if (response.status === 200) {
            resolve(true);
          } else {
            reject("err sendMail: response.status - " + response.status);
          }
        },
        (err: any) => {
          reject("err sendMail - " + err);
        }
      ).catch((error: Error) => {
        reject("err sendMail - " + error);
      });
    });
  }
  
  public active(val: any, id: any) {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      this._axios.patch(CLIENT_FORM_API.USER + "?id=eq." + id,
        {
          active: val
        },
        { headers: { Prefer: "return=representation" } }
      ).then(
        (response: any) => {
          if (response.status === 200 && response.data.length > 0) {
            resolve(true);
          } else {
            reject("err activate item: response.status - " + response.status);
          }
        },
        (err: any) => {
          reject(err);
        }
      )
        .catch((error: Error) => {
          reject(error);
        });
    });
  }
  
  
  public verified(val: any, id: any) {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      this._axios.patch(CLIENT_FORM_API.USER + "?id=eq." + id,
        {
          verified: val
        },
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
        .catch((error: Error) => {
          reject(error);
        });
    });
  }
  
  public updateItem() {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      const obj: any = this._store.getters[USER_FORM_GETTERS.ITEMS];
      const json: any = {};
      for (const key in obj) {
        if (key !== "hash" && key !== "hash2"  && key !== "prefs"  && key !== "del_reason"  && key !== "del" && key !== "hour_rate_float") {
          json[key] = obj[key];
        }
      }
      json.id = this._store.state.userForm.id;
      json.fts = this._store.state.userForm.fts;
      this._axios.patch(CLIENT_FORM_API.USER + "?id=eq." + this._store.state.userForm.id,
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
        .catch((error: Error) => {
          reject(error);
        });
    });
  }
  public updatePass() {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      const data = this._store.getters[USER_FORM_GETTERS.ITEMS];
      const result: any = {};
      for (const i in data) {
        if (i === "hash") {
          result[i] = data[i];
        }
      }
      result.fts = this._store.state.userForm.fts;
      this._axios.patch(CLIENT_FORM_API.USER + "?id=eq." + this._store.state.userForm.id,
        result,
        { headers: { Prefer: "return=representation" } }
      )
        .then(
          (response: any) => {
            if (response.status === 200 && response.data.length > 0) {
              resolve(response.data);
            } else {
              reject("err updatePass: response.status - " + response.status);
            }
          },
          (err: any) => {
            reject(err);
          }
        ).catch((error: Error) => {
          reject(error);
        });
    });
  }
  
  public deleteItem(data: any) {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      this._axios.patch(CLIENT_FORM_API.USER + "?id=eq." + data.id,
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
      ).catch((error: Error) => {
        reject(error);
      });
    });
  }
  
  public searchDuplicateField(field: any) {  // проверка на наличие дубликата записи
    return new Promise((resolve, reject) => {
      const changes = this._store.state.userForm.changes;
      const origin = this._store.state.userForm.origin;
      if (changes[field] === undefined || changes[field] === origin[field]) {
        resolve([]);
        return;
      }
      this._axios.get(CLIENT_FORM_API.USER + "?" + field + "=eq." + changes[field]).then((response: any) => {
        if (response.status === 200) {
          resolve(response.data);
        } else {
          reject("err searchDuplicateField -  " + field + ": response.status - " + response.status);
        }
      },
        (err: any) => {
          reject(err);
        }
      ).catch((error: Error) => {
        reject(error);
      });
    });
  }
  
  public uploadFile(fileList: any[]) {
    return new Promise((resolve, reject) => {
      if (fileList.length > 0) {
        const formData = new FormData();
        for (const p of fileList) {
          formData.append(p.response[0], p.raw);
        }
        this._axios.post(
          CLIENT_FORM_API.UPLOAD,
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
        }).catch((error: Error) => {
          reject(error);
        });
      } else {
        resolve(true);
      }
    });
  }
  
  public delFile(fileList: any) {
    return new Promise((resolve, reject) => {
      if (fileList.length === 0) {
        resolve(false);
      } else {
        this._axios.post(
          CLIENT_FORM_API.DELETE,
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
        }).catch((error: Error) => {
          reject(error);
        });
      }
    });
    }
  }