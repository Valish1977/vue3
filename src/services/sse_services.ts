
import StoreService from "@/store";
import { APP_DISPATCH } from "@/store/modules/app";

export default class SseService {
    public sseConnect?: EventSource = undefined;
    constructor() {
      this._connectSse();
    }
    private _connectSse() {
      this.sseConnect = new EventSource(process.env.VUE_APP_API_ROOT + "/sse");
      this.sseConnect.onmessage = (event: any) => {
        const data = JSON.parse(event.data);
        StoreService.Instance.store.dispatch(APP_DISPATCH.SET_BUS, {
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