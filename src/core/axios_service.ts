import axios, { AxiosInstance } from 'axios'
import AuthService from "@/core/auth_service";
import { AuthCallback } from './auth_callback';

export default class AxiosService {
  private static _instance: AxiosService;
  private _instanceAxios: AxiosInstance;
  private constructor() {
    this._instanceAxios = axios.create({
      baseURL: process.env.VUE_APP_API_ROOT
      // baseURL: process.env.baseURL || process.env.apiUrl || ""
      // timeout: 60 * 1000, // Timeout
      // withCredentials: true, // Check cross-site Access-Control
    });
    this.setInterceptorResponse();
  }
  public static get Instance(): AxiosService {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }
  private _isRefreshing = false;
  public get axios(): AxiosInstance {
    return this._instanceAxios;
  }
  public setInterceptorResponse(): void {
    this._instanceAxios.interceptors.request.use(
      (cfg: any) => {
        // Do something before request is sent
        return cfg;
      },
      (err: any) => {
        // Do something with request error
        return Promise.reject(err);
      }
    );
    this._instanceAxios.interceptors.response.use(undefined, (interceptorErr: any) => {
      const mainResponce: any = interceptorErr.response;
      if (mainResponce.status === 401 && !this._isRefreshing) {
        const _auth = new AuthService();
        this._isRefreshing = true;
        return new Promise((resolve, reject) => {
          _auth.refreshTokenAuth(AuthCallback.refreshToken).then((newToken: string) => {
            this._isRefreshing = false;
            mainResponce.config.headers = { Authorization: "Bearer " + newToken };
            resolve(this._instanceAxios(mainResponce.config));
          })
            .catch((err) => {
              this._isRefreshing = false;
              if (err.request.status === 403) {
                _auth.logOut(AuthCallback.logOut);
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