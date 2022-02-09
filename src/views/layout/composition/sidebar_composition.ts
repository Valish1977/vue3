import { Data } from "@/enums/enum_other";
import { APP_DISPATCH, APP_GETTERS } from "@/store/modules/app";
import { useStore } from "vuex";

const sidebarComposition = (): Data => {
    const store = useStore();
    const sideBarToggle = (): void => {
      store.dispatch(APP_DISPATCH.SET_SIDE_BAR, !store.getters[APP_GETTERS.GET_SIDE_BAR]);
    }
    return { 
      sideBarToggle
    };
}
export default sidebarComposition; 