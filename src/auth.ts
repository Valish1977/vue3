/* import Vue from "vue";
import store from "@/store/index";
import Filter from "@/components/filters/api/filters";
const filter = new Filter();
import { router, resetRouter } from "./router";

// tslint:disable-next-line:class-name
export default class Auth {
    public loginIn(login: string, pass: string): any {
        return new Promise((resolve) => {
            Vue.$axios.post("/api/rpc/login", {
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
            }).then((response: any) => {
                if (response.status === 200) {
                    const user = this.makeUserFromResponse(response);
                    this.setUser(user);
                    filter.testVersions(response.data[0].ref_version);
                    router.push({ path: store.getters.getFirstRoute(store.getters.getUser.RoleCode) });
                } else {
                    resolve({ type: "error", status: response.status, text: "Login.notify.err1" });
                }
            }, (err: any) => {
                resolve(this.getAxiosErr(err));
            });
        });
    }
    public logOut() {
        Vue.$axios.defaults.headers.common.Authorization = "";
        localStorage.removeItem("user");
        store.dispatch("unsetUser");
        resetRouter();
        router.push({ path: "/login" });
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
    public makeUserFromResponse(response: any): any {
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
        Vue.$axios.defaults.headers.common.Authorization = "Bearer " + user.auth_token;
        localStorage.setItem("user", JSON.stringify(user));
        store.dispatch("setUser", user);
        const routes: any = store.getters.getRoutes(user.RoleCode);
        router.addRoutes(routes, {resolve: true});
    }
    private getAxiosErr(err: any): any {
        let status: string = "0";
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
 */