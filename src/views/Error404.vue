<template>
  <div class="error404">
    <h1>Error 404</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent} from "vue";
const Error404 = defineComponent({
  data() {
    return {
      
    }
  }
  /* private mounted(): void {
    this.$store.dispatch("app/setLoading",
      {name: this.$store.getters.getCurrentRoute.fullPath + ": after mounted component", value: false}
    ); // убираем окно после загрузки роута
  } */
});
export default Error404;
</script>