<template>
  <el-form
    class="selfForm drawer-content"
    ref="refMyForm"
    :model="myForm"
    :rules="rules"
    label-position="top"
    status-icon
    v-loading="isLoading || isSaving || componentIsLoading"
  >
    <div v-if="isVisible" class="drawer-body">
      <el-row>
        <el-col :span="24">
          <el-scrollbar class="page-component__scroll">
            <el-row>
              <el-col :span="23">
                <el-row :gutter="20">
                  <el-col :span="6">
                    <el-form-item
                      :label="t('Order.form.priority_lvl.prefix')"
                      prop="priority_lvl"
                    >
                      <el-tooltip
                        :content="t('Order.form.priority_lvl.placeholder')"
                        placement="top-end"
                        effect="light"
                      >
                        <el-rate
                          :max="3"
                          :value="myForm.priority_lvl"
                          :colors="colorsRate"
                          @change="
                            (event) =>
                              modifyFn({
                                name: 'priority_lvl',
                                data: event.target.value,
                              })
                          "
                        >
                        </el-rate>
                      </el-tooltip>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" style="padding-top: 26px">
                    <el-form-item prop="touch_up" style="margin-bottom: 0">
                      <el-checkbox
                        style="width: 100%"
                        :value="myForm.touch_up"
                        @change="
                          (event) =>
                            modifyFn({
                              name: 'touch_up',
                              data: event.target.value,
                            })
                        "
                        >{{ t("Order.form.touch_up.placeholder") }}</el-checkbox
                      >
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item
                      :label="t('Order.form.next_arrival_dt.prefix')"
                      prop="next_arrival_dt"
                    >
                      <el-tooltip
                        :content="t('Order.form.next_arrival_dt.placeholder')"
                        placement="top-end"
                        effect="light"
                        :open-delay="500"
                      >
                        <el-date-picker
                          type="datetime"
                          :picker-options="pickerOptionsNextArrival"
                          style="width: 100%"
                          :value="myForm.next_arrival_dt"
                          :placeholder="
                            t('Order.form.next_arrival_dt.placeholder')
                          "
                          :format="
                            t('filters.components.CompDateTime.formatTemplate')
                          "
                          :value-format="
                            t(
                              'filters.components.CompDateTime.formatTemplateValue'
                            )
                          "
                          default-time="12:00:00"
                          @input="
                            (event) =>
                              modifyFn({
                                name: 'next_arrival_dt',
                                data: event.target.value,
                              })
                          "
                        ></el-date-picker>
                      </el-tooltip>
                    </el-form-item>
                  </el-col>
                  <el-col
                    :span="12"
                    style="padding-top: 26px; padding-bottom: 26px"
                  >
                    <el-form-item prop="owner_arrival" style="margin-bottom: 0">
                      <el-checkbox
                        style="width: 100%"
                        :value="myForm.owner_arrival"
                        @change="
                          (event) =>
                            modifyFn({
                              name: 'owner_arrival',
                              data: event.target.value,
                            })
                        "
                        >{{
                          t("Order.form.owner_arrival.placeholder")
                        }}</el-checkbox
                      >
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item
                      :label="t('Order.form.order_type_id.prefix')"
                      prop="order_type_id"
                    >
                      <el-tooltip
                        :content="t('Order.form.order_type_id.placeholder')"
                        placement="top-end"
                        effect="light"
                      >
                        <el-select
                          filterable
                          style="width: 100%"
                          :value="myForm.order_type_id"
                          :placeholder="
                            t('Order.form.order_type_id.placeholder')
                          "
                          @change="
                            (event) =>
                              modifyFn({
                                name: 'order_type_id',
                                data: event.target.value,
                              })
                          "
                        >
                          <el-option
                            v-for="key in refOrderType"
                            :key="key.id"
                            :label="key.name"
                            :value="key.id"
                          ></el-option>
                        </el-select>
                      </el-tooltip>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      :label="t('Order.form.charged_from_id.prefix')"
                      prop="charged_from_id"
                    >
                      <el-tooltip
                        :content="t('Order.form.charged_from_id.placeholder')"
                        placement="top-end"
                        effect="light"
                      >
                        <el-select
                          filterable
                          style="width: 100%"
                          :value="myForm.charged_from_id"
                          :placeholder="
                            t('Order.form.charged_from_id.placeholder')
                          "
                          @change="
                            (event) =>
                              modifyFn({
                                name: 'charged_from_id',
                                data: event.target.value,
                              })
                          "
                        >
                          <el-option
                            v-for="key in refChargedFrom"
                            :key="key.id"
                            :label="key.name"
                            :value="key.id"
                          ></el-option>
                        </el-select>
                      </el-tooltip>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item
                      :label="t('Order.form.scheduled_dt.prefix')"
                      prop="scheduled_dt"
                    >
                      <el-tooltip
                        :content="t('Order.form.scheduled_dt.placeholder')"
                        placement="top-end"
                        effect="light"
                        :open-delay="500"
                      >
                        <el-date-picker
                          type="datetime"
                          :picker-options="pickerOptionsSheduled"
                          style="width: 100%"
                          :value="myForm.scheduled_dt"
                          :placeholder="
                            t('Order.form.scheduled_dt.placeholder')
                          "
                          :format="
                            t('filters.components.CompDateTime.formatTemplate')
                          "
                          :value-format="
                            t(
                              'filters.components.CompDateTime.formatTemplateValue'
                            )
                          "
                          default-time="12:00:00"
                          @input="
                            (event) =>
                              modifyFn({
                                name: 'scheduled_dt',
                                data: event.target.value,
                              })
                          "
                        ></el-date-picker>
                      </el-tooltip>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      :label="t('Order.form.due_date.prefix')"
                      prop="due_date"
                    >
                      <el-tooltip
                        :content="t('Order.form.due_date.placeholder')"
                        placement="top-end"
                        effect="light"
                        :open-delay="500"
                      >
                        <el-date-picker
                          style="width: 100%"
                          :value="myForm.due_date"
                          :placeholder="t('Order.form.due_date.placeholder')"
                          :format="
                            t('filters.components.CompDate.formatTemplate')
                          "
                          :value-format="
                            t('filters.components.CompDate.formatTemplateValue')
                          "
                          @input="
                            (event) =>
                              modifyFn({
                                name: 'due_date',
                                data: event.target.value,
                              })
                          "
                        ></el-date-picker>
                      </el-tooltip>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col
                    :span="12"
                    style="padding-top: 26px; padding-bottom: 26px"
                  >
                    <el-form-item prop="third_company" style="margin-bottom: 0">
                      <el-checkbox
                        style="width: 100%"
                        :value="myForm.third_company"
                        @change="
                          (event) =>
                            modifyFn({
                              name: 'third_company',
                              data: event.target.value,
                            })
                        "
                        >{{
                          t("Order.form.third_company.placeholder")
                        }}</el-checkbox
                      >
                    </el-form-item>
                  </el-col>
                  <el-col
                    v-if="
                      myForm.third_company === null ||
                      myForm.third_company === false
                    "
                    :span="12"
                  >
                    <el-form-item
                      :label="t('Order.form.worker_id.prefix')"
                      prop="worker_id"
                    >
                      <el-tooltip
                        :content="t('Order.form.worker_id.placeholder')"
                        placement="top-end"
                        effect="light"
                      >
                        <el-select
                          popper-class="work-search"
                          filterable
                          remote
                          reserve-keyword
                          :remote-method="workerSearch"
                          style="width: 100%"
                          :value="myForm.worker_id"
                          :placeholder="t('Order.form.worker_id.placeholder')"
                          :loading="workerIdLoading"
                          @change="(event) => modifyWorker(event.target.value)"
                        >
                          <el-option
                            v-for="item in workerIdItemsList"
                            :key="item.id"
                            :label="item.first_name + ' ' + item.last_name"
                            :value="item.id"
                          >
                            <span style="float: left; padding-top: 7px"
                              ><span
                                :data-letters="
                                  item.first_name[0].toUpperCase() +
                                  item.last_name[0].toUpperCase()
                                "
                                >{{ item.first_name }}
                                {{ item.last_name }}</span
                              ></span
                            >
                          </el-option>
                        </el-select>
                      </el-tooltip>
                    </el-form-item>
                  </el-col>
                  <el-col v-if="myForm.third_company === true" :span="12">
                    <el-form-item
                      :label="t('Order.form.third_company_id.prefix')"
                      prop="third_company_id"
                    >
                      <el-tooltip
                        :content="t('Order.form.third_company_id.placeholder')"
                        placement="top-end"
                        effect="light"
                      >
                        <el-select
                          popper-class="third-company-search"
                          filterable
                          remote
                          reserve-keyword
                          :remote-method="thirdCompanySearch"
                          style="width: 100%"
                          :value="myForm.third_company_id"
                          :placeholder="
                            t('Order.form.third_company_id.placeholder')
                          "
                          :loading="thirdCompanyIdLoading"
                          @change="
                            (event) => modifyThirdCompany(event.target.value)
                          "
                        >
                          <el-option
                            v-for="item in thirdCompanyIdItemsList"
                            :key="item.id"
                            :label="item.sname"
                            :value="item.id"
                          >
                            <span style="float: left; padding-top: 7px"
                              ><span
                                :data-letters="item.sname[0].toUpperCase()"
                                >{{ item.sname }}</span
                              ></span
                            >
                          </el-option>
                        </el-select>
                      </el-tooltip>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item
                      :label="t('Order.form.property_id.prefix')"
                      prop="property_id"
                    >
                      <el-tooltip
                        :content="t('Order.form.property_id.placeholder')"
                        placement="top-end"
                        effect="light"
                      >
                        <el-select
                          popper-class="property-search"
                          filterable
                          remote
                          reserve-keyword
                          :remote-method="propertySearch"
                          style="width: 100%"
                          :value="myForm.property_id"
                          :placeholder="t('Order.form.property_id.placeholder')"
                          :loading="propertyIdLoading"
                          @change="
                            (event) => modifyProperty(event.target.value)
                          "
                        >
                          <el-option
                            v-for="item in propertyIdItemsList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                          >
                            <span class="property-item"
                              ><p class="title" style="margin: 0">
                                {{ item.name }}
                              </p>
                              <p class="subtitle" style="margin: 0">
                                {{ item.full_address }}
                              </p></span
                            >
                          </el-option>
                        </el-select>
                      </el-tooltip>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      :label="t('Order.form.entry_code.prefix')"
                      prop="entry_code"
                    >
                      <el-tooltip
                        :content="t('Order.form.entry_code.placeholder')"
                        placement="top-end"
                        effect="light"
                      >
                        <el-input
                          style="width: 100%"
                          clearable
                          :placeholder="t('Order.form.entry_code.placeholder')"
                          :value="myForm.entry_code"
                          @input="
                            (event) =>
                              modifyFn({
                                name: 'entry_code',
                                data: event.target.value,
                              })
                          "
                          @change="
                            modifyFn(
                              { name: 'entry_code', data: myForm.entry_code },
                              'trim'
                            )
                          "
                        ></el-input>
                      </el-tooltip>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row
                  class="reservation-container top"
                  justify="center"
                  :gutter="20"
                >
                  <el-col>
                    <table class="table-header">
                      <thead>
                        <tr>
                          <td
                            class="head"
                            :colspan="months[index].days"
                            v-for="(item, index) in months"
                            :key="index"
                            valign="middle"
                            align="center"
                          >
                            <span>{{ item.month }}, {{ item.year }}</span>
                          </td>
                        </tr>
                        <tr>
                          <td
                            class="head"
                            :class="{
                              weekend: item.weekday > 5,
                              today: item.date === selfDate,
                            }"
                            v-for="(item, index) in dates"
                            :key="index"
                            valign="middle"
                            align="center"
                          >
                            <span>{{ item.day }}</span>
                          </td>
                        </tr>
                        <tr>
                          <td
                            class="head"
                            :class="{
                              weekend: item.weekday > 5,
                              today: item.date === selfDate,
                            }"
                            v-for="(item, index) in dates"
                            :key="index"
                            valign="middle"
                            align="center"
                          >
                            {{ item.weekdayShort.charAt(0) }}
                          </td>
                        </tr>
                      </thead>
                    </table>
                  </el-col>
                </el-row>
                <el-row
                  v-loading="calendarLoading"
                  class="reservation-container"
                  :gutter="20"
                  align="bottom"
                  justify="end"
                >
                  <el-col :span="24">
                    <table class="field-table">
                      <tbody>
                        <tr>
                          <td
                            v-for="(item, index) in calendarList"
                            :key="index"
                          >
                            <div
                              :style="
                                index + 1 < calendarList.length
                                  ? 'border-bottom:0px'
                                  : ''
                              "
                              class="field"
                              :class="
                                (item.bgColor === 'free' && item.weekday > 5
                                  ? ' weekend'
                                  : item.bgColor) +
                                (item.weekday > 5 ? ' weekend' : '') +
                                (item.date === selfDate ? ' today' : '')
                              "
                            >
                              <!-- отображаем разделитель split-->
                              <div
                                v-if="item.split"
                                class="splitClass"
                                style="bottom: 0; right: 0"
                              ></div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </el-col>
                </el-row>
                <el-row
                  class="reservation-container top"
                  justify="center"
                  :gutter="20"
                >
                  <el-col style="margin-bottom: 10px" :span="24">
                    <div style="color: #409eff; margin-top: 10px">
                      <span
                        style="padding-right: 15px; cursor: pointer"
                        @click="prevDate()"
                        >Prev</span
                      >
                      <span
                        style="padding: 0 15px; cursor: pointer"
                        @click="nowDate()"
                        >Now</span
                      >
                      <span
                        style="padding: 0 15px; cursor: pointer"
                        @click="nextDate()"
                        >Next</span
                      >
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col
                    :span="6"
                    style="padding-top: 26px; padding-bottom: 26px"
                  >
                    <el-form-item prop="canceled" style="margin-bottom: 0">
                      <el-checkbox
                        style="width: 100%"
                        :value="myForm.canceled"
                        @change="
                          (event) =>
                            modifyFn({
                              name: 'canceled',
                              data: event.target.value,
                            })
                        "
                        >{{ t("Order.form.canceled.placeholder") }}</el-checkbox
                      >
                    </el-form-item>
                  </el-col>
                  <el-col
                    :span="6"
                    style="padding-top: 26px; padding-bottom: 26px"
                  >
                    <el-form-item prop="completed" style="margin-bottom: 0">
                      <el-checkbox
                        style="width: 100%"
                        :value="myForm.completed"
                        @change="
                          (event) =>
                            modifyFn({
                              name: 'completed',
                              data: event.target.value,
                            })
                        "
                        >{{
                          t("Order.form.completed.placeholder")
                        }}</el-checkbox
                      >
                    </el-form-item>
                  </el-col>
                  <el-col v-if="myForm.canceled || myForm.completed" :span="12">
                    <el-form-item
                      :label="
                        myForm.canceled
                          ? t('Order.form.done_dt.prefix')
                          : t('Order.form.done_dt.prefix2')
                      "
                      prop="done_dt"
                    >
                      <el-tooltip
                        :content="
                          myForm.canceled
                            ? t('Order.form.done_dt.placeholder')
                            : t('Order.form.done_dt.placeholder2')
                        "
                        placement="top-end"
                        effect="light"
                        :open-delay="500"
                      >
                        <!-- TODO: snippet DateTime правильное использование -->
                        <el-date-picker
                          type="datetime"
                          :picker-options="pickerOptionsDone"
                          style="width: 100%"
                          :value="myForm.done_dt"
                          :placeholder="
                            myForm.canceled
                              ? t('Order.form.done_dt.placeholder')
                              : t('Order.form.done_dt.placeholder2')
                          "
                          :format="
                            t('filters.components.CompDateTime.formatTemplate')
                          "
                          :value-format="
                            t(
                              'filters.components.CompDateTime.formatTemplateValue'
                            )
                          "
                          default-time="12:00:00"
                          @input="
                            (event) =>
                              modifyFn({
                                name: 'done_dt',
                                data: event.target.value,
                              })
                          "
                        ></el-date-picker>
                      </el-tooltip>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-scrollbar>
        </el-col>
      </el-row>
    </div>
    <div class="drawer-footer">
      <div v-if="isVisible">
        <el-divider class="custom-divider"></el-divider>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item
              :label="t('Access.form.manager.prefix')"
              prop="manager"
            >
              <el-tooltip
                :content="t('Access.form.manager.placeholder')"
                placement="top-end"
                effect="light"
              >
                <el-input
                  style="width: 100%"
                  clearable
                  :placeholder="t('Access.form.manager.placeholder')"
                  v-model="myForm.manager"
                  @input="
                    (event) =>
                      modifyFn(
                        { name: 'manager', data: event.target.value },
                        'trim'
                      )
                  "
                  @change="
                    (event) =>
                      modifyFn(
                        { name: 'manager', data: event.target.value },
                        'trim'
                      )
                  "
                ></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item
              :label="t('Access.form.change_comment.prefix')"
              prop="change_comment"
            >
              <el-tooltip
                :content="t('Access.form.change_comment.placeholder')"
                placement="top-end"
                effect="light"
              >
                <el-input
                  clearable
                  :placeholder="t('Access.form.change_comment.placeholder')"
                  v-model="myForm.change_comment"
                  @input="
                    (event) =>
                      modifyFn({
                        name: 'change_comment',
                        data: event.target.value,
                      })
                  "
                  @change="
                    (event) =>
                      modifyFn({
                        name: 'change_comment',
                        data: event.target.value,
                      })
                  "
                ></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="footer-body">
        <el-button
          type="info"
          size="mini"
          plain
          @click="resetForm(refMyForm)"
          :disabled="!isChanged || isLoading || isSaving"
          >{{ t("Access.clear") }}</el-button
        >
        <el-button
          type="primary"
          size="mini"
          plain
          @click="submitForm(refMyForm)"
          :disabled="!isChanged || isLoading || isSaving || componentIsLoading"
          >{{ t("Access.saved") }}</el-button
        >
      </div>
    </div>
  </el-form>
