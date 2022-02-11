import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";


import { ORDER_FORM_COMMIT, ORDER_FORM_DISPATCH, ORDER_FORM_GETTERS } from "@/store/modules/orderForm";
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
/* eslint-disable  @typescript-eslint/no-explicit-any */
type EmitType = ((event: string, ...args: any[]) => void) | ((event: string, ...args: any[]) => void);
export default function orderFormComposition(emit: EmitType, getCalendarList: () => Promise<void>): Data {
  const store = useStore();
  const { t } = useI18n();
  const userApi = new UserApi();

  const myForm = computed(() => store.getters[ORDER_FORM_GETTERS.ITEMS]);
  const isChanged = computed(() => store.getters[ORDER_FORM_GETTERS.IS_CHANGED]);

  const fts = computed(() => store.getters[ORDER_FORM_GETTERS.FTS]);
  const isLoading = computed(() => store.getters[ORDER_FORM_GETTERS.IS_LOADING]);
  const isSaving = computed(() => store.getters[ORDER_FORM_GETTERS.IS_SAVING]);
  const isVisible = computed(() => store.getters[ORDER_FORM_GETTERS.IS_VISIBLE]);

  const refOrderStatus = computed(() => store.getters[FILTER_GETTERS.REFERENCE](FILTER_REFERENCE.ORDER_STATUS) ?? []);
  const refOrderType = computed(() => store.getters[FILTER_GETTERS.REFERENCE](FILTER_REFERENCE.ORDER_TYPE) ?? []);
  const refChargedFrom = computed(() => store.getters[FILTER_GETTERS.REFERENCE](FILTER_REFERENCE.CHANGED_FORM) ?? []);


  const refMyForm = ref<FormInstance>();
  const propertyIdLoading = ref(false);
  const thirdCompanyIdLoading = ref<boolean>(false);
  const workerIdLoading = ref<boolean>(false);
  const lrID = ref<string | null>(null);
  const componentIsLoading = ref(true);

  const client = reactive<Data>({});
  const property = reactive<Data>({});
  const worker = reactive<Data>({});
  const thirdCompany = reactive<Data>({});
  const propertyIdItemsList = reactive<Data[]>([]);
  const workerIdItemsList = reactive<Data[]>([]);
  const thirdCompanyIdItemsList = reactive<Data[]>([]);
  const ruleForm = reactive<Data>({
    priority_lvl: 2,
    touch_up: false,
    next_arrival_dt: '',
    owner_arrival: false,
    order_type_id: '',
    charged_from_id: '',
    scheduled_dt: '',
    due_date: '',
    third_company: false,
    worker_id: '',
    third_company_id: '',
    property_id: '',
    entry_code: '',
    canceled: false,
    completed: false,
    done_dt: '',
    manager: '',
    change_comment: ''
  });
  const rules = reactive<Data>({
    order_type_id: [
      { required: true, message: t('Order.form.order_type_id.error'), trigger: 'change' },
    ],
    scheduled_dt: [
      { required: true, message: t('Order.form.scheduled_dt.error'), trigger: 'input' }
    ],
    due_date: [
      { required: true, message: t('Order.form.due_date.error'), trigger: 'input' },
      { validator: () => validateDate, trigger: ['blur', 'change'] }
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

  const loadForm = (data?: Data) => store.dispatch(ORDER_FORM_DISPATCH.LOAD, data);
  const modify = (data: Data) => store.commit(ORDER_FORM_COMMIT.MODIFY, data);
  const reset = () => store.commit(ORDER_FORM_COMMIT.RESET_CHANGES);
  const save = (data?: Data) => store.dispatch(ORDER_FORM_DISPATCH.SAVE, data);
  const closeForm = () => store.dispatch(ORDER_FORM_DISPATCH.CLOSE);
  const setReference = (data: any) =>
    store.dispatch(FILTER_DISPATCH.SET_REFERENCE, data);


  watch(fts, () => {
    setData();
    setTimeout(() => {
      componentIsLoading.value = false;
    }, 500);
  });
  onMounted(() => {
    setReference({ name: "ref_property_type" });
    setReference({ name: "ref_order_type" });
    setReference({ name: "ref_charged_from" });
    loadForm();
  });
  onUnmounted(() => {
    closeForm();
  });

  for (const key of Object.keys(ruleForm)) {
    watch(() => ruleForm[key], () => {
      modifyFn({ name: key, data: ruleForm[key] });
    });
  }

  function validateDate(rule: any, value: any, callback: any): boolean {
    if (myForm.value.due_date === undefined) {
      callback();
    } else if (componentIsLoading.value && myForm.value.due_date === null) {
      callback();
    } else if (!componentIsLoading.value && myForm.value.due_date === null) {
      callback(
        new Error(
          ((t("Order.form.due_date.error2") as string) +
            " " +
            t("filters.components.CompDate.formatTemplate")) as string
        )
      );
    } else {
      const re: any = /^\d\d\d\d-\d\d-\d\d$/;
      if (re.test(myForm.value.due_date)) {
        callback();
      } else {
        callback(new Error(t("Order.form.due_date.error2") as string));
      }
    }
    return true;
  }


  // this if allows you to call hooks once when the composition is called again
  function modifyFn(data: any, action = null): void {
    if (action === "trim") {
      data.data = data.data.trim();
    }
    if (data.name === "scheduled_dt" || data.name === "next_arrival_dt" || data.name === "done_dt") {
      data.data = DateTime.fromJSDate(data.data).toISODate();
    }
    if (data.name === "canceled") {
      if (data.data) {

        emit("setDrawer", {
          open: "InfoOrder",
          close: "AddOrder",
          data: { id: 12 }
        });
        modify({ name: "completed", data: false });
      }
      if (data.data || myForm.value.completed) {
        modify({ name: "done_dt", data: DateTime.local().toSQL() });
      } else {
        modify({ name: "done_dt", data: null });
      }
    }
    if (data.name === "completed") {
      if (data.data) {
        modify({ name: "canceled", data: false });
      }
      if (data.data || myForm.value.canceled) {
        modify({ name: "done_dt", data: DateTime.local().toSQL() });
      } else {
        modify({ name: "done_dt", data: null });
      }
    }
    modify(data);
  }

  function modifyProperty(id: number): void {
    modify({ name: "property_id", data: id });
    for (const v of propertyIdItemsList) {
      if (id === v.id) {
        setDataToObject(property, v);
        setDataToObject(client, v.client);
        modify({ name: "client_id", data: v.client_id });
        modify({ name: "entry_code", data: v.entry_code });
        lrID.value = v.lr_id;
        getCalendarList();
        break;
      }
    }
  }
  function modifyWorker(id: number): void {
    modify({ name: "worker_id", data: id });
    for (const v of workerIdItemsList) {
      if (id === v.id) {
        setDataToObject(worker, v);
        break;
      }
    }
  }
  function modifyThirdCompany(id: number): void {
    modify({ name: "third_company_id", data: id });
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

  function resetForm(formEl?: FormInstance): void {
    if (!formEl) return
    reset();
    formEl.resetFields();
  }

  function clearData(): void {
    // сброс формы
    setDataToObject(property, {});
    setDataToObject(worker, {});
    setDataToObject(thirdCompany, {});
    setDataToObject(client, {});
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
  function setData(): void {
    modify({ name: "due_date", data: DateTime.local().toISODate() });
  }

  function submitForm(formEl?: FormInstance): any {
    if (!formEl) return
    formEl.validate((valid) => {
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
      myForm.value.order_status_id = 1;
      if (
        myForm.value.third_company === null ||
        myForm.value.third_company === false
      ) {
        myForm.value.third_company_id = null;
        modify({
          name: "third_company_id",
          data: myForm.value.third_company_id
        });
        if (myForm.value.worker_id !== null) {
          setOrderStatus = 2;
        }
      } else {
        myForm.value.worker_id = null;
        modify({ name: "worker_id", data: myForm.value.worker_id });
        if (
          myForm.value.third_company_id !== null &&
          myForm.value.third_company_id !== ""
        ) {
          setOrderStatus = 2;
        }
      }
      if (myForm.value.canceled || myForm.value.completed) {
        setOrderStatus = 5;
      } else {
        myForm.value.done_dt = null;
        modify({ name: "done_dt", data: myForm.value.done_dt });
      }
      myForm.value.order_status_id = setOrderStatus;
      modify({
        name: "order_status_id",
        data: myForm.value.order_status_id
      });
      if (myForm.value.verified === null) {
        myForm.value.verified = false;
        modify({ name: "verified", data: myForm.value.verified });
      }
      componentIsLoading.value = true;
      OrderApi.insertItem()
        .then((data: any) => {
          const max =
            store.getters["entities/order"]().max("last_Item_flag");
          data.last_Item_flag = max + 1;
          const type: any = refOrderType.value.find(
            (v: any) => v.id === myForm.value.order_type_id
          );
          data.order_type = { name: type.name };
          const status: any = refOrderStatus.value.find(
            (v: any) => v.id === myForm.value.order_status_id
          );
          data.order_status = { name: status.name };
          if (myForm.value.charged_from_id !== null) {
            const charget: any = refChargedFrom.value.find(
              (v: any) => v.id === myForm.value.charged_from_id
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
          save(data);
          clearData(); // сброс данных
          resetForm(); // сброс в store и формы
          close();
          componentIsLoading.value = false;
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
          componentIsLoading.value = false;
          console.log(error);
        });
    });
  }
  return {
    resetForm,
    loadForm,
    myForm,
    ruleForm,
    refMyForm,
    rules,
    componentIsLoading,
    setNotify,
    closeForm,
    modify,
    modifyFn,
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
    isLoading,
    isSaving,
    isVisible,
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