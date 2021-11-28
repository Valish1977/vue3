import { AppService } from '@/services/app_service';
import { ref, computed, watch } from 'vue'

export default function appComposition() {
    const appService = AppService.Instance;
    const countLoaded = ref(appService.countLoaded);
    watch(countLoaded, appService.watchCountLoaded);
    return {
      countLoaded
    }
}