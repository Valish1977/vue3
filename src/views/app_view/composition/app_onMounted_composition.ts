import { CoreActionNames, CoreGetterNames } from '@/enums/core_enums';
import { AppPreloadService } from '@/services/app_preload_service';
import { onMounted } from 'vue'
import { useStore } from 'vuex';

export default function appPreloadComposition() {
    const appPreloadService = AppPreloadService.Instance;
    const store = useStore();
    const onMountFn = (): void => {
      appPreloadService.stopLoader(store.getters[CoreGetterNames.getCurrentRoute].fullPath + ": after mounted component");
    }
    onMounted(onMountFn)
}