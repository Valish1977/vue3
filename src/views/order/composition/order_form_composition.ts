import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";

import type { ElForm } from 'element-plus'
type FormInstance = InstanceType<typeof ElForm>;
import { Data } from "@/enums/enum_other";
import { DateTime } from "luxon";
import { APP_BUS_STATE, APP_DISPATCH } from "@/store/modules/app";
import UserApi from "@/domain/api/user";
import PropertyApi from "@/domain/api/property";
import ThirdCompanyApi from "@/domain/api/thirdCompany";
import OrderApi from "@/domain/api/order";
import { FILTER_DISPATCH, FILTER_GETTERS, FILTER_REFERENCE } from "@/components/filters/store/filters";
import { ORDER_DB_GETTERS } from "@/store/modules/orderDb";
import OrderDb from "@/store/models/OrderDb";
/* eslint-disable  @typescript-eslint/no-explicit-any */
type EmitType = ((event: string, ...args: any[]) => void) | ((event: string, ...args: any[]) => void);

interface RuleForm {
  priority_lvl: number | null,
  touch_up: boolean | null,
  next_arrival_dt: Date | null,
  owner_arrival: boolean | null,
  order_status_id: number | null,
  order_type_id: number | null,
  charged_from_id: number | null,
  scheduled_dt: Date | null,
  due_date: Date | null,
  third_company: boolean | null,
  worker_id: number | null,
  third_company_id: number | null,
  property_id: number | null,
  entry_code: string | null,
  canceled: boolean | null,
  completed: boolean | null,
  done_dt: Date | null,
  manager: string | null,
  change_comment: string | null,
  user_id: number | null,
  client_id: number | null,
  order_status_comment: string | null,
  title: string | null,
  checks: boolean | null,
  plan_min: string | null,
  total_sum: string | null,
}

