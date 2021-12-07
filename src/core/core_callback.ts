import Filter from "@/components/filters/api/filters";
import { FilterApi, FilterDispatch } from "@/components/filters/enums";
import { ReferenceConfig, RouterPath } from "@/config";
import { CoreGetterNames } from "@/core/core_enums";
import StoreService from "@/store";
import AuthService from "./auth_service";
import AxiosService from "./axios_service";
import RouterService from "./router_service";

export class CoreCallback {
    // execute on runApp in main.ts
    public static runApp () {
        const _setReferences = (): void => { 
            const auth = new AuthService();
            if (!StoreService.Instance.store.getters[CoreGetterNames.getUser].auth) {
                if (!auth.checkUserInLocalStorage()) {
                    RouterService.Instance.router.push({ path: RouterPath.login });
                }
            }
        }
        _setReferences();
        const _setupAuthorized = (): void => {
            StoreService.Instance.store.dispatch(FilterDispatch.SET_REFERENCES, ReferenceConfig.referenceList);
            AxiosService.Instance.axios.get(FilterApi.GET_REF_VERSION, {
            }).then((response: any) => {
                Filter.testVersions( response.data );
            }, (err: any) => {
                 //
            });
        }
        _setupAuthorized();
    }

    // execute when a refreshToken is received
    public static refreshToken (data: any): void {
       Filter.testVersions(data.ref_version);
    }
    // execute on authorization
    public static loginIn (data: any): void {
        Filter.testVersions(data.ref_version);
        const getters = StoreService.Instance.store.getters;
        RouterService.Instance.router.push({ path: getters[CoreGetterNames.getFirstRoute](getters[CoreGetterNames.getUser].RoleCode) });
    }
    // execute on logout
    public static logOut (): void {
        if (StoreService.Instance.store.getters.getCurrentRoute.fullPath === RouterPath.cabinet) {
            RouterService.Instance.router.push({ path: RouterPath.index });
        }
    }
}