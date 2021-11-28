import { AppService } from '@/services/app_service';
import { ref, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex';

export default function appComposition() {
    const appService = AppService.Instance;
    const store = useStore();
    const onMountFn = (): void => {
      appService.stopLoader(store.getters.getCurrentRoute.fullPath + ": after mounted component");
    }
    onMounted(onMountFn)
    return {
      onMountFn
    }
}