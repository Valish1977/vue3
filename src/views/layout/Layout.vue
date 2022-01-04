<template>
  <div class="app-wrapper" :class="{ hideSidebar: !sidebar }">
    <div
      class="sidebar-container"
      :class="windowWidth < 768 ? 'is-mobile' : ''"
    >
      <div
        class="scroll-container"
        ref="scrollContainer"
        @wheel.prevent="handleScroll"
      >
        <div
          class="scroll-wrapper"
          ref="scrollWrapper"
          :style="{ top: scrollPosition + 'px' }"
        >
          <el-menu
            mode="vertical"
            :default-active="$route.path"
            background-color="#304156"
            text-color="#bfcbd9"
            active-text-color="#409EFF"
            :class="windowWidth < 768 ? 'is-mobile' : ''"
          >
            <div class="menu-wrapper" v-if="routes && routes[0] && routes[0].children">
              <el-menu-item
                v-for="item in routes[0].children"
                :key="item.name"
                :index="item.path"
                @click="pushRoute(item.path)"
                :class="{
                  'submenu-title-noDropdown': !isNest,
                  'is-mobile': windowWidth < 768,
                }"
              >
                <i :class="item.meta.icon"></i>
                <font-awesome-icon :icon="item.meta.icon" />
                <el-badge
                  style="position: absolute; top: -7px; right: 7px"
                  v-if="item.meta.badge"
                  is-dot
                  class="item"
                ></el-badge>
                <span style="margin-left: 15px">{{
                  t(item.meta.pageName)
                }}</span>
              </el-menu-item>
              <el-menu-item
                v-if="windowWidth < 768"
                @click="sideBarToggle"
                :class="{
                  'submenu-title-noDropdown': !isNest,
                  'is-mobile': windowWidth < 768,
                }"
              >
                <font-awesome-icon icon="arrow-left" />
                <span style="margin-left: 15px">{{
                  t("routes.hideSedeBar")
                }}</span>
              </el-menu-item>
            </div>
          </el-menu>
        </div>
      </div>
    </div>
    <div class="main-container" :class="windowWidth < 768 ? 'is-mobile' : ''">
      <el-menu
        class="navbar"
        mode="horizontal"
        style="justify-content: space-between"
      >
        <el-menu-item disabled>
          <font-awesome-icon
            @click="sideBarToggle"
            icon="bars"
            class="action-icon"
          />
          <span style="font-size: 24px">{{ t(pageName) }}</span>
        </el-menu-item>
        <el-menu-item disabled>
          <el-tooltip effect="dark" :content="t('app.info')" placement="bottom">
            <span @click="infoDialog = true">
              <font-awesome-icon icon="info" class="action-icon" />
            </span>
          </el-tooltip>
          <el-tooltip
            effect="dark"
            :content="t('app.fullScreen')"
            placement="bottom"
          >
            <span @click="fullScreenToggle">
              <font-awesome-icon icon="expand-arrows-alt" class="action-icon" />
            </span>
          </el-tooltip>
          <el-tooltip effect="dark" :content="t('app.exit')" placement="bottom">
            <span @click="logOut">
              <font-awesome-icon
                icon="sign-out-alt"
                class="action-icon"
                style="margin-right: 0"
              />
            </span>
          </el-tooltip>
        </el-menu-item>
      </el-menu>
      <section class="app-main" style="min-height: 100%">
        <el-col
          :span="24"
          v-loading="loadingState"
          :element-loading-text="t('app.loadingModules')"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        ></el-col>
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </section>
    </div>
  </div>
  <el-dialog :title="t('info.title')" v-model="infoDialog" width="500px" center>
    <p>{{ t("info.name") }}</p>
    <p>{{ t("info.version") }}{{ $VERSION }}</p>
  </el-dialog>
</template>
<script lang="ts">
import { mapGetters, useStore } from "vuex";
import { useI18n } from "vue-i18n";
import screenfullComposition from "./composition/screenfull_composition";
import scrollComposition from "./composition/scroll_composition";
import sidebarComposition from "./composition/sidebar_composition";
import routerComposition from "./composition/router_composition";
import authComposition from "@/compositions/auth_composition";
import notificationComposition from "@/compositions/notification_composition";
/* const auth = new Auth(); */
const delta = 15;
import { computed, defineComponent, getCurrentInstance, watch } from "vue";
import { useRouter } from "vue-router";
import { ROUTES_GETTERS } from "@/store/modules/routes";
import { AUTH_GETTERS } from "@/store/modules/auth";
import { APP_GETTERS } from "@/store/modules/app";
const Layout = defineComponent({
  data() {
    return {
      infoDialog: false,
      isNest: false,
    };
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    // const internalInstance = getCurrentInstance();
    const routes = computed(() =>
      store.getters[ROUTES_GETTERS.GET_ROUTES](
        store.getters[AUTH_GETTERS.GET_USER].RoleCode
      )
    );
    const sidebar = computed(() => store.getters[APP_GETTERS.GET_SIDE_BAR]);
    const isCollapse = computed(() => !store.getters[APP_GETTERS.GET_SIDE_BAR]);

    const { t, locale } = useI18n();
    const { logOut } = authComposition();
    const { scrollPosition, handleScroll } = scrollComposition();
    const { fullScreenToggle } = screenfullComposition(t);
    const { sideBarToggle } = sidebarComposition();
    notificationComposition();
    const { pushRoute } = routerComposition(sidebar, sideBarToggle);

    return {
      $VERSION: computed(() => process.env.VUE_APP_VERSION),
      windowidth: computed(() => store.getters[APP_GETTERS.WINDOW_WIDTH]),
      loadingState: computed(() =>
        store.getters[APP_GETTERS.GET_LOADING] > 0 ? true : false
      ),
      pageName: computed(
        () => store.getters[ROUTES_GETTERS.GET_CURRENT_ROUTE].meta.pageName
      ),
      routes,
      t,
      pushRoute,
      fullScreenToggle,
      scrollPosition,
      handleScroll,
      sidebar,
      isCollapse,
      sideBarToggle,
      logOut,
    };
  },
});
export default Layout;
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

