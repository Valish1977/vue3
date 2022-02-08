<template>
  <div>
    <el-input-number
      style="width:100%"
      clearable
      :controls="false"
      :placeholder="compParam('placeholder')"
      :min="compParam('min')"
      :max="compParam('max')"
      :precision="compParam('precision')"
      :step="compParam('step')"
      v-model="fieldText"
      @input="fieldChange()"
    ></el-input-number>
  </div>
</template>
<script lang="ts">
import { Data } from "@/enums/enum_other";
import { defineComponent, onMounted, onUpdated, ref, watch } from "vue";

const CompNumber = defineComponent({
  props: {
    setValue: {
      type: Number,
      default: 0
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

    const fieldText = ref<number>(props.setValue);

    const param: Data = {
      placeholder: "",
      min: 0,
      max: 100,
      precision: 1,
      step: 1
    };
    
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
      fieldChange,
      compParam,
      fieldText
    }
  }
});
export default CompNumber;
</script>