import StoreService  from "@/store/index";
import RouterService from "@/core/router_service";
import UserApi from "@/domain/api/user";
import AxiosService from "@/core/axios_service";
import { AUTH_DISPATCH, AUTH_GETTERS } from "@/store/modules/auth";
import { Data } from "@/enums/enum_other";

export interface AuthDataResponse {
    type: string,
    status: string,
    text: string
  }
export interface  TokenData {
    authToken: string,
    refreshToken: string,
    atJson: Data,
    rtJson: Data
}
export default class AuthService {
    private _userApi = new UserApi();
    public loginIn(login: string, pass: string, callback: (data: any) => void): Promise<AuthDataResponse> {
       return this._userApi.loginIn(login, pass).then((response: any) => {
            if (response.status === 200) {
                const user = this._makeUserFromResponse(response, this._parseToken(response));
                // вносим в сиситему данные о зарегистрированном пользователе
                this.setUser(user);
                callback(response.data);
                return { type: "success", status: response.status, text: "Login.notify.success" } as AuthDataResponse;
            } else {
                return { type: "error", status: response.status, text: `Login.notify.${response.status}` } as AuthDataResponse;
            }
        }).catch((err: any) => {
            return { type: "error", status: "0", text: err.message} as AuthDataResponse;
        });
    }
    public refreshTokenAuth(callback: (data: any) => void) {
        return this._userApi.refreshToken(StoreService.Instance.store.getters[AUTH_GETTERS.GET_USER].refresh_token)
        .then((refreshResponse: any) => {
            const user: Data = this._makeTokenFromResponse(this._parseToken(refreshResponse));
            this._setDataInStore(user);
            callback(refreshResponse.data);
            return user.auth_token
        })
        .catch((err: any) => {
            throw(err);
        });
    }
    public logOut(callback: () => void) {
        this._clearDataInStore();
        RouterService.Instance.resetRouter();
        callback();
    }
    public checkUserInLocalStorage(): boolean {
        const userJSON = localStorage.getItem("user");
        if (userJSON) {
            const user: any = JSON.parse(userJSON);
            if (user.refresh_token_exp - 30 <= Date.now() / 1000) {
                return false;
            } else {
                this.setUser(user);
                return true;
            }
        } else {
            return false;
        }
    }
    private _parseToken(response: Data): TokenData {
        const authToken = response.data.at?? response.data.token.at;
        const refreshToken = response.data.rt?? response.data.token.rt;
        const atArr = authToken.split(".");
        const atPayload = atob(atArr[1]);
        const atJson = JSON.parse(atPayload);
        const rtArr = refreshToken.split(".");
        const rtPayload = atob(rtArr[1]);
        const rtJson = JSON.parse(rtPayload);
        return { 
            authToken,
            refreshToken,
            atJson,
            rtJson
        }
    }
    
    private _makeTokenFromResponse(tokenData: TokenData): any {
        const userJSON = localStorage.getItem("user");
        if (userJSON) {
            const user: any = JSON.parse(userJSON);
            user.auth = true;
            user.auth_token = tokenData.authToken;
            user.auth_token_exp = tokenData.atJson.exp;
            user.refresh_token = tokenData.refreshToken;
            user.refresh_token_exp = tokenData.rtJson.exp;
            return user;
        } else {
            throw(new Error("There is no user data in local storage. Unable to write updated token."));
        }
    }

    private _makeUserFromResponse(response: Data, tokenData: TokenData): any {
        const user: any = response.data.user_data;
        user.prefs_changed = response.data.prefs_changed;
        user.auth = true;
        user.id = tokenData.atJson.user_id;
        user.org_id = tokenData.atJson.org_id;
        user.RoleCode = tokenData.atJson.role;
        user.auth_token = tokenData.authToken;
        user.auth_token_exp = tokenData.atJson.exp;
        user.refresh_token = tokenData.refreshToken;
        user.refresh_token_exp = tokenData.rtJson.exp;
        return user;
    }
    public setUser(user: Data): void {  
        this._setDataInStore(user);
        RouterService.Instance.resetRouter();
    }
    private _setDataInStore(user: Data): void {
        AxiosService.Instance.axios.defaults.headers.common.Authorization = "Bearer " + user.auth_token;
        localStorage.setItem("user", JSON.stringify(user));
        StoreService.Instance.store.dispatch(AUTH_DISPATCH.SET_USER, user);
    }
    private _clearDataInStore(): void {
        AxiosService.Instance.axios.defaults.headers.common.Authorization = "";
        localStorage.removeItem("user");
        StoreService.Instance.store.dispatch(AUTH_DISPATCH.UNSET_USER);
    } 
    private getAxiosErr(err: any): any {
        let status = "0";
        let text = "Login.notify.err";
        if (err.response) {
            status = err.response.status;
            switch (err.response.status) {
                case 403:
                    text = "Login.notify.403";
                    break;

                case 400:
                    text = "Login.notify.400";
                    break;

                case 404:
                    text = "Login.notify.404";
                    break;

                default:
                    text = "Login.notify.default";
                    break;
            }
        }
        return ({ type: "error", status, text });
    }
}
