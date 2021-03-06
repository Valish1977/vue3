import AxiosService from "@/core/axios_service";
import StoreService from "@/store";
import { AUTH_GETTERS } from "@/store/modules/auth";
export enum FILTER_API {
  REFERENCE_PATH = "api/",
  UPDATE_PREFS = "update_prefs",
  USER = "user"
}
export default class Filter {
  public static async getPrefs() {
    const items = await AxiosService.Instance.axios.get(`${FILTER_API.USER}?select=prefs&id=eq.${StoreService.Instance.store.getters[AUTH_GETTERS.GET_USER].id}`).then(
      (response: any) => {
        if (response.status === 200) {
          return response.data[0].prefs;
        } else {
          return false;
        }
      },
      (err: any) => {
        // tslint:disable-next-line:no-console
        console.log(err);
        return false;
      }).catch((error: any) => {
        // tslint:disable-next-line:no-console
        console.log(error);
        return false;
      });
    return items;
  }

  public static async updatePrefs(prefs: any) {
    const prefsChanges = await AxiosService.Instance.axios.post(
      FILTER_API.UPDATE_PREFS,
      { p: prefs }
    ).then(
      (response: any) => {
        if (response.status === 200) {
          return response.data;
        } else {
          return false;
        }
      },
      (err: any) => {
        // tslint:disable-next-line:no-console
        console.log(err);
        return false;
      }).catch((error: any) => {
        // tslint:disable-next-line:no-console
        console.log(error);
        return false;
      });
    return prefsChanges;
  }

  public static testVersions(serverRefVersions: any): void { // проверка текущей версии справочников на актуальность
    if (!Array.isArray(serverRefVersions)) return;
    const rv: string | null = localStorage.getItem("refVersions");
    let currentRefVersions = [];
    if (rv) {
      currentRefVersions = JSON.parse(rv);
    }
    const arrayLoadReferences = [];
    if (currentRefVersions.length === 0) {
      for (let i = 0; i < serverRefVersions.length; i++) {
        arrayLoadReferences.push(serverRefVersions[i].name);
      }
    } else {
      for (let i = 0; i < serverRefVersions.length; i++) {
        let issetName = false;
        for (let q = 0; q < currentRefVersions.length; q++) {
          if (currentRefVersions[q].name === serverRefVersions[i].name) {
            issetName = true;
            if (currentRefVersions[q].version !== serverRefVersions[i].version) {
              arrayLoadReferences.push(serverRefVersions[i].name);
            }
          }
        }
        if (issetName === false) {
          arrayLoadReferences.push(serverRefVersions[i].name);
        }
      }
    }
    if (arrayLoadReferences.length > 0) {
      this._loadReferences(arrayLoadReferences).then((data: any) => {
        if (data) {
          const refVersions: any = JSON.stringify(serverRefVersions);
          localStorage.setItem("refVersions", refVersions); // обновляем версии в localstorage
        }
      });
    }
  }
  private static _loadReferences(arrayLoadReferences: any): any {
    return new Promise((resolve, reject) => {
      let i = 0;
      for (const reference of arrayLoadReferences) {
        AxiosService.Instance.axios.get(`${FILTER_API.REFERENCE_PATH}${reference}`).then((response: any) => {
          // handle success
          if (response.status === 200) {
            i++;
            const dataReference = JSON.stringify(response.data);
            localStorage.setItem(reference, dataReference); // обновляем записи таблиц
            if (i === arrayLoadReferences.length) {
              resolve(true);
            }
          }
        }).catch((error: any) => {
          // handle error
          resolve(false);
        });
      }
    });
  }
}