</template>

<script lang='ts'>
import { DateTime, Interval } from "luxon";
import { useStore } from "vuex";
import { FILTER_DISPATCH } from "@/components/filters/store/filters";
import orderFormComposition from "./composition/order_form_composition";
import addOrderFormComposition from "./composition/add_order_form_composition";

import { defineComponent } from "@vue/runtime-core";
import {
  computed,
  onBeforeUpdate,
  onMounted,
  onUnmounted,
  onUpdated,
  reactive,
  ref,
  watch,
} from "vue";
import { useI18n } from "vue-i18n";
import { Data } from "@/enums/enum_other";
import { APP_GETTERS } from "@/store/modules/app";
import PropertyApi from "@/domain/api/property";

const AddOrder = defineComponent({
  setup(props, { emit }) {
    const store = useStore();
    const { t } = useI18n();

    const windowWidth = computed(() => store.getters[APP_GETTERS.WINDOW_WIDTH]);
    const propertyStringLength = computed(() => {
      if (windowWidth.value >= 2560) {
        return 3;
      }
      if (windowWidth.value >= 1440) {
        return 4;
      }
      if (windowWidth.value >= 1280) {
        return 5;
      }
      if (windowWidth.value >= 768) {
        return 6;
      }
      return 24;
    });
    // свойства для календаря
    const calendarLoading = ref(false);

    const client = reactive<Data>({});
    const calendarList = reactive<Data[]>([]);
    const dates = reactive<Data[]>([]);
    const months = reactive<Data[]>([]);

    const setReference = (data: any) =>
      store.dispatch(FILTER_DISPATCH.SET_REFERENCE, data);

    const colorsRate: any = ["#99A9BF", "#F7BA2A", "#FF9900"];
    let lrID: null | string = null;
    let dtIn: any = null;
    const params: Data = {
      countDays: 10,
      nextStep: 10,
    };

    const {
      resetForm,
      loadForm,
      closeForm,
      myForm,
      refMyForm,
      rules,
      componentIsLoading,
      setProcessloadingForm,
      setNotify,
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
    } = orderFormComposition();

    const {
      submitForm,
      setData,
      refChargedFrom,
      refOrderStatus,
      refOrderType,
    } = addOrderFormComposition(
      emit,
      setNotify,
      () => clearData,
      property,
      client,
      worker,
      thirdCompany
    );

    // execute at startup ========== >>>>>>>>>>
    onMounted(() => {
      setReference({ name: "ref_property_type" });
      setReference({ name: "ref_order_type" });
      setReference({ name: "ref_order_status" });
      setReference({ name: "ref_charged_from" });
      loadForm();
    });
    watch(fts, () => {
      setData();
      setTimeout(() => {
        componentIsLoading.value = false;
      }, 500);
    });
    onBeforeUpdate((): void => {
      setProcessloadingForm.value = false;
    });
    // life hook vue
    onUpdated((): void => {
      setProcessloadingForm.value = true;
    });
    onUnmounted(() => {
      closeForm();
    });

    const shortcuts = [
      {
        text: "Today",
        onClick(picker: any) {
          picker.$emit("pick", new Date());
        },
      },
      {
        text: "Yesterday",
        onClick(picker: any) {
          const date = new Date();
          date.setTime(date.getTime() - 3600 * 1000 * 24);
          picker.$emit("pick", date);
        },
      },
      {
        text: "A week ago",
        onClick(picker: any) {
          const date = new Date();
          date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
          picker.$emit("pick", date);
        },
      },
    ];

    const pickerOptionsNextArrival = {
      disabledDate(time: any) {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24);
        return time.getTime() < date.getTime();
      },
      shortcuts,
    };
    const pickerOptionsSheduled = {
      shortcuts,
    };
    const pickerOptionsDone = {
      shortcuts,
    };

    // настройка для календаря

    params.countDays =
      (windowWidth.value -
        (windowWidth.value < 768 ? 0 : 300) -
        (windowWidth.value % 60)) /
      60;
    const step = (params.countDays - (params.countDays % 4)) / 4;
    params.nextStep = step < 2 ? 1 : step;

    const selfDate = DateTime.local().toFormat(
      t("filters.components.CompDate.formatTemplateValue") as string
    );
    () => calculateDate();
    () => getCalendarList();
    // execute at startup <<<<<<<< ==========

    const modifyProperty = (id: number): void => {
      modify({ name: "property_id", data: id });
      for (const v of propertyIdItemsList) {
        if (id === v.id) {
          setDataToObject(property, v);
          setDataToObject(client, v.client);
          modify({ name: "client_id", data: v.client_id });
          modify({ name: "entry_code", data: v.entry_code });
          lrID = v.lr_id;
          getCalendarList();
          break;
        }
      }
    };
    const modifyWorker = (id: number): void => {
      modify({ name: "worker_id", data: id });
      for (const v of workerIdItemsList) {
        if (id === v.id) {
          setDataToObject(worker, v);
          break;
        }
      }
    };
    const modifyThirdCompany = (id: number): void => {
      modify({ name: "third_company_id", data: id });
      for (const v of thirdCompanyIdItemsList) {
        if (id === v.id) {
          setDataToObject(thirdCompany, v);
          break;
        }
      }
    };

    // методы для календаря
    const calculateDate = () => {
      if (dtIn === null) {
        dtIn = DateTime.local().startOf("day");
      }
    };
    const nextDate = (): any => {
      dtIn = dtIn.plus({ days: params.nextStep });
      getCalendarList();
    };
    const prevDate = (): any => {
      dtIn = dtIn.minus({ days: params.nextStep });
      getCalendarList();
    };
    const nowDate = (): any => {
      dtIn = DateTime.local();
      getCalendarList();
    };

    const getCalendarList = async () => {
      calendarLoading.value = true;
      const startDate = dtIn.minus({ days: 30 });
      const endDate = dtIn.plus({ days: params.countDays });
      const startDateString = startDate.toFormat(
        t("filters.components.CompDate.formatTemplateValue") as string
      );
      const endDateString = endDate.toFormat(
        t("filters.components.CompDate.formatTemplateValue") as string
      );
      let days = 0;
      const interval = Interval.fromDateTimes(startDate, endDate)
        .toDuration("days")
        .toObject();
      if (interval.days) {
        days = Math.ceil(interval.days);
      }
      getHeaderDates(dtIn.minus({ days: 2 }), days - 28);
      if (lrID !== null) {
        const list = await PropertyApi.getCalendarList(
          `?property=${lrID}&startDate=${startDateString}&endDate=${endDateString}`
        );
        calendarList.splice(0, calendarList.length);
        let reservation: any;
        for (let i = 0; i < days; i++) {
          let prevDateObject: any;
          let selfDateObject: any;
          const selfDate = startDate.plus({ days: i });
          const selfDateStr = selfDate.toFormat(
            t("filters.components.CompDate.formatTemplateValue") as string
          );
          // смотрим еслть ли резервация на предыдущее число
          if (reservation !== undefined) {
            prevDateObject = Object.assign({}, reservation);
            if (reservation.checkOut === selfDateStr) {
              reservation = undefined;
            }
          }
          // получаем резервацию на сегодняшнее число
          if (list.data.length > 0 && reservation === undefined) {
            reservation = list.data.find((k: any) => k.checkIn === selfDateStr);
          }
          // уже получена резервация на сегодняшнее число
          if (reservation !== undefined) {
            selfDateObject = Object.assign({}, reservation);
          }
          const prevDateStr = selfDate
            .minus({ days: 1 })
            .toFormat(
              t("filters.components.CompDate.formatTemplateValue") as string
            );
          const nextDateStr = selfDate
            .plus({ days: 1 })
            .toFormat(
              t("filters.components.CompDate.formatTemplateValue") as string
            );
          const colors = getColorClass(prevDateObject, selfDateObject);
          const split =
            prevDateObject !== undefined &&
            selfDateObject !== undefined &&
            prevDateObject.reservationId !== selfDateObject.reservationId;
          calendarList.push({
            date: selfDate.toFormat(
              t("filters.components.CompDate.formatTemplateValue") as string
            ),
            bgColor: colors.colorClass,
            weekday: selfDate.weekday,
            split,
          });
        }
      } else {
        calendarList.splice(0, calendarList.length);
        let date = startDate;
        for (let i = 0; i < days; i++) {
          date = startDate.plus({ days: i });
          calendarList.push({
            date: date.toFormat(
              t("filters.components.CompDate.formatTemplateValue") as string
            ),
            weekday: date.weekday,
            split: false,
            bgColor: "free",
          });
        }
      }
      calendarList.splice(0, 29); // удаляем первые 29 элементов
      calendarLoading.value = false;
    };
    const getColorClass = (prevItem: any, selfItem: any): any => {
      let prev = "free";
      let self = "free";
      if (prevItem) {
        // если предыдущая дата не свободна
        prev = getColor(prevItem);
      }
      self = getColor(selfItem);
      if (prev !== self) {
        self = prev + "-" + self;
      }
      if (prevItem && selfItem) {
        if (prevItem.reservationId !== selfItem.reservationId) {
          self += " split";
        }
      } else if ((prevItem && !selfItem) || (!prevItem && selfItem)) {
        self += " split";
      }
      return { colorClass: self };
    };
    const getColor = (item: any): string => {
      if (!item) {
        return "free";
      }
      if (item.reservationType === "AdministrationBlock") {
        return "blocked";
      }
      if (item.reservationType === "Guest") {
        return "booked-int";
      }
      if (item.reservationType === "Owner") {
        return "booked-own";
      }
      if (item.reservationType === "Comp") {
        return "booked-exist-cl";
      }
      return "free";
    };

    const getHeaderDates = (startDate: any, daysAmount: number) => {
      dates.splice(0, dates.length);
      months.splice(0, months.length);
      let date = startDate.setLocale(store.getters.language);
      for (let i = 0; i < daysAmount; i++) {
        if (i === 0) {
          continue;
        }
        date = startDate.plus({ days: i }).setLocale(store.getters.language);
        if (
          months.length === 0 ||
          months[months.length - 1].month !== date.monthLong
        ) {
          months.push({ month: date.monthLong, year: date.year, days: 0 });
        }
        months[months.length - 1].days = months[months.length - 1].days + 1;
        dates.push({
          date: date.toFormat(
            t("filters.components.CompDate.formatTemplateValue") as string
          ),
          weekday: date.weekday,
          weekdayShort: date.weekdayShort,
          day: date.day,
          monthLong: date.monthLong,
        });
      }
    };
    const clearData = (): void => {
      // сброс формы
      setDataToObject(property, {});
      setDataToObject(worker, {});
      setDataToObject(thirdCompany, {});
      setDataToObject(client, {});
    };

    const setDataToObject = (object: Data, newData: Data) => {
      Object.keys(object).forEach((key: string) => delete object[key]);
      Object.keys(newData).forEach(
        (key: string) => (object[key] = newData[key])
      );
    };

    return {
      t,
      submitForm,
      resetForm,
      myForm,
      refMyForm,
      rules,
      modifyFn,
      isChanged,
      isLoading,
      isSaving,
      isVisible,

      refChargedFrom,
      refOrderType,
      
      colorsRate,
      pickerOptionsNextArrival,
      pickerOptionsSheduled,
      pickerOptionsDone,
    
      property,
      propertyIdItemsList,
      propertySearch,
      propertyIdLoading,
      modifyProperty,

      worker,
      workerIdItemsList,
      workerSearch,
      workerIdLoading,
      modifyWorker,

      thirdCompany,
      thirdCompanyIdItemsList,
      thirdCompanySearch,
      thirdCompanyIdLoading,
      modifyThirdCompany,
      
      calendarLoading,
      calendarList,
      dates,
      months,
      nowDate,
      prevDate,
      nextDate,
      
    };
  },
});
export default AddOrder;
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.work-search li,
.third-company-search li {
  height: 50px;
  [data-letters]:before {
    content: attr(data-letters);
    display: inline-block;
    font-size: 1em;
    width: 2.5em;
    height: 2.5em;
    line-height: 2.5em;
    text-align: center;
    border-radius: 50%;
    background: plum;
    vertical-align: middle;
    margin-right: 1em;
    color: white;
  }
}
.third-company-search li {
  [data-letters]:before {
    background: green;
  }
}
.property-search li {
  height: 50px;
  .property-item {
    line-height: 1.2em;
    float: left;
    .title {
      font-weight: bold;
      padding-top: 8px;
    }
    .subtitle {
      font-size: 13px;
    }
  }
}
.custom-divider {
  margin-top: 10px;
  margin-bottom: 5px;
}
.page-component__scroll {
  height: calc(100vh - 270px);
}
.page-component__scroll .el-scrollbar__wrap {
  overflow: scroll;
  overflow-x: hidden;
  overflow-y: auto;
}
.page-component__scroll .el-scrollbar__bar.is-horizontal {
  display: none;
}
.drawer-content {
  margin: 0 15px;
  display: flex;
  flex-direction: column;
  height: 100%;
  .drawer-body {
    flex: 1;
    display: block;
    margin-top: 0em;
  }
  .drawer-footer {
    .footer-body {
      display: flex;
      button {
        flex: 1;
      }
    }
  }
}
</style>

