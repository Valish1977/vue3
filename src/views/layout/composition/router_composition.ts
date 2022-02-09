import { Data } from "@/enums/enum_other";
import { ComputedRef } from "vue";
import { useRouter } from "vue-router";

const routerComposition = (sidebar: ComputedRef<boolean>, sideBarToggle: () => void): Data => {
    const router = useRouter();
    const pushRoute = (path: string): void => {
      if (sidebar.value) {
        sideBarToggle();
      }
      router.push({ path });
    }
    return { 
      pushRoute
    };
}

export default routerComposition; 