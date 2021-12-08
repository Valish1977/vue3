import { CoreGetterNames } from '@/core/core_enums';
import { AppPreloadService } from '@/services/app_preload_service';
import { onMounted } from 'vue'
import { useStore } from 'vuex';

export default function loginPageComposition() {
    const appPreloadService = AppPreloadService.Instance;
    const store = useStore();
    // выставляем ширину окна
    
    const onMountFn = (): void => {

    }
    onMounted(onMountFn)
    return {
      onMountFn
    }
}