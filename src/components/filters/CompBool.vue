<template>
  <div>
    <el-select
      style="width:100%"
      v-model="fieldText"
      :placeholder="compParam('placeholder')"
      @change="fieldChange()"
    >
      <el-option v-for="item in referencesArr" :key="item.id" :value="item.id" :label="item.name"></el-option>
    </el-select>
  </div>
</template>
<script lang="ts">
import { Data } from "@/enums/enum_other";
import { defineComponent, onMounted, onUpdated, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const CompBool = defineComponent({
  props: {
    setValue: {
      type: Boolean,
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

    const fieldText = ref<number>(props.setValue ? 1 : 2);

    const param: Data = {
      placeholder: "",
      reference: ""
    };
    const referencesArr = reactive<Data[]>([
      { id: 1, name: t("filters.components.CompBool.true") },
      { id: 2, name: t("filters.components.CompBool.false") }
    ]);
    
    onUpdated(() => {
      emit("beforeUpdate", props.setIndex);
      setupReference();
    });
    onMounted(() => {
      fieldText.value = props.setValue ? 1 : 2;
      fieldChange();
      emit("beforeMount", props.setIndex);
      setupReference();
    });

    watch(() => props.setValue, () => {
      fieldText.value = props.setValue ? 1 : 2;
      fieldChange();
    });

    const setupReference = (): void => {
      referencesArr.splice(0, referencesArr.length);
      const reference = compParam("reference");
      if (Array.isArray(reference) && reference.length > 0)
      referencesArr.push(...reference);
    }
    const fieldChange = (): void => {
      emit("getDataField", {
        value: (fieldText.value === 1) ? true : false,
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
      referencesArr,
      fieldChange,
      compParam,
      fieldText
    }
  }
});
export default CompBool;
</script>