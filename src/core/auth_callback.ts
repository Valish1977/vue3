import { RouterPath } from "@/config";
import { CoreGetterNames } from "@/enums/core_enums";
import StoreService from "@/store";
import RouterService from "./router_service";

export class AuthCallback {
    public static loginIn (): void {
        const getters = StoreService.Instance.store.getters;
        RouterService.Instance.router.push({ path: getters[CoreGetterNames.getFirstRoute](getters[CoreGetterNames.getUser].RoleCode) });
    }
    public static logOut (): void {
        RouterService.Instance.router.push({ path: RouterPath.login });
    }
}