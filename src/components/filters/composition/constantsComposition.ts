import CompDate from "@/components/filters/CompDate.vue";
import CompInput from "@/components/filters/CompInput.vue";
import CompNumber from "@/components/filters/CompNumber.vue";
import CompSelect from "@/components/filters/CompSelect.vue";
import CompSelectCs from "@/components/filters/CompSelectCs.vue";
import CompBool from "@/components/filters/CompBool.vue";
import { Data } from "@/enums/enum_other";
import { useI18n } from "vue-i18n";
import { reactive } from "vue";

const constantsComposition = () => {
    const { t } = useI18n();
    const components: any = {
    // создаем массив фильтров для генерации ответа на лету без загрузки компонентов в DOM (использование в цикле)
    CompInput,
    CompNumber,
    CompDate,
    CompSelect,
    CompSelectCs,
    CompBool
  };
  const componentConditions: Data = {
    CompInput: [0, 5, 7, 8, 9], // ключи из conditionList
    CompNumber: [0, 1, 2, 3, 4, 5],
    CompDate: [0, 1, 2, 3, 4, 5],
    CompSelect: [0, 5],
    CompSelectCs: [10],
    CompBool: [6]
  };
  const defaultCondition: Data = reactive({
    operation: "and",
    condition: null,
    filter: "",
    component: "",
    compParam: "",
    value: ""
  }); // условие по по умолчанию при добавлении
  const conditionList = <Data>[
    { name: "eq", label: t("filters.conditions.eq") },
    { name: "gt", label: t("filters.conditions.gt") },
    { name: "gte", label: t("filters.conditions.gte") },
    { name: "lt", label: t("filters.conditions.lt") },
    { name: "lte", label: t("filters.conditions.lte") },
    { name: "neq", label: t("filters.conditions.neq") },
    { name: "is", label: t("filters.conditions.is") }, // проверка на точное равенство (null,true,false)
    { name: "ilike", label: t("filters.conditions.ilike") },
    { name: "ilike*", label: t("filters.conditions.ilike*") },
    { name: "*ilike", label: t("filters.conditions.*ilike") },
    { name: "cs", label: t("filters.conditions.cs") }
  ];
  return {
      components,
      componentConditions,
      defaultCondition,
      conditionList
  }
}

export default constantsComposition;