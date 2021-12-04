import { ComputedRef } from "vue-demi";
import { useRouter } from "vue-router";

export default function routerComposition(sidebar: ComputedRef<boolean>, sideBarToggle: () => void) {
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