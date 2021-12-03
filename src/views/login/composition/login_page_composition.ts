import { AppStoreActions, RouterStoreGetters } from '@/config';
import { AppPreloadService } from '@/services/app_preload_service';
import { ref, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex';

export default function appComposition() {
    const appPreloadService = AppPreloadService.Instance;
    const store = useStore();
    // выставляем ширину окна
    store.dispatch(AppStoreActions.setWindowWidth, window.innerWidth);
    const onMountFn = (): void => {
      // сообщаем что страница загружена и выключаем лоадер
      appPreloadService.stopLoader(store.getters[RouterStoreGetters.getCurrentRoute].fullPath + ": after mounted component");
    }
    onMounted(onMountFn)
    return {
      onMountFn
    }
}