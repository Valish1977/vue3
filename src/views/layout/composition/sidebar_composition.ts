import { CoreActionNames, CoreGetterNames } from "@/enums/core_enums";
import { useStore } from "vuex";

export default function sidebarComposition() {
    const store = useStore();
    const sideBarToggle = (): void => {
      store.dispatch(CoreActionNames.setSideBar, !store.getters[CoreGetterNames.getSideBar]);
    }
    return { 
      sideBarToggle
    };
}