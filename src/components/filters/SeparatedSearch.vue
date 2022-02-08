

<template>
  <div>
    <el-form v-if="selfCondition.component" ref="myForm" :model="myForm" @submit.prevent="search()">
      <el-form-item
        style="margin-bottom:0"
        prop="name"
        :rules="[
            { min: 0, max: 250, message: $t('filters.quickSearch.form.name.error'), trigger: ['blur', 'change'] },
            { validator: validateInput, trigger: ['blur', 'change']}
        ]"
      >
          <el-row
            type="flex"
            class="row-bg"
            width="100%"
          >
          <el-col :span="7">
          <el-select
            v-model="fieldIndex"
            @change="
              setDataToObject(selfCondition, Object.assign({}, filterList[fieldIndex]));
              changeValue = ''
            "
            style="width:100%"
          >
            <el-option
              v-for="item in filterList"
              :key="item.key"
              :selected="item.key === fieldIndex"
              :label="item.name"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-col>
            <el-col  :span="windowWidth < 768 ? 15 : 10">
              <el-form-item  style="margin-bottom: 5px">
                <component
                  @getDataField="changeField"
                  :is="selfCondition.component"
                  :setName="selfCondition.filter"
                  :setParam="selfCondition.compParam"
                ></component>
              </el-form-item>
            </el-col>
            <el-col :span="windowWidth < 768 ? 5 : 2">
              <el-button
                  plain
                  type="info"
                  :disabled="isLoading"
                  @click="searchFn()"
              >{{$t("filters.quickSearch.form.send")}}</el-button>
            </el-col>
          </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang='ts'>
import { useStore } from "vuex";
import { defineComponent } from "@vue/runtime-core";
import { FILTER_DISPATCH } from "./store/filters";
import { Data } from "@/enums/enum_other";
import { useI18n } from "vue-i18n";
import { computed, onMounted, reactive, ref } from "vue";
import { APP_GETTERS } from "@/store/modules/app";

