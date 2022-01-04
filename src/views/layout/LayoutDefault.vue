<template>
  <router-view></router-view>
</template>
<script lang="ts">
import {defineComponent} from "vue";
const LayoutDefault = defineComponent({});
export default LayoutDefault;
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
@import "src/styles/variables.scss";
.el-menu-item.is-disabled {
  opacity: 1;
  cursor: default;
  svg {
    vertical-align: text-bottom;
  }
  .action-icon {
    cursor: pointer;
    fill: #5a5e66;
    width: 20px;
    height: 20px;
    margin-right: 20px;
  }
}
.app-wrapper {
  .el-badge__content.is-fixed {
    top: 100px !important;
  }
}
.scroll-container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: $menuBg;
  .scroll-wrapper {
    position: absolute;
    width: 100% !important;
  }
}
.tooltip-btn {
  cursor: pointer;
  fill: #5a5e66;
  width: 20px;
  height: 20px;
}
.right-btn {
  margin: 15px 15px 0 0;
}
.left-btn {
  margin: 15px 0 0 15px;
}
.navbar {
  width: 100%;
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .right-menu {
    float: right;
    height: 100%;
    &:focus {
      outline: none;
    }
  }
}
</style>

