import { AppStoreActions, RouterStoreGetters } from '@/config';
import { AppPreloadService } from '@/services/app_preload_service';
import { ref, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex';

export default function loginPageComposition() {
    const appPreloadService = AppPreloadService.Instance;
    const store = useStore();
    // выставляем ширину окна
    
    const onMountFn = (): void => {
      // сообщаем что страница загружена и выключаем лоадер
      appPreloadService.stopLoader(store.getters[RouterStoreGetters.getCurrentRoute].fullPath + ": after mounted component");
    }
    onMounted(onMountFn)
    return {
      onMountFn
    }
}