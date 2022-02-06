import { EXCEL_DISPATCH } from "@/components/excel/store/excel";
import { FILTER_GETTERS } from "@/components/filters/store/filters";
import { Data } from "@/enums/enum_other";
import { DateTime } from "luxon";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";

const excelModel = (getDate: (v: string) => string, getDateTime: (v: string) => string) => {
    const store = useStore();
    const {t} = useI18n();
    const filterStrQuery = computed(() => store.getters[FILTER_GETTERS.STR_QUERY] );
    const getParamsExcel = () => {
      return {
        name: t(store.getters.getCurrentRoute.meta.pageName),
        types: [ // задаем типы для формирования строк
          /* "multiLineWithoutFiltering", */
          "withConcatenatedArrays"
        ],
        tabs: [
          {
            name: t(store.getters.getCurrentRoute.meta.pageName),
            query:
              `/api/order?${filterStrQuery.value}${filterStrQuery.value === "" ? "" : "&"}
              order=title.asc&select=*,
              order_type:order_type_id(name),
              order_status:order_status_id(name),
              charged_from:charged_from_id(name),
              property:property_id(name, full_address),
              third_company_obj:third_company_id(fname, sname),
              worker:worker_id(first_name, last_name)`,
            fields: [
              {
                field: "id",
                name: t("Order.info.id"),
                enabled: true
              },
              {
                field: "task_json",
                name: t("Order.tableHeader.task_json"),
                fn: (v: any, row: any) => {
                  return  getListTasks(row.task_json);
                },
                enabled: true
              },
              {
                field: "order_status.name",
                name: t("Order.info.order_status"),
                enabled: true
              },
              {
                field: "order_type.name",
                name: t("Order.info.order_type"),
                enabled: true
              },
              {
                field: "charged_from.name",
                name: t("Order.info.charged_from_id"),
                enabled: true
              },
              {
                field: "property_id",
                name: t("Order.info.property"),
                fn: (v: any, row: any) => {
                  return row.property.name;
                },
                enabled: true
              },
              {
                field: "worker_id",
                name: t("Order.info.worker"),
                fn: (v: any, row: any) => {
                  return row.worker !== null ? row.worker.first_name + " " + row.worker.last_name : "";
                },
                enabled: true
              },
              {
                field: "third_company_id",
                name: t("Order.info.third_company_id"),
                fn: (v: any, row: any) => {
                  return row.third_company_obj && row.third_company_obj.sname ? row.third_company_obj.sname : "";
                },
                enabled: true
              },
              {
                field: "scheduled_dt",
                name: t("Order.info.scheduled_dt"),
                fn: (v: any, row: any) => {
                  return getDateTime(v);
                },
                enabled: true
              },
              {
                field: "due_date",
                name: t("Order.info.due_date"),
                fn: (v: any, row: any) => {
                  return getDate(v);
                },
                enabled: true
              },
              {
                field: "next_arrival_dt",
                name: t("Order.info.next_arrival_dt"),
                fn: (v: any, row: any) => {
                  return getDateTime(v);
                },
                enabled: true
              },
              {
                field: "start_dt",
                name: t("Order.info.start_dt"),
                fn: (v: any, row: any) => {
                  return getDateTime(v);
                },
                enabled: true
              },
              {
                field: "done_dt",
                name: t("Order.info.done_dt"),
                fn: (v: any, row: any) => {
                  return getDateTime(v);
                },
                enabled: true
              },
              {
                field: "touch_up",
                fn: (v: any) => {
                  return v ? "✔" : "";
                },
                name: t("Order.info.touch_up"),
                enabled: true
              },
              {
                field: "owner_arrival",
                fn: (v: any) => {
                  return v ? "✔" : "";
                },
                name: t("Order.info.owner_arrival"),
                enabled: true
              },
              {
                field: "total_hour",
                fn: (v: any) => {
                  return v !== null && v > 0 ? v / 60 : "";
                },
                name: t("Order.info.total_hour"),
                enabled: true
              },
              {
                field: "priority_lvl",
                name: t("Order.info.priority_lvl"),
                enabled: true
              }
            ]
          }
        ]
      };
    };
    const createExcel = () => {
        store.dispatch(EXCEL_DISPATCH.SET_EXCEL_DATA, {
            name: 'data',
            data: getParamsExcel(),
            params: { settings: true, group: 'allData', key: 'allData' },
          })
    }
    
    const getListTasks = (tasks: Data[]): string => {
      let str = "";
      for (const v of tasks) {
        str += str !== "" ? ", " : "";
        str +=  v.backlog;
        str += v.done ? ": done" : "";
      }
      return str;
    }
    return {
        createExcel
    }
}
export default excelModel;