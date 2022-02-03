<template>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent, Slots} from "vue";
import appPreloadComposition from './composition/app_preload_composition';
import windowWidthComposition from '@/compositions/window_width_composition';
// import appSseComposition from './composition/app_sse_composition';
import { useStore } from "vuex";
interface Data {
  [key: string]: unknown
}

interface SetupContext {
  attrs: Data
  slots: Slots
  emit: (event: string, ...args: unknown[]) => void
  expose: (exposed?: Record<string, any>) => void
}


const AppView = defineComponent({
  data() {
    return {
      apiRoot: this.$API_ROOT,
      sseConnect: null as number | null
    }
  },
  setup(props: Data, context: SetupContext) {
    const store = useStore();
    // appSseComposition();
    appPreloadComposition();
    windowWidthComposition();
    appPreloadComposition();
  }
  });
  export default AppView;
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