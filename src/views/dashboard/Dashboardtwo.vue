<template>
  <div
    class="components-container"
    :style="
       windowWidth < 768
        ? 'margin-right: 15px; margin-left: 15px'
        : ''
    "
  >222
  </div>
</template>

<script lang='ts'>

import { computed, defineComponent, onMounted } from 'vue';
import { useStore } from 'vuex';
import { ROUTES_GETTERS } from '@/store/modules/routes';
import { APP_DISPATCH, APP_GETTERS } from '@/store/modules/app';
const Dashboardtwo = defineComponent({
  setup() {
    const store = useStore();
    const currentRoute = computed(() => store.getters[ROUTES_GETTERS.GET_CURRENT_ROUTE]);
    const windowWidth = computed(() => store.getters[APP_GETTERS.WINDOW_WIDTH]);
    onMounted((): void => {
        store.dispatch(APP_DISPATCH.SET_LOADING,
          {name: currentRoute.value.fullPath + ": after mounted component", value: false}
        ); // убираем окно после загрузки роута
    });

    return {
      windowWidth
    }
  }
});
export default Dashboardtwo;
</script>
<style lang="scss">
.box-card {
  .el-card__body {
    padding: 5px;
    .text.item {
      margin-bottom: 5px;
      background-color: rgb(236, 245, 255);
      padding: 10px 10px 1px 10px;
      button {
        padding: 0;
        margin: 0;
      }
    }
  }
  .el-row {
    margin-bottom: 5px;
    .el-col {
      font-size: 12px;
    }
  }
}
</style>
<style scoped lang="scss">
@mixin position {
  top: 0;
  right: 0;
  position: fixed;
  z-index: 999;
}
.bar {
  &__side-bar-bg {
    @include position();
    height: 100%;
    width: 10px;
    background-color: #304156;
    &.is-mobile {
      width: 0px;
    }
  }
  &__btn-list {
    @include position();
    top: 70px;
    transform: translate(0, -50%);
  }
  &__btn {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
    .el-button--primary {
      background-color: #304156;
      border-color: #304156;
      padding-left: 10px;
      padding-right: 15px;
    }
  }
}
</style>