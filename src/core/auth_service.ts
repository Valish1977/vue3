import StoreService  from "@/store/index";
import Filter from "@/components/filters/api/filters";
import RouterService from "@/core/router_service";
import UserApi from "@/domain/api/user";
import AxiosService from "@/core/axios_service";
import { AuthStoreActions, AuthStoreGetters, RouterPath, RouterStoreGetters } from "@/config";

interface AuthDataResponse {
    type: string,
    status: string,
    text: string
  }
export default class AuthService {
    private _userApi = new UserApi();
    public loginIn(login: string, pass: string): Promise<any> {
       return this._userApi.loginIn(login, pass, {
            user_agent: navigator.userAgent,
            disp_width: window.screen.width,
            disp_height: window.screen.height,
            app_width: window.innerWidth,
            app_height: window.innerHeight,
            ratio: window.devicePixelRatio || 1,
            referrer: document.referrer
        }).then((response: any) => {
            if (response.status === 200) {
                const user = this._makeUserFromResponse(response);
                this.setUser(user);
                Filter.testVersions(response.data[0].ref_version);
                RouterService.Instance.router.push({ path: StoreService.Instance.store.getters[RouterStoreGetters.getFirstRoute](StoreService.Instance.store.getters[AuthStoreGetters.getUser].RoleCode) });
                return { type: "success", status: response.status, text: "Login.notify.success" } as AuthDataResponse;
            } else {
                return { type: "error", status: response.status, text: "Login.notify.err1" } as AuthDataResponse;
            }
        }).catch((err: any) => {
            return { type: "error", status: "500", text: "Login.notify.err1" } as AuthDataResponse;
        });
    }
    public refreshTokenAuth() {
        return this._userApi.refreshToken(StoreService.Instance.store.getters[AuthStoreGetters.getUser].refresh_token)
        .then((refreshResponse: any) => {
            // console.log("refreshResponse", refresh_response);
            const user: any = this._makeUserFromResponse(refreshResponse);
            this.setUser(user);
            Filter.testVersions(refreshResponse.data[0].ref_version);
            return user.auth_token
        })
        .catch((err: any) => {
            throw(err);
          // console.log("Произошла ошибка в работе сервиса...", err);
        });
    }
    public logOut() {
        AxiosService.Instance.axios.defaults.headers.common.Authorization = "";
        localStorage.removeItem("user");
        StoreService.Instance.store.dispatch(AuthStoreActions.unsetUser);
        RouterService.Instance.resetRouter();
        RouterService.Instance.router.push({ path: RouterPath.login });
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
    private _makeUserFromResponse(response: any): any {
        const authToken = response.data[0].auth_token;
        const refreshToken = response.data[0].refresh_token;
        const atArr = authToken.split(".");
        const atPayload = atob(atArr[1]);
        const atJson = JSON.parse(atPayload);
        const rtArr = refreshToken.split(".");
        const rtPayload = atob(rtArr[1]);
        const rtJson = JSON.parse(rtPayload);
        const user: any = response.data[0].user_data;
        user.prefs_changed = response.data[0].prefs_changed;
        user.auth = true;
        user.id = atJson.user_id;
        user.org_id = atJson.org_id;
        user.RoleCode = atJson.role;
        user.auth_token = authToken;
        user.auth_token_exp = atJson.exp;
        user.refresh_token = refreshToken;
        user.refresh_token_exp = rtJson.exp;
        return user;
    }
    public setUser(user: any): void {
        AxiosService.Instance.axios.defaults.headers.common.Authorization = "Bearer " + user.auth_token;
        localStorage.setItem("user", JSON.stringify(user));
        StoreService.Instance.store.dispatch(AuthStoreActions.setUser, user);
        RouterService.Instance.resetRouter();
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
