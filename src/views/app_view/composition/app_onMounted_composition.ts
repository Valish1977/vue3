import { Data } from '@/enums/enum_other';
import { AppPreloadService } from '@/services/app_preload_service';
import { APP_GETTERS } from '@/store/modules/app';
import { computed, watch } from 'vue'
import { useStore } from 'vuex';

const appPreloadComposition = (): Data => {
    const store = useStore();
    const appPreloadService = AppPreloadService.Instance;
    const countLoaded = computed(() => store.getters[APP_GETTERS.GET_LOADING]);
    watch(countLoaded, () => {
      appPreloadService.watchCountLoaded();
    });
    return {
      countLoaded
    }
}
export default appPreloadComposition;