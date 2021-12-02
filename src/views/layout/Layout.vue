<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar}">
    <div 
      class="sidebar-container"
      :class="$store.getters['app/windowWidth'] < 768 ? 'is-mobile' : ''"
    >
      <div class="scroll-container" ref="scrollContainer" @wheel.prevent="handleScroll">
        <div class="scroll-wrapper" ref="scrollWrapper" :style="{top: top + 'px'}">
          <el-menu
            mode="vertical"
            :default-active="$route.path"
            :collapse="isCollapse"
            background-color="#304156"
            text-color="#bfcbd9"
            active-text-color="#409EFF"
            :class="$store.getters['app/windowWidth'] < 768 ? 'is-mobile' : ''"
          >
            <div class="menu-wrapper">
                <el-menu-item
                  v-for="item in routes[0].children" :key="item.name"
                    :index="item.path"
                    @click="setRouter(item.path)"
                    :class="{'submenu-title-noDropdown':!isNest, 'is-mobile': $store.getters['app/windowWidth'] < 768}"
                  >
                    <i :class="item.meta.icon"></i>
                    <font-awesome-icon :icon="item.meta.icon"/>
                    <el-badge
                      style="position:absolute; top:-7px; right:7px"
                      v-if="item.meta.badge"
                      is-dot
                      class="item"
                    ></el-badge>
                    <span style="margin-left:15px">{{$t(item.meta.pageName)}}</span>
                  </el-menu-item>
              <el-menu-item v-if="$store.getters['app/windowWidth'] < 768"
                @click="toggleSideBar"
                :class="{'submenu-title-noDropdown':!isNest, 'is-mobile': $store.getters['app/windowWidth'] < 768}"
              >
                <font-awesome-icon icon="arrow-left"/>
                <span style="margin-left:15px">{{$t('routes.hideSedeBar')}}</span>
              </el-menu-item>
            </div> -->
          </el-menu>
        </div>
      </div>
    </div>
    <div 
      class="main-container"
      :class="$store.getters['app/windowWidth'] < 768 ? 'is-mobile' : ''"
    >
      <el-menu class="navbar" mode="horizontal">
        <el-row>
        <el-col :span="16" style=" white-space: nowrap; overflow: hidden">
            <font-awesome-icon @click="toggleSideBar" icon="bars" class="tooltip-btn left-btn"/>
            <span
              style="padding-left:20px; font-size:24px;"
            >{{$t($store.getters.getCurrentRoute.meta.pageName)}}</span>
        </el-col>
        <el-col :span="8" align="right">
					<el-tooltip effect="dark" :content="$t('app.info')" placement="bottom">
            <span @click="infoDialog = true" style="font-size:10px" >
              <font-awesome-icon icon="info"  class="tooltip-btn right-btn"/>
            </span>
          </el-tooltip>
          <el-tooltip effect="dark" :content="$t('app.fullScreen')" placement="bottom">
            <span @click="fullScreenClick">
              <font-awesome-icon icon="expand-arrows-alt" class="tooltip-btn right-btn"/>
            </span>
          </el-tooltip>
          <el-tooltip effect="dark" :content="$t('app.exit')" placement="bottom">
            <span @click="logout">
              <font-awesome-icon icon="sign-out-alt" class="tooltip-btn right-btn"/>
            </span>
          </el-tooltip>
        </el-col>
        </el-row>
      </el-menu>
      <section class="app-main" style="min-height: 100%">
        <el-col
          :span="24"
          v-loading="getLoading"
          :element-loading-text="$t('app.loadingModules')"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        ></el-col>
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </section>
    </div>
    <!-- <el-dialog :title="$t('info.title')" :visible.sync="infoDialog" width="500px" center>
      <p>{{$t('info.name')}}</p>
      <p>{{$t('info.version')}}{{$VERSION}}</p>
    </el-dialog> -->
  </div>
  
</template>

<script lang="ts">
/* import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import screenfull, { Screenfull } from "screenfull";
import { mapGetters } from "vuex";
import Auth from "@/auth";
const auth = new Auth();
const delta = 15;
@Component({
  computed: {
    ...mapGetters("app", ["getLoading"])
  }
}) */
import { defineComponent } from 'vue';
const Layout = defineComponent({
  data() {
    return {
    }
  },
/*   setup() {
  } */
});
export default Layout;
 /*export default class LayoutAdm extends Vue {
  private getLoading!: any;
  private top: any = 0;
  private routes: any = []; // окно информации
  private sidebar: any = false;
  private isNest: any = false;
  private isFullscreen: any = false;
  private infoDialog: any = false;
  get isCollapse() {
    return !this.$store.getters.getSideBar;
  }
  private created(): any {
    this.$store.dispatch("app/setWindowWidth", window.innerWidth);
    this.sidebar = this.$store.getters.getSideBar;
    this.routes = this.$store.getters.getRoutes(this.$store.getters.getUser.RoleCode);
  }
  private toggleSideBar(): any {
    this.sidebar = !this.sidebar;
    this.$store.dispatch("app/setSideBar", this.sidebar);
  }
  private setRouter(path) {
    if (this.sidebar) {
      this.toggleSideBar();
    }
     this.$router.push({ path });
  }
  private logout(): any {
    auth.logOut();
  }
  private fullScreenClick(): any {
    if ( !( screenfull as Screenfull ).enabled ) {
      this.$message({
        message: this.$t("notice.brouserNotWork") as string,
        type: "warning"
      });
      return false;
    }
    ( screenfull as Screenfull ).toggle();
  }
  private handleScroll(e): any {
    const eventDelta = e.wheelDelta || -e.deltaY * 3;
    const $container: any = this.$refs.scrollContainer;
    const $containerHeight = $container.offsetHeight;
    const $wrapper: any = this.$refs.scrollWrapper;
    const $wrapperHeight = $wrapper.offsetHeight;
    if (eventDelta > 0) {
      this.top = Math.min(0, this.top + eventDelta);
    } else {
      if ($containerHeight - delta < $wrapperHeight) {
        if (this.top < -($wrapperHeight - $containerHeight + delta)) {
          this.top = this.top;
        } else {
          this.top = Math.max(
            this.top + eventDelta,
            $containerHeight - $wrapperHeight - delta
          );
        }
      } else {
        this.top = 0;
      }
    }
  }
  get notifyBus() {
    return this.$store.getters["app/getBusState"]("setNotifyBus");
  }
  @Watch("notifyBus")
  private watchNotifyBus(): void {
    const data = this.$store.getters["app/getBus"]("setNotifyBus");
    if (data.setTimeOut) {
      setTimeout(() => {
        this.$notify({
          title: data.title,
          type: data.type,
          message: data.message
        });
      }, data.setTimeOut);
    } else {
      this.$notify({
        title: data.title,
        type: data.type,
        message: data.message
      });
    }
  } 
}*/
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
@import "../../styles/variables.scss";

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

