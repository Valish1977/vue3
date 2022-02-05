<template>
  <div
    class="components-container"
    :style="
      $store.getters['app/windowWidth'] < 768
        ? 'margin-right: 15px; margin-left: 15px'
        : ''
    "
  >
    <el-row
      type="flex"
      class="row-bg"
      justify="space-between"
      style="
        margin: -20px 0 20px 0;
        border-bottom: 1px solid #e6e6e6;
        padding-bottom: 9px;
        text-align: right;
      "
    >
      <el-col :span="$store.getters['app/windowWidth'] < 768 ? 16 : 12">
        <quick-search></quick-search>
      </el-col>
    </el-row>
    <el-row :gutter="20" justify="end">
      <el-col :span="24">
        <list-chips></list-chips>
      </el-col>
      <el-col :span="24" style="padding: 15px 10px; font-size: 14px">
        <list-of-filters-template>
          <template #prefix>
            <span>{{ $t("filters.prefix") }}</span>
          </template>
          <template #postfix>
            <comp-filter>
              <span style="color: #409eff; padding: 0 15px; cursor: pointer">{{
                $t("filters.advancedFilter")
              }}</span>
            </comp-filter>
          </template>
        </list-of-filters-template>
      </el-col>
    </el-row>
    <el-scrollbar>
    <el-row
      :gutter="20"
      style="width: 100%"
      type="flex"
      justify="space-between">
      <el-col
        v-for="t in this.references.ref_order_status.filter((f) => f.id !== 5 && f.id !== 7)"
        :key="t.id"
      >
        <el-card style="margin-bottom: 15px;" class="box-card">
          <template  #header>
            <div class="clearfix" >
              <span>{{ t.name }}</span>
            </div>
          </template>
          <div class="text item" v-for="v in tableItems.filter((v) => v.order_status_id === t.id)"
              :key="v.id">
                <p style="margin: 0" align="right">{{v.id}}</p>
                <strong>{{v.property.name}}</strong><br />
                <span style="font-size: 12px">{{v.property.full_address}}</span><br />
                <span style="font-size: 12px; font-weight: bold">{{v.title}}</span><br />
                <span style="font-size: 12px; color: grey">{{getDateTime(v.saved)}}</span>
                <el-row>
                  <el-col :span="24" align="right">
                    <el-button @click="setDrawerInfo(v)" type="text">{{$t('Access.infoCard')}}</el-button>
                  </el-col>
                </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
    </el-scrollbar>
    <el-row :gutter="20" justify="space-around">
      <el-col :span="$store.getters['app/windowWidth'] < 768 ? 24 : 19">
      <el-scrollbar>
        <el-pagination
          background
          @size-change="
            (val) => {
              $store.dispatch('app/setPaginationData', {
                paginationName: 'currentRoute',
                name: 'limit',
                data: val,
              });
              setQuery();
            }
          "
          @current-change="
            (val) => {
              $store.dispatch('app/setPaginationData', {
                paginationName: 'currentRoute',
                name: 'page',
                data: val,
              });
              setQuery();
            }
          "
          :current-page="
            $store.getters['app/getPaginationData']('currentRoute').page
          "
          :page-sizes="
            $store.getters['app/getPaginationData']('currentRoute').pageSize
          "
          :page-size="
            $store.getters['app/getPaginationData']('currentRoute').limit
          "
          layout="total, sizes, prev, pager, next"
          :total="$store.getters['app/getPaginationData']('currentRoute').total"
        ></el-pagination>
      </el-scrollbar>
      </el-col>
      <el-col
        :span="$store.getters['app/windowWidth'] < 768 ? 24 : 5"
        :style="$store.getters['app/windowWidth'] < 768 ? 'margin: 15px 0 30px 0' : ''"
        align="right"
      >
        <el-button
          size="mini"
          style="width: 140px"
          plain
          @click="
            $store.dispatch('excel/SET_EXCEL_DATA', {
              name: 'data',
              data: paramsExcel,
              params: { settings: true, group: 'allData', key: 'allData' },
            })
          "
          >{{ $t("excel.export") }} <i class="el-icon-setting el-icon-right"></i
        ></el-button>
      </el-col>
    </el-row>
    <export-exel></export-exel>
    <div class="bar__index">
      <div
        class="bar__side-bar-bg"
        :class="{ 'is-mobile': $store.getters['app/windowWidth'] < 768 }"
      ></div>
      <div class="bar__btn-list">
        <div
          class="bar__btn"
          @mouseover="btnText = $t('Order.addOrder')"
          @mouseout="btnText = ''"
        >
          <el-button
            @click="setDrawer({ open: 'AddOrder', close: drawerComponent })"
            type="primary"
            size="mini"
            >{{ btnText }}<span v-if="btnText === ''">{{$t('Order.addOrder')}}</span></el-button
          >
        </div>
      </div>
    </div>
    <!-- :wrapperClosable="false" -->
    <el-drawer
      v-model="drawer"
      :show-close="false"
      :wrapperClosable="!showBack"
      :modal="false"
      :visible="visibleDrawer"
      :before-close="handleClose"
      :size="
        ($store.getters['app/windowWidth'] < 768
          ? $store.getters['app/windowWidth']
          : 768) + 'px'
      "
      direction="rtl"
      destroy-on-close
    >
      <template #title>
        <div>
          <span
            style="cursor: pointer; padding-right: 15px"
            v-if="showBack && dialogInfo"
            @click="setDrawer({ open: 'InfoOrder', close: drawerComponent })"
          >
            <i class="el-icon-back"></i>
          </span>
          {{ drawerTitle }}
          <button
            @click="setDrawer()"
            style="position: absolute; right: 15px; top: 15px"
            aria-label="close drawer"
            type="button"
            class="el-drawer__close-btn"
          >
            <i class="el-dialog__close el-icon el-icon-close"></i>
          </button>
        </div>
      </template>
      <component
        :is="drawerComponent"
        :parametrs="dialogInfo"
        @setDrawer="setDrawer"
      ></component>
    </el-drawer>
    <div
      v-show="showVModal"
      class="v-modal"
      tabindex="0"
      style="z-index: 1002; opacity: 0.2"
    ></div>
  </div>
