<template>
  <div
    class="components-container"
    :style="
      windowWidth < 768
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
      <el-col :span="windowWidth < 768 ? 16 : 12">
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
        v-for="t in orderStatusRef.filter((f) => f.id !== 5 && f.id !== 7)"
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
                    <el-button @click="setInfoToDrawer(v)" type="text">{{$t('Access.infoCard')}}</el-button>
                  </el-col>
                </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
    </el-scrollbar>
    <el-row :gutter="20" justify="space-around">
      <el-col :span="windowWidth < 768 ? 24 : 19">
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
        :span="windowWidth < 768 ? 24 : 5"
        :style="windowWidth < 768 ? 'margin: 15px 0 30px 0' : ''"
        align="right"
      >
        <el-button
          style="width: 140px"
          plain
          @click="createExcel()"
          >{{ $t("excel.export") }} <i class="el-icon-setting el-icon-right"></i
        ></el-button>
      </el-col>
    </el-row>
    <export-exel></export-exel>
    <div class="bar__index">
      <div
        class="bar__side-bar-bg"
        :class="{ 'is-mobile': windowWidth < 768 }"
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
            >{{ btnText }}<span v-if="btnText === ''">{{$t('Order.addOrder')}}</span></el-button
          >
        </div>
      </div>
    </div>
    <!-- :wrapperClosable="false" -->
    <el-drawer
      v-model="drawer"
      :show-close="false"
      :close-on-click-modal="!showBack"
      :close-on-press-escape="!showBack"
      :modal="false"
      :before-close="handleClose"
      :size="`${windowWidth < 768 ? windowWidth : 768}px`"
      direction="rtl"
      destroy-on-close
    >
      <template #title>
        <div>
          <span
            style="cursor: pointer; padding-right: 15px"
            v-if="showBack && isDialog"
            @click="setDrawer({ open: 'InfoOrder', close: drawerComponent })"
          >
            <el-icon><back /></el-icon>
          </span>
          {{ drawerTitle }}
          <button
            @click="setDrawer()"
            style="position: absolute; right: 15px; top: 15px"
            aria-label="close drawer"
            type="button"
            class="el-drawer__close-btn"
          >
            <el-icon :size="24"><close /></el-icon>
          </button>
        </div>
      </template>
      <keep-alive>
      <Suspense>
        <template #default>
           <component
            :is="drawerComponent"
            :parametrs="dialogInfo"
            @setDrawer="setDrawer"
          ></component>
        </template>
        <template #fallback>
           <el-col v-loading="true" style="width: 100%; height: 100%;"></el-col>
        </template> 
      </Suspense>
      
      </keep-alive>
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
import filtersModel from './composition/filters_model';
import dateConvert from './composition/date_convert';
import excelModel from './composition/excel_model';
/* import { verified } from "@/api/order"; */
import { computed, defineAsyncComponent, defineComponent, onMounted, reactive, ref, watch } from 'vue';
import { ROUTES_GETTERS } from '@/store/modules/routes';
import { useStore } from 'vuex';
import { APP_DISPATCH, APP_GETTERS } from '@/store/modules/app';
import { Data } from "@/enums/enum_other";
import OrderDb from '@/store/models/OrderDb';
import { ORDER_DB_DISPATCH } from '@/store/modules/orderDb';
import { useI18n } from "vue-i18n";
import { FILTER_GETTERS, FILTER_REFERENCE } from '@/components/filters/store/filters';
import { Back, Close } from '@element-plus/icons-vue';
import CompFilter from "@/components/filters/CompFilter.vue";
import QuickSearch from "@/components/filters/QuickSearch.vue";
import ListOfFiltersTemplate from "@/components/filters/ListOfFiltersTemplate.vue";
import ListChips from "@/components/filters/ListChips.vue";
import ExportExel from "@/components/excel/ExportExel.vue";
const AddOrder = defineAsyncComponent(() =>
  import("@/views/order/AddOrder.vue"),
)

