<template>
  <div class="error404">
    <h1>Error 404</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent} from "vue";
import preloadComposition from '@/compositions/preload_composition';
const Error404 = defineComponent({
  data() {
    return {}
  },
  setup() {
    preloadComposition();
  }
});
export default Error404;
</script>