<template>
  <div>
    <span class="str-view">
      <span class="first-text">{{$t('filters.conditionFilter')}}</span>
      <span class="first-text" v-for="(v, index)  in arrView" :key="index">
        <span class="operation" v-if="index != 0">{{$t(v.operation)}}</span>
        <el-tag>{{v.title}} {{$t(v.condition)}} {{v.value}}</el-tag>
      </span>
      (
      <a @click="clearConditions()" class="blue-text">{{$t('filters.reset')}}</a> )
    </span>
  </div>
</template>

<script lang='ts'>
import { computed, defineComponent } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { FILTER_DISPATCH, FILTER_GETTERS } from "./store/filters";

const ListChips = defineComponent({
  setup() {
    const store = useStore();
    const { t } = useI18n();
    const arrView = computed(() => store.getters[FILTER_GETTERS.ARR_VIEW]);
    const setQuickSearch = (data: any) => store.dispatch(FILTER_DISPATCH.SET_QUICK_SEARCH, data);
    const clearConditions = (): void => {
      setQuickSearch([]);
    }
    return {
      arrView,
      clearConditions
    }
  }
});
export default  ListChips;

</script>
<style scoped>
.blue-text {
  color: #409eff;
}
.black-text {
  color: #303133;
}
.str-view {
  font-size: 14px;
}
.str-view .operation {
  color: red;
}
</style>

<style lang="scss">
  .box-card {
    .el-row {
      margin-bottom: 5px;
      .el-col {
        font-size: 12px;
      }
    }
  }
</style>
<style scoped lang="scss">
@mixin position{
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
.custom-divider {
  margin-top: 10px;
  margin-bottom: 5px;
}
.page-component__scroll{
  height: calc(100vh - 90px);
}
.page-component__scroll .el-scrollbar__wrap {
  overflow: scroll;
  overflow-x: hidden;
  overflow-y: auto;
}
.page-component__scroll .el-scrollbar__bar.is-horizontal {
  display:none;
}
.drawer-content {
  margin: 0 15px;
  display: flex;
  flex-direction: column;
  height: 100%;
  .drawer-body {
    flex: 1;
    display: block;
    margin-top: 0em;
  }
  .drawer-footer {
    .footer-body {
      display: flex;
      button {
        flex: 1;
      }
    }
  }
}
.selfForm label.el-form-item__label {
  padding-bottom: 0;
}
</style>