</template>

<script lang='ts'>
import { DateTime, Interval } from "luxon";
import AddOrder from "@/views/order/AddOrder.vue";
import EditOrder from "@/views/order/EditOrder.vue";
import InfoOrder from "@/views/order/InfoOrder.vue";
import DelOrder from "@/views/order/DelOrder.vue";
import CompFilter from "@/components/filters/CompFilter.vue";
import QuickSearch from "@/components/filters/QuickSearch.vue";
import ListOfFiltersTemplate from "@/components/filters/ListOfFiltersTemplate.vue";
import ListChips from "@/components/filters/ListChips.vue";
import ExportExel from "@/components/excel/ExportExel.vue";
import filtersModel from './composition/filters_model';
/* import { verified } from "@/api/order"; */
import { computed, defineComponent, onMounted, ref } from 'vue';
import { ROUTES_GETTERS } from '@/store/modules/routes';
import { useStore } from 'vuex';
import { APP_DISPATCH } from '@/store/modules/app';

const Dashboard = defineComponent({
  data() {
    return {
    }
  },
  setup() {
    const store = useStore();
    const drawer = ref(false);
    const currentRoute = computed(() => store.getters[ROUTES_GETTERS.GET_CURRENT_ROUTE]);

    

    onMounted((): void => {
        store.dispatch(APP_DISPATCH.SET_LOADING,
          {name: currentRoute.value.fullPath + ": after mounted component", value: false}
        ); // убираем окно после загрузки роута
    });
  }
});
export default Dashboard;
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