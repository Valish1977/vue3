import { APP_DISPATCH, APP_GETTERS } from "@/store/modules/app";
import { useStore } from "vuex";

export default function sidebarComposition() {
    const store = useStore();
    const sideBarToggle = (): void => {
      store.dispatch(APP_DISPATCH.SET_SIDE_BAR, !store.getters[APP_GETTERS.GET_SIDE_BAR]);
    }
    return { 
      sideBarToggle
    };
}