

<template>
  <div>
    <el-form ref="myForm" :model="myForm" @submit.prevent="search()">
      <el-form-item
        style="margin-bottom:0"
        prop="name"
        :rules="[
            { min: 0, max: 250, message: $t('filters.quickSearch.form.name.error'), trigger: ['blur', 'change'] },
            { validator: validateInput, trigger: ['blur', 'change']}
        ]"
      >
        <el-tooltip
          :content="compParam('placeholder')"
          placement="top-end"
          effect="light"
          :show-after="500"
        >
          <el-input
            size="small"
            clearable
            :placeholder="compParam('placeholder')"
            v-model="myForm.name"
          >
            <template #append>
              <el-button
                type="primary"
                :disabled="isLoading"
                @click="search()"
              >
              {{$t("filters.quickSearch.form.send")}}</el-button>
            </template>
          </el-input>
        </el-tooltip>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang='ts'>
/* eslint-disable  @typescript-eslint/no-explicit-any */
import { Data } from "@/enums/enum_other";
import { computed, defineComponent, onMounted, reactive, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { FILTER_DISPATCH } from "./store/filters";

const QuickSearch = defineComponent({
  setup() {
    const store = useStore();
    const { t } = useI18n();
    const isLoading = computed(() => store.state.filters.isLoading);
    const model = computed(() => store.state.filters.model);
    const setQuickSearch = (data: any) => store.dispatch(FILTER_DISPATCH.SET_QUICK_SEARCH, data);
    const myForm = reactive<Data>({ name: null });
    let params: Data = {};
    const param: Data = {
      placeholder: t("filters.quickSearch.form.name.placeholder")
    };
    const validateInput = (rule: any, value: any, callback: (v?: any) => void) => {
      if (value === undefined || value === null || value === "") {
        callback();
        return true;
      }
      const regex = /^[А-Яа-яA-Za-z0-9sS_.-]*$/i;
      value = value.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
      if (!regex.test(value)) {
        callback(
          new Error(t("filters.quickSearch.form.name.error1") as string)
        );
        return true;
      }
    };

    onMounted(() => {
      for (const v in model.value) {
        if (model.value[v].quickSearch && model.value[v].quickSearch.params) {
          params = model.value[v].quickSearch.params;
          break;
        }
      }
    });

    const compParam = (name: string): string => {
      if (params[name] === undefined) {
        return param[name];
      }
      return params[name];
    }
    const search = (): any => {
      if (myForm.name !== "" && myForm.name !== null) {
        const value: any = myForm.name.replace(
          /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
          ""
        );
        if (value === "") {
          return true;
        }
        const arr: any = [];
        for (const v in model.value) {
          if (model.value[v] !== undefined) {
            let val: any = value;
            if (model.value[v].component === "CompNumber") {
              val = Number(value);
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
        if (arr.length > 0) {
          setQuickSearch(arr);
        }
      }
    }

    return {
      validateInput,
      myForm,
      isLoading,
      compParam,
      search
    }
  }
});

export default QuickSearch;
</script>