const Dashboard = defineComponent({
  data() {
    return {
    }
  },
  components: {
    Back,
    Close,
     AddOrder,
    /*EditOrder,
    InfoOrder,
    DelOrder, */
    CompFilter,
    QuickSearch,
    ExportExel,
    ListOfFiltersTemplate,
    ListChips
  },
  setup() {
    const store = useStore();
    const {t} = useI18n();
    const drawer = ref(false);
    const showBack = computed(() =>  ["DelOrder", "EditOrder"].indexOf(drawerComponent.value) !== -1);
    const showVModal = computed(() =>  ["DelOrder", "EditOrder", "AddOrder"].indexOf(drawerComponent.value) !== -1);
    const drawerComponent = ref("");
    const dialogInfo = reactive<Data>({});
    const drawerTitle = ref("");
    const isDialog = computed(() => Object.keys(dialogInfo).length > 0);
    const tableItems = computed(() => OrderDb.query().orderBy("last_Item_flag", "desc").orderBy("name", "asc").get().map((item: OrderDb) => item.$toJson));
    const windowWidth = computed(() => store.getters[APP_GETTERS.WINDOW_WIDTH]);
    const orderStatusRef = computed(() => store.getters[FILTER_GETTERS.REFERENCE](FILTER_REFERENCE.ORDER_STATUS)?? []);

    const {getDateTime, getDate} = dateConvert();
    const btnText = ref("");
    
    const { 
      filterStrQuery,
     } = filtersModel();

    const {createExcel} = excelModel(getDate, getDateTime);
    

    watch(filterStrQuery, () => {
      store.dispatch(APP_DISPATCH.SET_PAGINATION_DATA, {
        paginationName: "currentRoute",
        name: "page",
        data: 1
      });
      setQuery();
    });

    onMounted(() => {
      setQuery();
      store.dispatch(APP_DISPATCH.SET_LOADING, {
        name:
          store.getters[ROUTES_GETTERS.GET_CURRENT_ROUTE].fullPath +
          ": after mounted component",
        value: false
      }); // убираем окно после загрузки роута
    });
    /* TODO: snippet DateTime правильный вывод даты с учетом
    горячей подмены через внесение изменений через стор*/
    /* eslint-disable-next-line no-unused-vars */
    const handleClose = (done: any) => {
      if (!showBack.value && isDialog.value) {
        setDrawer();
      }
    }
    const setDataToObject = (object: Data, newData: Data) => {
      Object.keys(object).forEach((key: string) => delete object[key]);
      Object.keys(newData).forEach((key: string) => object[key] = newData[key]);
    }
    const setDrawer = (v: Data | null = null) => {
      if (v === null) {
        setDataToObject(dialogInfo, {});
        drawer.value = false;
      }
      if (v) {
        if (v.data && v.data.id) {
          const items = OrderDb.query().find(v.data.id);
          setDataToObject(dialogInfo, Object.assign({tabNum: "1"}, items?.$toJson));
        }
        switch (v.open) {
          case "InfoOrder": 
            drawer.value = true;
            drawerTitle.value = t("Order.orderInfo") as string;
            drawerComponent.value = "InfoOrder";
            break;
          case "AddOrder": 
            drawer.value = true;
            drawerTitle.value = t("Order.addOrder") as string;
            drawerComponent.value = "AddOrder";
            break;
          case "EditOrder": 
            drawer.value = true;
            drawerTitle.value = t("Order.editOrder") as string;
            drawerComponent.value = "EditOrder";
            break;
          case "DelOrder": 
            drawer.value = true;
            drawerTitle.value = t("Order.del.title") as string;
            drawerComponent.value = "DelOrder";
            break;
          default:
        }
        return;
      }
      drawerComponent.value = "";
      drawer.value = false;
    }
    const setInfoToDrawer = (row: Data) => {
      setDataToObject(dialogInfo, Object.assign({}, row));
      setDrawer({ open: "InfoOrder" });
    }
    const setQuery = (): void => {
      store.dispatch(ORDER_DB_DISPATCH.CREATE_ORDER, {
        filters: `?${filterStrQuery.value}${(filterStrQuery.value === "" ? "" : "&")}` +
        `limit=${store.getters[APP_GETTERS.GET_PAGINATION_DATA]("currentRoute").limit}` +
        `&offset=${store.getters[APP_GETTERS.GET_PAGINATION_DATA]("currentRoute").offset}` +
        `&select=*,charged_from:charged_from_id(name),order_type:order_type_id(name),` +
        `order_status:order_status_id(name),property:property_id(name,full_address),` +
        `third_company_obj:third_company_id(fname, sname),worker:worker_id(first_name, last_name),` +
        `client:client_id(last_name,first_name)`,
        paginationName: "currentRoute",
        pagination: true
      });
    }
    return {
      drawer,
      drawerTitle,
      setDrawer,
      setInfoToDrawer,
      getDateTime,
      createExcel,
      drawerComponent,
      dialogInfo,
      windowWidth,
      showBack,
      isDialog,
      orderStatusRef,
      tableItems,
      showVModal,
      btnText,
      handleClose
    }

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