import Filter from "@/components/filters/api/filters";
import { RouterPath } from "@/config";
import { CoreGetterNames } from "@/enums/core_enums";
import StoreService from "@/store";
import RouterService from "./router_service";

export class AuthCallback {
    public static refreshToken (data: any): void {
        Filter.testVersions(data.ref_version);
    }
    public static loginIn (data: any): void {
        Filter.testVersions(data.ref_version);
        const getters = StoreService.Instance.store.getters;
        RouterService.Instance.router.push({ path: getters[CoreGetterNames.getFirstRoute](getters[CoreGetterNames.getUser].RoleCode) });
    }
    public static logOut (): void {
        if (StoreService.Instance.store.getters.getCurrentRoute.fullPath === RouterPath.cabinet) {
            RouterService.Instance.router.push({ path: RouterPath.index });
        }
    }
}