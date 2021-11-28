<template>
<div id="app">
  <router-view></router-view>
</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref} from "vue";
import { AppService} from '@/services/app_service';
const App = defineComponent({
  data() {
    return {
      sseConnect: null as number | null
    }
  },
  setup() {
    const appService = AppService.Instance;
    const countLoaded = ref(0);
    countLoaded.value = appService.countLoaded;
    return {
      appService,
      countLoaded
    }
  },
  watched() {
    this.countLoaded, (count: number, prevCount: number) => {
      this.appService.watchCountLoaded;
    }
  }

/*   
    
    // server-sent events
    this.connectSse();
  }
  private connectSse() {
    // console.log("sse connect");
    // this.sseConnect = new EventSource(Vue.prototype.$API_ROOT + "/sse");
    // this.sseConnect.onmessage = (event: any) => {
    //   const data = JSON.parse(event.data);
    //   this.$store.dispatch("app/setBus", {
    //     name: "sse_" + data.Messages[0].Values.obj,
    //     data: JSON.parse(data.Messages[0].Values.rowdata)
    //   });
    // };
    // this.sseConnect.onerror = (e) => {
    //   console.log("sse disconnect");
    //   this.sseConnect.close();
    //   this.connectSse();
    // };
  }
  private beforeDestroy() {
    console.log("sse close");
    this.sseConnect.close();
  }
  @Watch("countLoaded")
  private watchCountLoaded(): void {
    // управление окном загрузки вкл/выкл
    if (this.countLoaded > 0) {
      this.startLoader(this.$store.state.app.opacityLoad); // выставляем полупрозрачность
    } else {
      this.stopLoader();
    }
  }
  get countLoaded() {
    return this.$store.getters["app/getLoading"]; // отслеживаем загрузку модулей
  }
  private startLoader(val: any): void {
    this.hellopreloaderStatus = true;
    this.hellopreloader.style.display = "block";
    const interhellopreloader = setInterval(() => {
      if ( !this.hellopreloaderStatus ) {
        clearInterval(interhellopreloader);
      }
      this.hellopreloader.style.opacity = parseFloat(this.hellopreloader.style.opacity) + 0.05;
      if (this.hellopreloader.style.opacity >= val) {
        clearInterval(interhellopreloader);
      }
    }, 16);
  }
  private stopLoader(): void {
    this.hellopreloaderStatus = false;
    const interhellopreloader2 = setInterval(() => {
      if ( this.hellopreloaderStatus ) {
        clearInterval(interhellopreloader2);
      }
      this.hellopreloader.style.opacity = parseFloat(this.hellopreloader.style.opacity) - 0.05;
      if (this.hellopreloader.style.opacity <= 0.05) {
        clearInterval(interhellopreloader2);
        this.hellopreloader.style.display = "none";
      }
    }, 16);
  } */
  });
  export default App;
</script>
<style type="text/css" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}
</style>