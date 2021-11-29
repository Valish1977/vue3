import { UserApi } from '@/domain/api/user';
import axios, { AxiosStatic } from 'axios'
import { StoreService }  from "@/store/index";
import { getCurrentInstance } from 'vue'
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
  private constructor(){
    this._instanceAxios = axios;
    this._setInterceptorResponse();
  }
  public static get Instance(): AxiosService {
      return this._instance?? new this();
  }
  private _api = new UserApi();
  private auth = new Auth();
  private _isRefreshing: boolean = false;
  public get axios() {
    return this._instanceAxios;
  }
  private _setInterceptorResponse(): void {
    this._instanceAxios.interceptors.response.use(undefined, (interceptorErr: any) => {
      // Do something with response error
      // console.log("interceptors error");
      // console.log(interceptor_err.response);
      const mainResponce: any = interceptorErr.response;
      if (mainResponce.status === 401 && !this._isRefreshing) {
        this._isRefreshing = true;
        return this._api?.refreshToken(this._store.getters.getUser.refresh_token).then((refreshResponse: any) => {
            this._isRefreshing = false;
            // console.log("refreshResponse", refresh_response);
            const user: any = this.auth.makeUserFromResponse(refreshResponse);
            this.auth.setUser(user);
            //filter.testVersions(refreshResponse.data[0].ref_version);
            mainResponce.config.headers = { Authorization: "Bearer " + user.auth_token };
            this._instanceAxios(mainResponce.config);
          })
          .catch((err: any) => {
            this._isRefreshing = false;
            if (err.request.status === 403) {
              this.auth.logOut();
            }
            // console.log("Произошла ошибка в работе сервиса...", err);
          });
      } else {
        return Promise.reject(interceptorErr);
      }
    });
  }

}