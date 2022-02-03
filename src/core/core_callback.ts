import Filter, { FILTER_API } from "@/components/filters/api/filters";
import { FILTER_REFERENCE } from "@/components/filters/store/filters";
import StoreService from "@/store";
import { AUTH_GETTERS } from "@/store/modules/auth";
import { ROUTER_PATH, ROUTES_GETTERS } from "@/store/modules/routes";
import AuthService from "./auth_service";
import AxiosService from "./axios_service";
import RouterService from "./router_service";

export class CoreCallback {
    // execute on runApp in main.ts
    public static runApp () {
        const _setReferences = (): void => {
            AxiosService.Instance.axios.get(`${FILTER_API.REFERENCE_PATH}${FILTER_REFERENCE.REF_VERSIONS}`, {
            }).then((response: any) => {
                Filter.testVersions( response.data );
            }, (err: any) => {
                 //
            });
        }
        const _setupAuthorized = (): void => { 
            const auth = new AuthService();
            if (!StoreService.Instance.store.getters[ AUTH_GETTERS.GET_USER ].auth) {
                if (!auth.checkUserInLocalStorage()) {
                    RouterService.Instance.router.push({ path: ROUTER_PATH.LOGIN });
                }
            }
        }
        _setReferences();
        _setupAuthorized();
    }


    // execute when a refreshToken is received
    public static refreshToken (data: any): void {
       Filter.testVersions(data.ref_version);
    }
    // execute on authorization
    public static loginIn (data: any): void {
        Filter.testVersions(data.ref_version);
    }
    // execute on logout
    public static logOut (): void {
        if (StoreService.Instance.store.getters[ROUTES_GETTERS.GET_CURRENT_ROUTE].fullPath !== ROUTER_PATH.LOGIN) {
            RouterService.Instance.router.push({ path: ROUTER_PATH.LOGIN });
        }
    }
}