import { computed, reactive, ref } from "vue";
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

const orderFormComposition = (): Data => {
    const store = useStore();
    const { t } = useI18n();
    const userApi = new UserApi();

    const myForm = computed(() => store.getters[ORDER_FORM_GETTERS.ITEMS]);
    const isChanged = computed(() => store.getters[ORDER_FORM_GETTERS.IS_CHANGED]);

    const fts = computed(() => store.getters[ORDER_FORM_GETTERS.FTS]);
    const isLoading = computed(() => store.getters[ORDER_FORM_GETTERS.IS_LOADING]);
    const isSaving = computed(() => store.getters[ORDER_FORM_GETTERS.IS_SAVING]);
    const isVisible = computed(() => store.getters[ORDER_FORM_GETTERS.IS_VISIBLE]);
    
    const refMyForm = ref<FormInstance>();
    const setProcessloadingForm = ref(false);
    const componentIsLoading = ref(true);
    const propertyIdLoading = ref(false);
    const thirdCompanyIdLoading = ref<boolean>(false);
    const workerIdLoading = ref<boolean>(false);

    const property = reactive<Data>({});
    const worker = reactive<Data>({});
    const thirdCompany = reactive<Data>({});
    const propertyIdItemsList = reactive<Data[]>([]);
    const workerIdItemsList = reactive<Data[]>([]);
    const thirdCompanyIdItemsList = reactive<Data[]>([]);
    const rules = reactive<Data>({
        order_type_id: [
          { required: true, message: t('Order.form.order_type_id.error'), trigger: 'change'},
        ],
        scheduled_dt: [
          { required: true, message: t('Order.form.scheduled_dt.error'), trigger: 'input'}
        ],
        due_date: [
          { required: true, message: t('Order.form.due_date.error'), trigger: 'input'},
          { validator: () => validateDate, trigger: ['blur', 'change']}
        ],
        property_id: [
          { required: true, message: t('Order.form.property_id.error'), trigger: 'change' }
        ],
        entry_code: [
          { required: true, message: t('Order.form.entry_code.error'), trigger: 'blur' },
          { min: 1, max: 10, message: t('Order.form.entry_code.error2'), trigger: ['blur', 'change'] }
        ],
        done_dt: [
          { required: true, message: t('Order.form.done_dt.error'), trigger: 'input'},
        ],
        manager: [
          { required: true, message: t('Access.form.manager.error'), trigger: 'input' },
          { min: 1, max: 5, message: t('Access.form.manager.error'), trigger: ['blur', 'change'] }
        ]
    });

    const loadForm = (data?: Data) => store.dispatch(ORDER_FORM_DISPATCH.LOAD, data);
    const modify = (data: Data) => store.commit(ORDER_FORM_COMMIT.MODIFY, data);
    const reset = () => store.commit(ORDER_FORM_COMMIT.RESET_CHANGES);
    const closeForm = () => store.dispatch(ORDER_FORM_DISPATCH.CLOSE);
      
      
      const validateDate = (rule: any, value: any, callback: any) => {
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
      };

      // this if allows you to call hooks once when the composition is called again
    const modifyFn = (data: any, action = null): void => {
      console.log("sdsdsds");
        if (setProcessloadingForm.value) {
          if (action === "trim") {
            data.data = data.data.trim();
          }
          /*       if (data.name === "plan_hour") {
            myForm.value.plan_min = myForm.value.plan_hour * 60;
            modifyFn({name: "plan_min", data: myForm.value.plan_min});
          } */
          modify(data);
          if (data.name === "scheduled_dt") {
            const date = DateTime.fromFormat(
              data.data,
              t("filters.components.CompDateTime.formatTemplateValue") as string
            );
            modify({ name: "due_date", data: date.toISODate()});
            try {
              modify({ name: "scheduled_dt", data: date.toSQL() === null ? data.data: date.toSQL() });
            } catch (e) {
              // console.log(e);
            }
          }
          if (data.name === "next_arrival_dt") {
            const date = DateTime.fromFormat(
              data.data,
              t("filters.components.CompDateTime.formatTemplateValue") as string
            );
            try {
              modify({
                name: "next_arrival_dt",
                data: date.toSQL() === null ? data.data : date.toSQL()
              });
            } catch (e) {
              // console.log(e);
            }
          }
          if (data.name === "canceled" ) {
            if(data.data) {
              modify({ name: "completed", data: false});
            }
            if (data.data || myForm.value.completed) {
              modify({ name: "done_dt", data: DateTime.local().toSQL() });
            } else {
              modify({ name: "done_dt", data: null });
            }
          }
          if (data.name === "completed") {
            if(data.data) {
              modify({ name: "canceled", data: false });
            }
            if (data.data || myForm.value.canceled) {
              modify({ name: "done_dt", data: DateTime.local().toSQL() });
            } else {
              modify({ name: "done_dt", data: null });
            }
          }

          if (data.name === "done_dt") {
            const date = DateTime.fromFormat(
              data.data,
              t("filters.components.CompDateTime.formatTemplateValue") as string
            );
            try {
              modify({ name: "done_dt", data: date.toSQL() === null ? data.data : date.toSQL() });
            } catch (e) {
              // console.log(e);
            }
          }
        }
      }
      

      const propertySearch = async (v: any) => {
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
        propertyIdLoading.value  = true;
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
      const workerSearch = async (v: any) => {
        if (v === "") {
          return true;
        }
        let query = "";
        if (Number.isInteger(v)) {
          query = `?role_code=eq.stf_w&and=(del.is.false,id.eq.${v}))&limit=500`;
        } else {
          query = `?role_code=eq.stf_w&del=is.false&or=(full_name.ilike.*${v}*,email.ilike.*${v}*)&limit=100`;
        }
        workerIdLoading.value  = true;
        const data = await userApi.getItems({ filters: query });
        if (data) {
           workerIdItemsList.splice(0, workerIdItemsList.length);
          for (const i in data) {
            if (data[i] !== undefined) {
              workerIdItemsList.push(data[i]);
            }
          }
        }
        workerIdLoading.value  = false;
      }
      const thirdCompanySearch = async (v: any) => {
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
        thirdCompanyIdLoading.value  = false;
      }

      const resetForm = (formEl: FormInstance | undefined): void => {
        if (!formEl) return
        reset();
        formEl.resetFields();
      }
      const setNotify = ({
        title = "",
        type = "",
        message = "",
        setTimeOut = 0,
        duration = 5000,
        dangerouslyUseHTMLString = false,
      }) => {
        store.dispatch(APP_DISPATCH.SET_BUS, {
          name: APP_BUS_STATE.NOTIFY_BUS,
          data: { title, type, message, setTimeOut, duration, dangerouslyUseHTMLString },
        });
      };
    return {
        resetForm,
        loadForm,
        myForm,
        refMyForm,
        rules,
        componentIsLoading,
        setProcessloadingForm,
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
        thirdCompanySearch
    }
    
}
export default orderFormComposition;