const SeparatedSearch = defineComponent({
  props: {
    setParam: {
      type: Object,
      default: null
    }
  },
  setup(props) {
    const store = useStore();
    const { t } = useI18n();

    const isLoading = computed(() => store.state.filters.isLoading);
    const model = computed(() => store.state.filters.model);
    const windowWidth = computed(() => store.getters[APP_GETTERS.WINDOW_WIDTH]);

    const changeValue = ref("");
    const fieldIndex = ref(0);

    const filterList = reactive<Data[]>([]);
    const selfCondition = reactive<Data>({});
    const myForm = reactive<Data>({name: null});

    const setQuickSearch = (arr: Data) => store.dispatch(FILTER_DISPATCH.SET_QUICK_SEARCH, arr);

    const param: Data = {
      placeholder: t("filters.quickSearch.form.name.placeholder")
    };
    
    onMounted(() => {
      fieldIndex.value = 0;
      filterList.splice(0, filterList.length);
      getQuickSearch();
      for (const v in model.value) {
        if ( isIssetSeparatedField(v) ) {
          const condition: any = {};
          if (Array.isArray(model.value[v].separateField)) {
            for (const i in model.value[v].separateField) {
              if (model.value[v].separateField[i] !== undefined) {
                const item = setCondition(v, parseInt(i, 10), filterList.length);
                filterList.push(item);
              }
            }
          } else {
            filterList.push(setCondition(v, 0, filterList.length));
          }
        }
      }
      setDataToObject(selfCondition, Object.assign({}, filterList[fieldIndex.value]));
    });

    const getQuickSearch = () => {
      let quickSearch: any = null;
      for (const v in model.value) {
        if (model.value[v].quickSearch) {
          quickSearch = {
            quickSearch: true,
            selected: true,
            component: "CompInput",
            filter: null,
            key: 0,
            name: "",
            compParam: {placeholder: ""}
          };
          if (model.value[v].quickSearch.params) {
            quickSearch.compParam = model.value[v].quickSearch.params;
            if (model.value[v].quickSearch.params.name) {
              quickSearch.name = model.value[v].quickSearch.params.name;
            }
          }
        }
      }
      if ( quickSearch ) {
        filterList.push(quickSearch);
      }
    }
    const setCondition = (v: string, num: number, key: number) => {
      let item: any;
      if (Array.isArray(model.value[v].separateField)) {
        item = model.value[v].separateField[num];
      } else {
        item = model.value[v].separateField;
      }
      const condition: any = {};
      condition.filter = model.value[v];
      if (model.value[v].value !== undefined) {
        condition.value = model.value[v].value;
      } else {
        condition.value = undefined;
      }
      condition.component = model.value[v].component;
      condition.compParam = model.value[v].params;
      condition.field = v;
      condition.condition = item.condition;
      condition.name = item.name;
      condition.key = key;
      if (item.selected) {
        fieldIndex.value = key;
      }
      return condition;
    }

    const searchFn = (): any => {
      if (changeValue.value === ""  || changeValue.value === null) {
        return;
      }
      const arr: any = [];
      if (selfCondition.quickSearch) {
        // если поле быстрого поиска
        for (const v in model.value) {
          if (model.value[v] !== undefined) {
            let val: any = changeValue.value;
            if (model.value[v].component === "CompNumber") {
              val = Number(changeValue.value);
              if (!Number.isFinite(val)) {
                continue;
              }
            }
            if (model.value[v].quickSearch) {
              arr.push({
                operation: "or",
                condition: model.value[v].quickSearch.condition,
                filter: model.value[v].key,
                component: model.value[v].component,
                value: val
              });
            }
          }
        }
      } else {
        let val: any = Number(changeValue.value);
        if (!Number.isFinite(val)) {
          val = changeValue.value;
        }
        arr.push({
          operation: "and",
          condition: selfCondition.condition,
          filter: selfCondition.filter.key,
          component: selfCondition.component,
          value: val
        });
      }
      if (arr.length > 0) {
        setQuickSearch(arr);
      }
    }
    const setDataToObject = (object: Data, newData: Data) => {
      Object.keys(object).forEach((key: string) => delete object[key]);
      Object.keys(newData).forEach((key: string) => object[key] = newData[key]);
    }

    const validateInput = (rule: any, value: any, callback: (v?: any) => any) => {
      if (value === undefined || value === null || value === "") {
        callback();
        return true;
      }
      const regex = /^[А-Яа-яA-Za-z0-9sS_\.\-]*$/i;
      value = value.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
      if (!regex.test(value)) {
        callback(
          new Error(t("filters.quickSearch.form.name.error1"))
        );
        return true;
      }
    };
    const isIssetSeparatedField = (v: string) => {
      if ( model.value[v] !== undefined &&
      model.value[v].separateField &&
      ((Array.isArray(model.value[v].separateField) && model.value[v].separateField.length > 0) ||
      model.value[v].separateField.condition )) {
        return true;
      }
      return false;
    }
    const changeField = (obj: any): void => {
      const str = obj.value ? obj.value.toString() : "";
      changeValue.value = str.replace(
          /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
          ""
        );
    }
    const typeСast = (v: any) => {
      if (typeof v === "string") {
        if (!!(parseFloat(v) % 1) && v.toString() === parseFloat(v).toString()) {
          return parseFloat(v);
        }
        if (!(parseFloat(v) % 1) && v.toString() === parseInt(v, 10).toString()) {
          return parseInt(v, 10);
        }
      }
      return v;
    }
    const compParam = (name: string): any => {
      if (props.setParam[name] === undefined) {
        return param[name];
      }
      return props.setParam[name];
    }
    return {
      setDataToObject,
      filterList,
      fieldIndex,
      selfCondition,
      windowWidth,
      validateInput,
      changeValue,
      changeField,
      isLoading,
      myForm,
      searchFn
    }
  }
});
export default SeparatedSearch;
</script>