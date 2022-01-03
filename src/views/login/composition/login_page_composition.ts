import { AppPreloadService } from '@/services/app_preload_service';
import { ROUTES_GETTERS } from '@/store/modules/routes';
import { onMounted } from 'vue'
import { useStore } from 'vuex';

export default function loginPageComposition() {
    const appPreloadService = AppPreloadService.Instance;
    const store = useStore();
    // выставляем ширину окна
    
    const onMountFn = (): void => {
      // сообщаем что страница загружена и выключаем лоадер
      appPreloadService.stopLoader(store.getters[ROUTES_GETTERS.GET_CURRENT_ROUTE].fullPath + ": after mounted component");
    }
    onMounted(onMountFn)
    return {
      onMountFn
    }
}