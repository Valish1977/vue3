import { Data } from '@/enums/enum_other';
import SseService from '@/services/sse_services';
import { onMounted, onBeforeUnmount } from 'vue'


const appSseComposition = (): Data => {
    let connect: SseService;
    const connectSse = (): void => { 
      connect = new SseService();
    }
    const disconnectSse = (): void => {
      console.log("sse close");
      connect.sseConnect?.close();
    }
    onBeforeUnmount(disconnectSse)
    onMounted(connectSse)
    return {
    }
}
export default appSseComposition;