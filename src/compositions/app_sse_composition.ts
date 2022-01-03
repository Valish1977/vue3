import { AppPreloadService } from '@/services/app_preload_service';
import SseService from '@/services/sse_services';
import { onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex';


export default function appSseComposition() {
    const appPreloadService = AppPreloadService.Instance;
    const store = useStore();
    let connect: SseService;
    const connectSse = (): void => { 
      connect = new SseService();
    }
    const disconnectSse = (): void => {
      console.log("sse close");
      connect.sseConnect!.close();
    }
    onBeforeUnmount(disconnectSse)
    onMounted(connectSse)
    return {
    }
}