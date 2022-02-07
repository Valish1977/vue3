<template>
  <div>
    <el-input
      style="width:100%"
      clearable
      :placeholder="compParam('placeholder')"
      v-model="fieldText"
      @input="fieldChange()"
    ></el-input>
  </div>
</template>
<script lang="ts">
import { Data } from "@/enums/enum_other";
import { defineComponent, onMounted, onUpdated, ref, watch } from "vue";

const CompInput = defineComponent({
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
    const param = <Data>{
      placeholder: ""
    };

    const fieldText = ref(props.setValue);
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
export default CompInput;
</script>