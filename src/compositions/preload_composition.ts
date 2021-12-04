import { RouterStoreGetters } from '@/config';
import { AppPreloadService } from '@/services/app_preload_service';
import { onMounted } from 'vue'
import { useStore } from 'vuex';

export default function appPreloadComposition() {
    const appPreloadService = AppPreloadService.Instance;
    const store = useStore();
    const onMountFn = (): void => {
      appPreloadService.stopLoader(store.getters[RouterStoreGetters.getCurrentRoute].fullPath + ": after mounted component");
    }
    onMounted(onMountFn)
}