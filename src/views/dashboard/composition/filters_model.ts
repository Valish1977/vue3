import { FILTER_DISPATCH } from "@/components/filters/store/filters";
import PropertyApi from "@/domain/api/property";
import UserApi from "@/domain/api/user";
import ThirdCompanyApi from "@/domain/api/thirdCompany";
import { Data } from "@/enums/enum_other";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { DateTime } from "luxon";



const filtersModel = () => {
  const {t} = useI18n();
  const store = useStore();
  const setFilterModel = (data: Data) => store.dispatch(FILTER_DISPATCH.SET_MODEL, data);
  const setReference = (data: Data | string) => store.dispatch(FILTER_DISPATCH.SET_REFERENCE, data);
  const userApi = new UserApi();
  const listOfFiltersParams = {
    showUserTemplates: true,
    customFilters: [
      {
        name : "Today",
        code: [
          {
            component: "CompDate",
            condition: "eq",
            filter: "scheduled_date",
            name: DateTime.local().toISODate(),
            operation: "and",
            value: DateTime.local().toISODate()
          }
        ]
      },
      {
        name : "Tomorrow",
        code: [
          {
            component: "CompDate",
            condition: "eq",
            filter: "scheduled_date",
            name: DateTime.local().plus({days: 1}).toISODate(),
            operation: "and",
            value: DateTime.local().plus({days: 1}).toISODate()
          }
        ]
      },
      {
        name : "Week",
        code: [
          {
            component: "CompDate",
            condition: "gte",
            filter: "scheduled_date",
            name: DateTime.local().toISODate(),
            operation: "and",
            value: DateTime.local().toISODate()
          },
          {
            component: "CompDate",
            condition: "lte",
            filter: "scheduled_date",
            name: DateTime.local().plus({days: 7}).toISODate(),
            operation: "and",
            value: DateTime.local().plus({days: 7}).toISODate()
          }
        ]
      }
    ]
  };

  const filterModel = {
    listOfFiltersParams: listOfFiltersParams,
    header_all: { header: "General data", group_id: 1 },
    id: {
      component: "CompInput",
      group_id: 1,
      text: t("Order.filterModel.id.text"),
      params: {
        textView: t("Order.filterModel.id.text"),
        placeholder: t("Order.filterModel.id.placeholder")
      },
      quickSearch: {
        params: {
          placeholder: t("Order.quickSearch"),
          name: t("Order.quickSearch")
        },
        condition: "eq"
      }
    },
    title: {
      component: "CompInput",
      group_id: 1,
      text: t("Order.filterModel.title.text"),
      params: {
        textView: t("Order.filterModel.title.text"),
        placeholder: t("Order.filterModel.title.placeholder")
      },
      quickSearch: {
        condition: "ilike"
      }
    },
    order_status_id: {
      component: "CompSelect",
      group_id: 1,
      text: t("Order.filterModel.order_status_id.text"),
      params: {
        textView: t("Order.filterModel.order_status_id.text"),
        placeholder: t("Order.filterModel.order_status_id.placeholder"),
        reference: "ref_order_status",
        key: "id"
      }
    },
    order_type_id: {
      component: "CompSelect",
      group_id: 1,
      text: t("Order.filterModel.order_type_id.text"),
      params: {
        textView: t("Order.filterModel.order_type_id.text"),
        placeholder: t("Order.filterModel.order_type_id.placeholder"),
        reference: "ref_order_type",
        key: "id"
      }
    },
    property_id: {
      component: "CompSelect",
      group_id: 1,
      text: t("Order.filterModel.property_id.text"),
      remoteFn: (query: string) => propertySearch(query),
      params: {
        textView: t("Order.filterModel.property_id.text"),
        placeholder: t("Order.filterModel.property_id.placeholder"),
        reference: "property_id",
        key: "id"
      }
    },
    worker_id: {
      component: "CompSelect",
      group_id: 1,
      text: t("Order.filterModel.worker_id.text"),
      remoteFn: (query: string) => workerSearch(query),
      params: {
        textView: t("Order.filterModel.worker_id.text"),
        placeholder: t("Order.filterModel.worker_id.placeholder"),
        reference: "worker_id",
        key: "id"
      }
    },
    third_company_id: {
      component: "CompSelect",
      group_id: 1,
      text: t("Order.filterModel.third_company_id.text"),
      remoteFn: (query: string) => thirdCompanySearch(query),
      params: {
        textView: t("Order.filterModel.third_company_id.text"),
        placeholder: t("Order.filterModel.third_company_id.placeholder"),
        reference: "third_company_id",
        key: "id"
      }
    },
    scheduled_date: {
      component: "CompDate",
      group_id: 1,
      text: t("Order.filterModel.scheduled_dt.text"),
      params: {
        textView: t("Order.filterModel.scheduled_dt.text"),
        placeholder: t("Order.filterModel.scheduled_dt.placeholder")
      }
    },
    due_date: {
      component: "CompDate",
      group_id: 1,
      text: t("Order.filterModel.due_date.text"),
      params: {
        textView: t("Order.filterModel.due_date.text"),
        placeholder: t("Order.filterModel.due_date.placeholder")
      }
    },
    next_arrival_date: {
      component: "CompDate",
      group_id: 1,
      text: t("Order.filterModel.next_arrival_dt.text"),
      params: {
        textView: t("Order.filterModel.next_arrival_dt.text"),
        placeholder: t("Order.filterModel.next_arrival_dt.placeholder")
      }
    },
    start_date: {
      component: "CompDate",
      group_id: 1,
      text: t("Order.filterModel.start_dt.text"),
      params: {
        textView: t("Order.filterModel.start_dt.text"),
        placeholder: t("Order.filterModel.start_dt.placeholder")
      }
    },
    done_date: {
      component: "CompDate",
      group_id: 1,
      text: t("Order.filterModel.done_dt.text"),
      params: {
        textView: t("Order.filterModel.done_dt.text"),
        placeholder: t("Order.filterModel.done_dt.placeholder")
      }
    },
    priority_lvl: {
      component: "CompNumber",
      group_id: 1,
      text: t("Order.filterModel.priority_lvl.text"),
      params: {
        textView: t("Order.filterModel.priority_lvl.text"),
        placeholder: t("Order.filterModel.priority_lvl.placeholder")
      }
    },
    touch_up: {
      component: "CompBool",
      group_id: 1,
      text: t("Order.filterModel.touch_up.prefix"),
      params: {
        textView: t("Order.filterModel.touch_up.prefix"),
        placeholder: t("Order.filterModel.touch_up.prefix"),
        reference: [
          { id: 1, name: t("filters.components.CompBool.true") },
          { id: 2, name: t("filters.components.CompBool.false") }
        ]
      }
    },
    owner_arrival: {
      component: "CompBool",
      group_id: 1,
      text: t("Order.filterModel.owner_arrival.prefix"),
      params: {
        textView: t("Order.filterModel.owner_arrival.prefix"),
        placeholder: t("Order.filterModel.owner_arrival.prefix"),
        reference: [
          { id: 1, name: t("filters.components.CompBool.true") },
          { id: 2, name: t("filters.components.CompBool.false") }
        ]
      }
    },
    charged_from_id: {
      component: "CompSelect",
      group_id: 1,
      text: t("Order.filterModel.charged_from_id.text"),
      params: {
        textView: t("Order.filterModel.charged_from_id.text"),
        placeholder: t("Order.filterModel.charged_from_id.placeholder"),
        reference: "ref_charged_from",
        key: "id"
      }
    }
  };
  setFilterModel(filterModel);


  const propertySearch = async(v: any) => {
    if (v === "") {
      return true;
    }
    let query = "";
    if (Number.isInteger(v)) {
      query = "?and=(del.is.false,id.eq." + v + "))&limit=500";
    } else {
      query =
        "?del=is.false&name=ilike.*" + v + "*&limit=100";
    }
    query += "&select=*";
    const data = await PropertyApi.getItems({filters: query});
    const propertyIdItemsList: any = [];
    if (data) {
      for (const i in data) {
        if (data[i] !== undefined) {
          propertyIdItemsList.push({id: data[i].id, name: data[i].name + " ( " + data[i].full_address + " )"});
        }
      }
    }
    setReference({
      name: "property_id",
      items: propertyIdItemsList
    });
  }
  const workerSearch = async (v: any) => {
    if (v === "") {
      return true;
    }
    let query = "";
    if (Number.isInteger(v)) {
      query = "?role_code=eq.stf_w&and=(del.is.false,id.eq." + v + "))&limit=500";
    } else {
      query =
        "?role_code=eq.stf_w&del=is.false&or=(first_name.ilike.*" +
        v +
        "*,last_name.ilike.*" +
        v +
        "*,email.ilike.*" +
        v +
        "*)&limit=100";
    }
    const data = await userApi.getItems({filters: query});
    const workerIdItemsList: any = [];
    if (data) {
      for (const i in data) {
        if (data[i] !== undefined) {
          workerIdItemsList.push({id: data[i].id, name: data[i].first_name + " " + data[i].last_name});
        }
      }
    }
    setReference({
      name: "worker_id",
      items: workerIdItemsList
    });
  }
  const thirdCompanySearch = async(v: any) => {
    if (v === "") {
      return true;
    }
    let query = "";
    if (Number.isInteger(v)) {
      query = "?and=(del.is.false,id.eq." + v + "))&limit=500";
    } else {
      query =
        "?del=is.false&or=(fname.ilike.*" +
        v +
        "*,sname.ilike.*" +
        v +
        "*,fname.ilike.*" +
        v +
        "*,email.ilike.*" +
        v +
        "*)&limit=100";
    }
    const data = await ThirdCompanyApi.getItems({filters: query});
    const thirdCompanyIdItemsList: any = [];
    if (data) {
      for (const i in data) {
        if (data[i] !== undefined) {
          thirdCompanyIdItemsList.push({id: data[i].id, name: data[i].sname});
        }
      }
    }
    setReference({
      name: "third_company_id",
      items: thirdCompanyIdItemsList
    });
  }
}

export default filtersModel;