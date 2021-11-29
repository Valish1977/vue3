import { AppPreloadService } from '@/services/app_preload_service';
import { ref, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex';

export default function appComposition() {
    const appPreloadService = AppPreloadService.Instance;
    const store = useStore();
    const onMountFn = (): void => {
      appPreloadService.stopLoader(store.getters.getCurrentRoute.fullPath + ": after mounted component");
    }
    onMounted(onMountFn)
    return {
      onMountFn
    }
}