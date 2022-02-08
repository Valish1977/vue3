<template>
  <div>
    <el-date-picker
      style="width:100%"
      :placeholder="compParam('placeholder')"
      :format="t('filters.components.CompDate.formatTemplate')"
      :value-format="t('filters.components.CompDate.formatTemplateValue')"
      @input="fieldChange()"
      v-model="fieldText"
    ></el-date-picker>
  </div>
</template>
<script lang="ts">
import { Data } from "@/enums/enum_other";
import { defineComponent, onMounted, onUpdated, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const CompDate = defineComponent({
  props: {
    setValue: {
      type: String,
      default: null
    },
    setIndex: {
      type: Number,
      default: null
    },
    setParam: {
      type: Object,
      default: null
    }
  },
  setup(props, {emit}){

  const { t } = useI18n();
    const param: Data = {
      placeholder: ""
    };

    const fieldText = ref<string>(props.setValue);

    onUpdated(() => {
      emit("beforeUpdate", props.setIndex);
    });
    onMounted(() => {
      fieldText.value = props.setValue;
      fieldChange();
      emit("beforeMount", props.setIndex);
    });

    watch(() => props.setValue, () => {
      fieldText.value = props.setValue;
      fieldChange();
    });

    const fieldChange = (): void => {
      emit("getDataField", {
        value: fieldText.value,
        index: props.setIndex
      });
    }
    const compParam = (name: string): any => {
      if (props.setParam[name] === undefined) {
        return param[name];
      }
      return props.setParam[name];
    }
    return {
      t,
      fieldChange,
      compParam,
      fieldText
    }
  }
});
export default CompDate;
</script>