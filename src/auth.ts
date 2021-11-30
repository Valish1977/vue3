import Vue from "vue";
import { StoreService }  from "@/store/index";
// import Filter from "@/components/filters/api/filters";
// const filter = new Filter();
import { RouterService } from "@/router";
import { UserApi } from "./domain/api/user";
import { AxiosService } from "@/vuex";
export default class Auth {
    private _routerService = RouterService.Instance;
    private _store = StoreService.Instance.store;
    private _router = RouterService.Instance.router;
    private _userApi = new UserApi();
    private _axios = AxiosService.Instance.axios;

    public loginIn(login: string, pass: string) {
        this._userApi.loginIn(login, pass, {
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
                // filter.testVersions(response.data[0].ref_version);
                this._router.push({ path: this._store.getters.getFirstRoute(this._store.getters.getUser.RoleCode) });
            } else {
                return { type: "error", status: response.status, text: "Login.notify.err1" };
            }
        }).catch((err: any) => {
            return(this.getAxiosErr(err));
        });
    }
    public refreshTokenAuth() {
        return this._userApi.refreshToken(this._store.getters.getUser.refresh_token)
        .then((refreshResponse: any) => {
            // console.log("refreshResponse", refresh_response);
            const user: any = this._makeUserFromResponse(refreshResponse);
            this.setUser(user);
            return user.auth_token
        })
        .catch((err: any) => {
            throw(err);
          // console.log("Произошла ошибка в работе сервиса...", err);
        });
    }
    public logOut() {
        this._axios.defaults.headers.common.Authorization = "";
        localStorage.removeItem("user");
        this._store.dispatch("unsetUser");
        const app = Vue.getCurrentInstance()!.appContext.app;
        this._routerService.resetRouter(app);
        this._router.push({ path: "/login" });
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
        this._axios.defaults.headers.common.Authorization = "Bearer " + user.auth_token;
        localStorage.setItem("user", JSON.stringify(user));
        this._store.dispatch("setUser", user);
        const routes: any = this._store.getters.getRoutes(user.RoleCode);
        const router = Vue.getCurrentInstance()!.appContext.config.globalProperties.router;
        router.addRoutes(routes, { resolve: true });
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