export default function orderFormComposition(emit: EmitType, getCalendarList: () => Promise<void>): Data {
  const store = useStore();
  const { t } = useI18n();
  const userApi = new UserApi();

  const isLoading = ref(true);
  const isChanged = ref(false);
  const fts = ref<string | null>(null);

  const refOrderStatus = computed(() => store.getters[FILTER_GETTERS.REFERENCE](FILTER_REFERENCE.ORDER_STATUS) ?? []);
  const refOrderType = computed(() => store.getters[FILTER_GETTERS.REFERENCE](FILTER_REFERENCE.ORDER_TYPE) ?? []);
  const refChargedFrom = computed(() => store.getters[FILTER_GETTERS.REFERENCE](FILTER_REFERENCE.CHANGED_FORM) ?? []);


  const refMyForm = ref<FormInstance>();
  const propertyIdLoading = ref(false);
  const thirdCompanyIdLoading = ref<boolean>(false);
  const workerIdLoading = ref<boolean>(false);
  const lrID = ref<string | null>(null);
  

  const client = reactive<Data>({});
  const property = reactive<Data>({});
  const worker = reactive<Data>({});
  const thirdCompany = reactive<Data>({});
  const propertyIdItemsList = reactive<Data[]>([]);
  const workerIdItemsList = reactive<Data[]>([]);
  const thirdCompanyIdItemsList = reactive<Data[]>([]);

  const ruleForm = reactive<RuleForm>({
    priority_lvl: null,
    touch_up: null,
    next_arrival_dt: null,
    owner_arrival: null,
    order_status_id: null,
    order_type_id: null,
    charged_from_id: null,
    scheduled_dt: null,
    due_date: null,
    third_company: null,
    worker_id: null,
    third_company_id: null,
    property_id: null,
    entry_code: null,
    canceled: null,
    completed: null,
    done_dt: null,
    manager: null,
    change_comment: null,
    user_id: null,
    client_id: null,
    order_status_comment: null,
    title: null,
    checks: null,
    plan_min: null,
    total_sum: null,
  });

  function setData(): void {
    ruleForm.priority_lvl = 2;
    ruleForm.due_date = DateTime.local().toJSDate();
    setTimeout(() => {
      // задержка нужна для отработки реактивного изменения ruleForm
      isChanged.value = false;
    }, 10);
  }

  const rules = reactive<Data>({
    order_type_id: [
      { required: true, message: t('Order.form.order_type_id.error'), trigger: 'change' },
    ],
    scheduled_dt: [
      { required: true, message: t('Order.form.scheduled_dt.error'), trigger: 'input' }
    ],
    due_date: [
      { required: true, message: t('Order.form.due_date.error'), trigger: 'input' },
    ],
    property_id: [
      { required: true, message: t('Order.form.property_id.error'), trigger: 'change' }
    ],
    entry_code: [
      { required: true, message: t('Order.form.entry_code.error'), trigger: 'blur' },
      { min: 1, max: 10, message: t('Order.form.entry_code.error2'), trigger: ['blur', 'change'] }
    ],
    done_dt: [
      { required: true, message: t('Order.form.done_dt.error'), trigger: 'input' },
    ],
    manager: [
      { required: true, message: t('Access.form.manager.error'), trigger: 'input' },
      { min: 1, max: 5, message: t('Access.form.manager.error'), trigger: ['blur', 'change'] }
    ]
  });

  const setReference = (data: any) => store.dispatch(FILTER_DISPATCH.SET_REFERENCE, data);


  
  onMounted(() => {
    setReference({ name: "ref_property_type" });
    setReference({ name: "ref_order_type" });
    setReference({ name: "ref_charged_from" });
    fts.value = new Date().getTime().toString();
    setData();
    setTimeout(() => {
      isLoading.value = false;
    }, 500);
  });

  onUnmounted(() => {
    clearData();
  });


  // WATCH FIELDS
  watch(() => ruleForm, () => {
    isChanged.value = true;
  }, {deep: true});

  watch(() => ruleForm.scheduled_dt, (value) => {
    const date = value instanceof Date ? DateTime.fromJSDate(value).toISODate() : null;
  });

  watch(() => ruleForm.next_arrival_dt, (value) => {
    const date = value instanceof Date ? DateTime.fromJSDate(value).toISODate() : null;
  });

  watch(() => ruleForm.done_dt, () => {
    const date = ruleForm.done_dt instanceof Date ? DateTime.fromJSDate(ruleForm.done_dt).toISODate() : null;
  });

  watch(() => ruleForm.canceled, () => {
    if (ruleForm.canceled) {
      ruleForm.completed = false;
    }
    if (ruleForm.canceled || ruleForm.completed) {
      ruleForm.done_dt = DateTime.local().toJSDate();
    } else {
      ruleForm.done_dt = null;
    }
  });

  watch(() => ruleForm.completed, () => {
    if (ruleForm.completed) {
      ruleForm.canceled = false;
    }
    if ( ruleForm.completed || ruleForm.canceled) {
      ruleForm.done_dt = DateTime.local().toJSDate();
    } else {
      ruleForm.done_dt = null;
    }
  });

  watch(() => ruleForm.property_id, () => {
    modifyProperty(ruleForm.property_id);
  });

  watch(() => ruleForm.third_company_id, () => {
    modifyThirdCompany(ruleForm.third_company_id);
  });

  watch(() => ruleForm.worker_id, () => {
    modifyWorker(ruleForm.worker_id);
  });

  function modifyProperty(id: number | null): void {
    for (const v of propertyIdItemsList) {
      if (id === v.id) {
        setDataToObject(property, v);
        setDataToObject(client, v.client);
        ruleForm.client_id = v.client_id;
        ruleForm.entry_code = v.entry_code;
        lrID.value = v.lr_id;
        getCalendarList();
        break;
      }
    }
  }

  function modifyWorker(id: number | null): void {
    for (const v of workerIdItemsList) {
      if (id === v.id) {
        setDataToObject(worker, v);
        break;
      }
    }
  }

  function modifyThirdCompany(id: number | null): void {
    for (const v of thirdCompanyIdItemsList) {
      if (id === v.id) {
        setDataToObject(thirdCompany, v);
        break;
      }
    }
  }

  async function propertySearch(v: any) {
    if (v === "") {
      return true;
    }
    let query = "";
    if (Number.isInteger(v)) {
      query = `?and=(del.is.false,id.eq.${v}))&limit=500`;
    } else {
      query = `?del=is.false&name=ilike.*${v}*&limit=100`;
    }
    query += "&select=*,client:client_id(first_name, last_name)";
    propertyIdLoading.value = true;
    const data = await PropertyApi.getItems({ filters: query });
    if (data) {
      propertyIdItemsList.splice(0, propertyIdItemsList.length);
      for (const i in data) {
        if (data[i] !== undefined) {
          propertyIdItemsList.push(data[i]);
        }
      }
    }
    propertyIdLoading.value = false;
  }
  async function workerSearch(v: any) {
    if (v === "") {
      return true;
    }
    let query = "";
    if (Number.isInteger(v)) {
      query = `?role_code=eq.stf_w&and=(del.is.false,id.eq.${v}))&limit=500`;
    } else {
      query = `?role_code=eq.stf_w&del=is.false&or=(full_name.ilike.*${v}*,email.ilike.*${v}*)&limit=100`;
    }
    workerIdLoading.value = true;
    const data = await userApi.getItems({ filters: query });
    if (data) {
      workerIdItemsList.splice(0, workerIdItemsList.length);
      for (const i in data) {
        if (data[i] !== undefined) {
          workerIdItemsList.push(data[i]);
        }
      }
    }
    workerIdLoading.value = false;
  }
  async function thirdCompanySearch(v: any) {
    if (v === "") {
      return true;
    }
    let query = "";
    if (Number.isInteger(v)) {
      query = `?and=(del.is.false,id.eq.${v}))&limit=500`;
    } else {
      query = `?del=is.false&or=(fname.ilike.*${v}*,email.ilike.*${v}*)&limit=100`;
    }
    thirdCompanyIdLoading.value = true;
    const data = await ThirdCompanyApi.getItems({ filters: query });
    if (data) {
      thirdCompanyIdItemsList.splice(0, thirdCompanyIdItemsList.length);
      for (const i in data) {
        if (data[i] !== undefined) {
          thirdCompanyIdItemsList.push(data[i]);
        }
      }
    }
    thirdCompanyIdLoading.value = false;
  }

  

  function clearData(): void {
    // сброс формы
    setDataToObject(property, {});
    setDataToObject(worker, {});
    setDataToObject(thirdCompany, {});
    setDataToObject(client, {});
    fts.value = null;
    resetForm(refMyForm.value);
  }

  function resetForm(formEl: FormInstance | undefined): void {
    if (!formEl) return
    formEl.resetFields();
  }

  function setDataToObject(object: Data, newData: Data) {
    Object.keys(object).forEach((key: string) => delete object[key]);
    Object.keys(newData).forEach(
      (key: string) => (object[key] = newData[key])
    );
  }

  function setNotify({
    title = "",
    type = "",
    message = "",
    setTimeOut = 0,
    duration = 5000,
    dangerouslyUseHTMLString = false,
  }): void {
    store.dispatch(APP_DISPATCH.SET_BUS, {
      name: APP_BUS_STATE.NOTIFY_BUS,
      data: { title, type, message, setTimeOut, duration, dangerouslyUseHTMLString },
    });
  }
  

  function submitForm(formEl: FormInstance | undefined): any {
    if (!formEl) {
      return;
    }
    formEl.validate((valid: boolean | undefined) => {
      // проверка на заполнение геотегов
      // проверка валидности формы
      if (!valid) {
        setNotify({
          title: t("notify.attention") as string,
          type: "warning",
          message: t("notify.errorData") as string
        });
        return false;
      }
      
      let setOrderStatus = 1;
      ruleForm.order_type_id = 1;
      if (
        ruleForm.third_company === null ||
        ruleForm.third_company === false
      ) {
        ruleForm.third_company_id = null;
        if (ruleForm.worker_id !== null) {
          setOrderStatus = 2;
        }
      } else {
        ruleForm.worker_id = null;
        if (
          ruleForm.third_company_id !== null
        ) {
          setOrderStatus = 2;
        }
      }
      if (ruleForm.canceled || ruleForm.completed) {
        setOrderStatus = 5;
      } else {
        ruleForm.done_dt = null;
      }
      ruleForm.order_status_id = setOrderStatus;

      isLoading.value = true;
      
      OrderApi.insertItem()
        .then(async (data: any) => {
          const max = store.getters[ORDER_DB_GETTERS.ITEMS]().max("last_Item_flag");
          data.last_Item_flag = max + 1;
          const type: any = refOrderType.value.find(
            (v: any) => v.id === ruleForm.order_type_id
          );
          data.order_type = { name: type.name };
          const status: any = refOrderStatus.value.find(
            (v: any) => v.id === ruleForm.order_status_id
          );
          data.order_status = { name: status.name };
          if (ruleForm.charged_from_id !== null) {
            const charget: any = refChargedFrom.value.find(
              (v: any) => v.id === ruleForm.charged_from_id
            );
            data.charged_from = { name: charget.name };
          } else {
            data.charged_from = null;
          }
          data.property = {
            name: property.name,
            full_address: property.full_address
          };
          data.client = {
            first_name: client.first_name,
            last_name: client.last_name
          };
          if (data.worker_id !== null) {
            data.worker = {
              first_name: worker.first_name,
              last_name: worker.last_name
            };
          } else {
            data.worker = null;
          }
          if (data.third_company_id !== null) {
            data.third_company_obj = {
              fname: thirdCompany.fname,
              sname: thirdCompany.sname
            };
          } else {
            data.third_company_obj = null;
          }
          await OrderDb.insert( { data } );
          clearData();
          isLoading.value = false;
          setNotify({
            title: t("notify.success") as string,
            type: "success",
            message: t("notify.successText1") as string,
            setTimeOut: 500
          });
          emit("setDrawer", {
            open: "InfoOrder",
            close: "AddOrder",
            data: { id: data.id }
          });
        })
        .catch((error: any) => {
          setNotify({
            title: t("notify.attention") as string,
            type: "error",
            message: t("notify.error") as string
          });
          isLoading.value = false;
          console.log(error);
        });
    });
  }
  return {
    resetForm,
    ruleForm,
    refMyForm,
    rules,
    isLoading,
    setNotify,
    fts,
    propertyIdLoading,
    thirdCompanyIdLoading,
    workerIdLoading,
    property,
    worker,
    thirdCompany,
    propertyIdItemsList,
    workerIdItemsList,
    thirdCompanyIdItemsList,
    isChanged,
    workerSearch,
    propertySearch,
    thirdCompanySearch,
    modifyProperty,
    modifyWorker,
    modifyThirdCompany,
    submitForm,
    setData,
    refChargedFrom,
    refOrderStatus,
    refOrderType,
    lrID
  }

}