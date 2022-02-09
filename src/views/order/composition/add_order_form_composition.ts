import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";


import { ORDER_FORM_COMMIT, ORDER_FORM_DISPATCH, ORDER_FORM_GETTERS } from "@/store/modules/orderForm";
import type { ElForm } from 'element-plus'
type FormInstance = InstanceType<typeof ElForm>;
import { Data } from "@/enums/enum_other";
import { DateTime } from "luxon";
import OrderApi from "@/domain/api/order";
import { FILTER_GETTERS, FILTER_REFERENCE } from "@/components/filters/store/filters";

const addOrderFormComposition = (
  emit: any,
  setNotify: (v: Data) => void,
  clearData: () => void,
  property: Data,
  client: Data,
  worker: Data,
  thirdCompany: Data
): Data => {
    const store = useStore();
    const { t } = useI18n();

    const myForm = computed(() => store.getters[ORDER_FORM_GETTERS.ITEMS]);
    const save = (data?: Data) => store.dispatch(ORDER_FORM_DISPATCH.SAVE, data);
    const modify = (data: Data) => store.commit(ORDER_FORM_COMMIT.MODIFY, data);
    const reset = () => store.commit(ORDER_FORM_COMMIT.RESET_CHANGES);
    const refOrderStatus = computed(() => store.getters[FILTER_GETTERS.REFERENCE](FILTER_REFERENCE.ORDER_STATUS)?? []);
    const refOrderType = computed(() => store.getters[FILTER_GETTERS.REFERENCE](FILTER_REFERENCE.ORDER_TYPE)?? []);
    const refChargedFrom = computed(() => store.getters[FILTER_GETTERS.REFERENCE](FILTER_REFERENCE.CHANGED_FORM)?? []);
    const componentIsLoading = ref(true);
    

    const setData = (): void => {
      modify({ name: "due_date", data: DateTime.local().toISODate() });
    }
      
      const submitForm = (formEl: FormInstance | undefined): any => {
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
      const resetForm = (formEl?: FormInstance | undefined): void => {
        if (!formEl) return
        reset();
        formEl.resetFields();
      }
    return {
        submitForm,
        setData,
        refChargedFrom,
        refOrderStatus,
        refOrderType

    }
    
}
export default addOrderFormComposition;