import { AppStoreActions, AppStoreGetters } from "@/config";
import { useStore } from "vuex";

export default function sidebarComposition() {
    const store = useStore();
    const sideBarToggle = (): void => {
      store.dispatch(AppStoreActions.setSideBar, !store.getters[AppStoreGetters.getSideBar]);
    }
    return { 
      sideBarToggle
    };
}