import axios, { AxiosStatic } from 'axios'
import AuthService from "@/core/auth_service";
export default class VuexService {
  private static _instance: VuexService;
  private _instanceAxios: AxiosStatic;
  private constructor() {
    this._instanceAxios = axios;
    this.setInterceptorResponse();
  }
  public static get Instance(): VuexService {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }
  private _isRefreshing = false;
  public get axios(): AxiosStatic {
    return this._instanceAxios;
  }
  public setInterceptorResponse(): void {
    this._instanceAxios.interceptors.response.use(undefined, (interceptorErr: any) => {
      // Do something with response error
      // console.log("interceptors error");
      // console.log(interceptor_err.response);
      const mainResponce: any = interceptorErr.response;
      if (mainResponce.status === 401 && !this._isRefreshing) {
        const _auth = new AuthService();
        this._isRefreshing = true;
        return new Promise((resolve, reject) => {
          _auth.refreshTokenAuth().then((newToken: string) => {
            this._isRefreshing = false;
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