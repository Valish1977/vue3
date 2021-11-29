import { AppPreloadService } from '@/services/app_preload_service';
import { ref, computed, watch } from 'vue'

export default function appPreloadComposition() {
    const appPreloadService = AppPreloadService.Instance;
    const countLoaded = ref(appPreloadService.countLoaded);
    watch(countLoaded, appPreloadService.watchCountLoaded);
    return {
      countLoaded
    }
}