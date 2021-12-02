import { AppPreloadService } from '@/services/app_preload_service';
import StoreService from '@/store';
import { ref, computed, watch, onMounted, onBeforeUnmount, SetupContext } from 'vue'
import { useStore } from 'vuex';

class SseService {
  public sseConnect?: EventSource = undefined;
  constructor() {
    this._connectSse();
  }
  private _connectSse() {
    this.sseConnect = new EventSource(process.env.VUE_APP_API_ROOT + "/sse");
    this.sseConnect.onmessage = (event: any) => {
      const data = JSON.parse(event.data);
      StoreService.Instance.store.dispatch("app/setBus", {
        name: "sse_" + data.Messages[0].Values.obj,
        data: JSON.parse(data.Messages[0].Values.rowdata)
      });
    };
    this.sseConnect.onerror = (e: any) => {
      console.log("sse disconnect");
      this.sseConnect!.close();
      this._connectSse();
    };
  }
}
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