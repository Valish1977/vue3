import axios, { AxiosStatic } from 'axios'
import { StoreService } from "@/store/index";
import Auth from "@/auth";

/* import Filter from "@/components/filters/api/filters";

/* import VueNativeSock from "vue-native-websocket";
Vue.use(VueNativeSock, "ws://127.0.0.1:8090/ws?id=1", { store });
в компоненте слушатель: Vue.prototype.$socket.onmessage = (data) => console.log(data); */
/* store.dispatch("filters/SET_REFERENCES", {
  ref_lang: [],
  ref_group: [],
  ref_pm_role: [],
  ref_role: [],
  ref_tz: [],
  ref_us_county: [],
  ref_state: [],
  ref_property_type: [],
  ref_client_status: [],
  ref_order_type: [],
  ref_order_status: [],
  ref_db_err: [],
  ref_charged_from: []
});
const filter = new Filter(); */

export class AxiosService {
  private _store = StoreService.Instance.store;
  private static _instance: AxiosService;
  private _instanceAxios: AxiosStatic;
  private constructor() {
    this._instanceAxios = axios;
  }
  public static get Instance(): AxiosService {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }
  private _isRefreshing = false;
  public get axios() {
    return this._instanceAxios;
  }
  public setInterceptorResponse(): void {
    const _auth = new Auth();
    this._instanceAxios.interceptors.response.use(undefined, (interceptorErr: any) => {
      // Do something with response error
      // console.log("interceptors error");
      // console.log(interceptor_err.response);
      const mainResponce: any = interceptorErr.response;
      if (mainResponce.status === 401 && !this._isRefreshing) {
        this._isRefreshing = true;
        return new Promise((resolve, reject) => {
          _auth.refreshTokenAuth().then((newToken: String) => {
            this._isRefreshing = false;
            //filter.testVersions(refreshResponse.data[0].ref_version);
            mainResponce.config.headers = { Authorization: "Bearer " + newToken };
            resolve(this._instanceAxios(mainResponce.config));
          })
            .catch((err) => {
              this._isRefreshing = false;
              if (err.request.status === 403) {
                _auth.logOut();
              }
              reject(err);
            });
        });
      } else {
        return Promise.reject(interceptorErr);
      }
    });
  }

}