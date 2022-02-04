<template>
  <div>
    <el-select
      v-if="store.state.filters.model[compParam('reference')] !== undefined && typeof store.state.filters.model[compParam('reference')].remoteFn === 'function'"
      style="width:100%"
      filterable
      remote
      reserve-keyword
      :remote-method="store.state.filters.model[compParam('reference')].remoteFn"
      v-model="fieldText"
      :placeholder="compParam('placeholder')"
      @change="fieldChange()"
    >
      <el-option v-for="item in reference" :key="item[compParam('key')]" :value="item[compParam('key')]" :label="item[compParam('label')]"></el-option>
    </el-select>
    <el-select
      v-else
      style="width:100%"
      filterable
      v-model="fieldText"
      :placeholder="compParam('placeholder')"
      @change="fieldChange()"
    >
      <el-option v-for="item in reference" :key="item[compParam('key')]" :value="item[compParam('key')]" :label="item[compParam('label')]"></el-option>
    </el-select>
  </div>
</template>
<script lang="ts">
import { Data } from "@/enums/enum_other";
import { computed, defineComponent, onMounted, onUpdated, reactive, ref, watch } from "vue";
import { useStore } from "vuex";
import { FILTER_DISPATCH, FILTER_GETTERS, FILTER_REFERENCE } from "./store/filters";

const CompSelectCs = defineComponent({
  props: {
     setName: {
      type: String,
      default: 0
    },
    setValue: {
      type: Object,
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
    const store = useStore();
    const referencesArr = reactive<Data[]>([]);
    const fieldText = ref(props.setValue);
    const referenceFromStore = computed(() => store.getters[FILTER_GETTERS.REFERENCE](props.setParam.reference));
    const setReference = (data: any) => store.dispatch(FILTER_DISPATCH.SET_REFERENCE, data);
    const setReferenceItems = (data: any) => store.dispatch(FILTER_DISPATCH.SET_ITEMS, data);
    const reference = reactive<Data[]>([]);
    const param = <Data>{
      placeholder: "",
      reference: "",
      key: "id",
      label: "name"
    };

    watch(() => props.setParam?.reference,  () => {
      if (props.setParam?.reference && props.setParam.reference !== "") {
        setReference(props.setParam.reference?? param.reference);
        setupReferenceFn();
      }
    });

    watch(() => props.setValue, () => {
      setDataReference(props.setValue);
      fieldText.value = props.setValue;
      fieldChange();
    });

    watch(referenceFromStore,  () => {
      setupReferenceFn();
    });
    
    const setupReferenceFn = () => {
      reference.splice(0, reference.length);
      const ref = compParam("reference");
      if (Array.isArray(ref)) {
        reference.push(...ref);
      } else {
        if ( referenceFromStore === undefined ) {
          // обязательная проверка на создание справочника в store (без нее влетаем в цикл)
          setReference({ name: ref });
        }
        const referencesArr = referenceFromStore.value;
        if (compParam("key") !== "id") {
          if (
            store.state.filters.conditions[props.setIndex] !== undefined &&
            store.state.filters.model[
              store.state.filters.conditions[props.setIndex].filter
            ].remoteFn === undefined
            && (referenceFromStore.value[0] === undefined || referenceFromStore.value[0][compParam("key")] === undefined)
          ) {
            console.log(
              "CompSelectCs: В справочнике отсутствует id. Задайте свой key!"
            );
          }
        } else {
          if (compParam("key") !== param.key) {
            const key = compParam("key");
            for (const i in referencesArr) {
              referencesArr[i].id = referencesArr[i][key];
            }
          }
        }
        reference.push(...referencesArr);
      }
    }

    onMounted((): void => {
      fieldText.value = props.setValue;
      fieldChange();
      emit("beforeMount", props.setIndex);
    });

    onUpdated((): void => {
      // проверка и принудительное выставление значения ( при программном изменении значения )
      const item = store.state.filters.conditions[props.setIndex];
      if ( item !== undefined && item.value !== null && item.filter === props.setName) {
        if ( item.value !== props.setValue ) {
          setDataReference(item.value);
          fieldText.value = item.value;
        } else {
          setDataReference(props.setValue);
        }
      } else {
        setDataReference(props.setValue);
      }
      emit("beforeUpdate", props.setIndex);
    });

    

    const setDataReference = (value: any): void => {
      const filter = store.state.filters.conditions[props.setIndex];
      const ref = compParam("reference");
      if ( reference.length === 0) {
         // обязательная проверка на создание справочника в store (без нее влетаем в цикл)
         setReference({ name: ref });
      }
      if (value !== null) {
        let item: any = "undefined";
        if (reference.length > 0) {
          item = reference.find((v: any) => v.id === value);
        }
        if (item === "undefined") {
          let key = "id";
          let label = "label";
          if (compParam("key") !== param.key) {
            key = compParam("key");
          }
          if (compParam("label") !== param.label) {
            label = compParam("label");
          }
          setReferenceItems({name: props.setName, items: [{ [label]: filter[label], [key]: value }]});
        }
      }
    }

    const fieldChange = (): void => {
      const item = reference.find((v: any) => v[compParam("key")] === fieldText.value);
      let label = "label";
      if (compParam("label") !== param.label) {
        label = compParam("label");
      }
      if (item !== undefined && item[label] !== undefined) {
        emit("getDataField", { value: fieldText.value, index: props.setIndex , name: item[label]});
      } else {
        emit("getDataField", { value: fieldText.value, index: props.setIndex});
      }
    }
    const compParam = (name: string): any => {
      if (props.setParam[name] === undefined) {
        return param[name];
      }
      return props.setParam[name];
    }

    return {
      store,
      compParam,
      setReferenceItems,
      reference,
      fieldText
    }
  }
});
export default CompSelectCs;
</script>