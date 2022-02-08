


<template>
  <div>
    <span>
      <slot name="prefix"></slot>
    </span>
    <span style="color: #409eff; padding: 0 15px; cursor: pointer"
      v-for="(item, index) in selfFilters"
      :key="index"
      @click="selectTemplateFn(index)"
    >{{item.name}}</span>
    <span>
      <slot name="postfix"></slot>
    </span>
  </div>
</template>

<script lang='ts'>
import { Data } from "@/enums/enum_other";
import { computed, defineComponent, onMounted, reactive, watch } from "vue";
import { useStore } from "vuex";
import { FILTER_DISPATCH } from "./store/filters";

const ListOfFiltersTemplate  = defineComponent({
  setup() {
    const store = useStore();
    
    const filters = computed(() => store.state.filters.filters);
    const model = computed(() => store.state.filters.model);

    const selfFilters = reactive<Data[]>([]);

    const setQuickSearch = (data: any) => store.dispatch(FILTER_DISPATCH.SET_QUICK_SEARCH, data);

    onMounted(() => {
      setFilters();
    });
    watch(() => filters, () => {
      setFilters();
    });

    const setFilters = () => {
      selfFilters.splice(0, selfFilters.length);
      if (model.value.listOfFiltersParams && model.value.listOfFiltersParams.customFilters) {
        selfFilters.push(...model.value.listOfFiltersParams.customFilters);
      }
      if (model.value.listOfFiltersParams && model.value.listOfFiltersParams.showUserTemplates) {
        selfFilters.push(...filters.value);
      }
    }
    const selectTemplateFn = (index: any): void => {
      const item = selfFilters[index];
      setQuickSearch(item.code);
    }
    return {
      selfFilters,
      selectTemplateFn
    }
}
});
export default ListOfFiltersTemplate;

 /* private listOfFiltersParams: any = {
    showUserTemplates: true, // отообразит пользовательские (редактируемые, удаляемые) фильтры
    customFilters: [ // дополнительно формируем кастомные ( неудаляемые, нередактируемые) фильтры
      {
        name : "Name filter",
        code: [
          {
            component: "CompSelect",
            condition: "eq",
            filter: "price_range_id",
            name: "Standart", // алиас поля value для отображения
            operation: "and",
            value: 1
          }
        ]
      },
      {
        name : "Lux",
        code: [
          {
            component: "CompSelect",
            condition: "eq",
            filter: "price_range_id",
            name: "Lux",
            operation: "and",
            value: 2
          }
        ]
      }
    ]
  }; */
</script>