<!-- стили для календаря -->
<style rel="stylesheet/scss" lang="scss" scoped>
$list: "booked-new-cl" #b3ff99 #67c23a, "booked-int" #8cc5ff #409eff,
  "booked-own" #f8c391 #e6a23c, "blocked" #9b9da1 #606266,
  "on-hold" #fa9999 #f56c6c, "booked-exist-cl" #9cdf86 #449b19;
$free: #ffffff;
$weekend: #e9e9eb;
$today: #e1f3d8;
$hover: #c6e2ff;
$selected: #668cb3;
.reservation-container {
  font-size: 14px;
  .table-header {
    margin-bottom: 5px;
  }
  table {
    table-layout: fixed; /* Фиксированная ширина ячеек */
    width: 100%; /* Ширина таблицы */
    border-collapse: collapse;
    tr {
      td {
        font-size: 11px;
        height: 40px;
        border: 1px solid rgb(230, 230, 230); /* Параметры рамки */
        padding: 0;
        &.head {
          height: 20px;
        }
        &.weekend {
          background-color: $weekend;
        }
        &.weekend {
          background-color: $weekend;
        }
        &.today {
          background-color: $today;
        }
        &.hover {
          background-color: $hover;
        }
        .tooltip.top {
          margin: -40px 0 0 0;
          position: absolute;
          .tooltiptext {
            border: 1px solid $selected;
            font-size: 14px;
            width: 300px;
            background-color: #ffffff;
            border-radius: 6px;
            padding: 5px;
            position: absolute;
            z-index: 1;
            bottom: 169%;
            left: 10%;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            .status {
              font-size: 14px;
              text-align: left;
              span {
                font-weight: bold;
              }
            }
            &::after {
              content: "";
              position: absolute;
              top: 100%;
              left: 5%;
              margin-left: -5px;
              border-width: 5px;
              border-style: solid;
              border-color: #ffffff transparent transparent transparent;
            }
          }
        }
        .tooltip.top-move {
          margin: -30px 0 0 0;
          position: absolute;
          .tooltiptext {
            border: 1px solid $selected;
            font-size: 14px;
            width: 190px;
            background-color: $free;
            border-radius: 6px;
            padding: 2px 5px;
            position: absolute;
            z-index: 1;
            bottom: 169%;
            left: 10px;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          }
        }
        .field {
          -webkit-touch-callout: none; /* iOS Safari */
          -webkit-user-select: none; /* Chrome/Safari/Opera */
          -khtml-user-select: none; /* Konqueror */
          -moz-user-select: none; /* Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
          user-select: none; /* Non-prefixed version, currently not supported by any browser */
          position: relative;
          overflow: hidden;
          width: 100%;
          height: 100%;
          &::before {
            content: "";
            height: 103%;
            width: 103%;
            position: absolute;
            -webkit-clip-path: polygon(0% 100%, 100% 0%, 100% 100%, 0% 100%);
            clip-path: polygon(0% 100%, 100% 0%, 100% 100%, 0% 100%);
          }
          &.split {
            .splitClass {
              position: absolute;
              overflow: hidden;
              width: 100%;
              height: 100%;
              top: 0;
              right: 0;
              &::before {
                content: "";
                background-color: rgb(230, 230, 230);
                height: 103%;
                width: 103%;
                position: absolute;
                -webkit-clip-path: polygon(0% 100%, 95% 0%, 100% 0%, 5% 100%);
                clip-path: polygon(0% 100%, 95% 0%, 100% 0%, 5% 100%);
              }
            }
          }
          .checkClass {
            position: absolute;
            overflow: hidden;
            width: 50%;
            height: 50%;
            &.lateCheckOut {
              top: 0;
              right: 0;
              &::before {
                content: "";
                background-color: red;
                height: 100%;
                width: 100%;
                position: absolute;
                -webkit-clip-path: polygon(0% 100%, 100% 0%, 0% 0%, 0% 100%);
                clip-path: polygon(0% 100%, 100% 0%, 0% 0%, 0% 100%);
              }
            }
            &.earlyCheckIn {
              bottom: 0;
              left: 0;
              &::before {
                content: "";
                background-color: green;
                height: 100%;
                width: 100%;
                position: absolute;
                -webkit-clip-path: polygon(
                  100% 0%,
                  0% 100%,
                  100% 100%,
                  100% 0%
                );
                clip-path: polygon(100% 0%, 0% 100%, 100% 100%, 100% 0%);
              }
            }
          }
        }

        .free {
          background-color: $free;
        }
        .weekend,
        .weekend.free {
          background-color: $weekend;
        }
        .today,
        .today.free {
          background-color: $today;
        }
        /*     .hover,
    .free:hover,
    .free.today:hover{
      background-color: $hover;
    } */
        .free.date-selected,
        .free.date-selected.hover,
        .weekend.date-selected,
        .free.end-date-selected,
        .weekend.end-date-selected {
          background-color: $selected;
        }
        .free.end-date-selected,
        .weekend.end-date-selected {
          background-color: $selected;
        }

        .free.start-date-selected::before,
        .weekend.start-date-selected::before {
          background-color: $selected;
        }

        // booked styles
        @each $name in $list {
          .free-#{nth($name, 1)},
          .#{nth($name, 1)}-free::before,
          .free.end-date-selected:not(.free-#{nth($name, 1)})::before {
            background-color: $free;
          }
          .weekend.free-#{nth($name, 1)},
          .#{nth($name, 1)}-free.weekend::before,
          .weekend.end-date-selected:not(.free-#{nth($name, 1)})::before {
            background-color: $weekend;
          }
          .today.free-#{nth($name, 1)},
          .today.#{nth($name, 1)}-free::before,
          .today.end-date-selected:not(.free-#{nth($name, 1)})::before {
            background-color: $today;
          }
          .field.weekend.end-date-selected.free-#{nth($name, 1)},
          .field.today.end-date-selected.free-#{nth($name, 1)} {
            &::before {
              background-color: nth($name, 2);
            }
          }
          .field.weekend.hoverReservation.end-date-selected.free-#{nth($name, 1)},
          .field.today.hoverReservation.free-#{nth($name, 1)} {
            &::before {
              background-color: nth($name, 3);
            }
          }
          // при наведении формирует цвет заднего плана за треугольником закрывающей даты (голубоватый цвет)
          .hover.free-#{nth($name, 1)},
      .#{nth($name, 1)}-free.hover::before
      /* .hover.end-date-selected:not(.free-#{nth($name, 1)}):not(.end-date-selected)::before */ {
            background-color: $hover;
          }
          // активирует цветовые схемы
          .#{nth($name, 1)},
          .#{nth($name, 1)}-free,
          .free-#{nth($name, 1)}::before {
            background-color: nth($name, 2);
          }
          // активирует выделение цветом блока резервации (bookrd, blocked, on-hold и т.д. (все из списка list))
          .free-#{nth($name, 1)}.hover-block::before,
          .#{nth($name, 1)}.hover-block:not(.split),
          .#{nth($name, 1)}-free.hover-block,
          .#{nth($name, 1)}.hover-block.split.hoverReservation::before {
            background-color: nth($name, 3);
          }
          // отрисовывает закрывающий треугольник при выборе дат
          .free-#{nth($name, 1)}.end-date-selected,
          .field.today.end-date-selected {
            background-color: $selected;
          }
          /* отрисовывает стартовый треугольник при выборе даты, когда в данную дату есть заканчивающаяся резервация*/
          .#{nth($name, 1)}-free.start-date-selected::before,
          .weekend.#{nth($name, 1)}-free.start-date-selected::before,
          .today.#{nth($name, 1)}-free.start-date-selected::before {
            background-color: $selected;
          }

          .#{nth($name, 1)}.hover-block.split:not(.hoverReservation) {
            background-color: nth($name, 3);
            &::before {
              background-color: nth($name, 2);
            }
          }
          /*отрисовывает соединение резерваций в одной ячейке*/
          @each $v in $list {
            @if ($name != $v) {
              .#{nth($name, 1)}-#{nth($v, 1)} {
                background-color: nth($name, 2);
              }
              .#{nth($name, 1)}-#{nth($v, 1)}.hover-block,
              .#{nth($name, 1)}-#{nth($v, 1)}.hover-block::before {
                background-color: nth($name, 3);
              }
              .#{nth($name, 1)}-#{nth($v, 1)}::before,
              .#{nth($name, 1)}-#{nth($v, 1)}.hover-block.split:not(.hoverReservation)::before {
                background-color: nth($v, 2);
              }
              .#{nth($name, 1)}-#{nth($v, 1)}.hover-block.split.hoverReservation {
                background-color: nth($name, 2);
                &::before {
                  background-color: nth($v, 3);
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>