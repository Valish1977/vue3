<template>

  <el-form
    class="selfForm drawer-content"
    ref="refMyForm"
    :model="ruleForm"
    :rules="rules"
    label-position="top"
    status-icon
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
                      :label="$t('Order.form.priority_lvl.prefix')"
                      prop="priority_lvl"
                    >
                      <el-tooltip
                        :content="$t('Order.form.priority_lvl.placeholder')"
                        placement="top-end"
                        effect="light"
                      >
                        <el-rate
                          :max="3"
                          v-model="ruleForm.priority_lvl"
                          :colors="colorsRate"
                        >
                        </el-rate>
                      </el-tooltip>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" style="padding-top: 26px">
                    <el-form-item prop="touch_up" style="margin-bottom: 0">
                      <el-checkbox
                        style="width: 100%"
                        v-model="ruleForm.touch_up"
                        >{{ $t("Order.form.touch_up.placeholder") }}</el-checkbox
                      >
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('Order.form.next_arrival_dt.prefix')"
                      prop="next_arrival_dt"
                    >
                      <el-tooltip
                        :content="$t('Order.form.next_arrival_dt.placeholder')"
                        placement="top-end"
                        effect="light"
                      >

                      <div style="width: 100%">
                        <el-date-picker
                          type="datetime"
                          :shortcuts="shortcuts"
                          :disabled-date="disabledDate"
                          style="width: 100%"
                          v-model="ruleForm.next_arrival_dt"
                          :placeholder="
                            $t('Order.form.next_arrival_dt.placeholder')
                          "
                          :format="
                            $t('filters.components.CompDateTime.formatTemplate')
                          "
                          :default-time="defaultTime"
                        ></el-date-picker>
                      </div>
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
                        v-model="ruleForm.owner_arrival"
                        >{{
                          $t("Order.form.owner_arrival.placeholder")
                        }}</el-checkbox
                      >
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('Order.form.order_type_id.prefix')"
                      prop="order_type_id"
                    >
                      <el-tooltip
                        :content="$t('Order.form.order_type_id.placeholder')"
                        placement="top-end"
                        effect="light"
                      >
                        <el-select
                          filterable
                          style="width: 100%"
                          v-model="ruleForm.order_type_id"
                          :placeholder="
                            $t('Order.form.order_type_id.placeholder')
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
                      :label="$t('Order.form.charged_from_id.prefix')"
                      prop="charged_from_id"
                    >
                      <el-tooltip
                        :content="$t('Order.form.charged_from_id.placeholder')"
                        placement="top-end"
                        effect="light"
                      >
                        <el-select
                          filterable
                          style="width: 100%"
                          v-model="ruleForm.charged_from_id"
                          :placeholder="
                            $t('Order.form.charged_from_id.placeholder')
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
                      :label="$t('Order.form.scheduled_dt.prefix')"
                      prop="scheduled_dt"
                    >
                      <el-tooltip
                        :content="$t('Order.form.scheduled_dt.placeholder')"
                        placement="top-end"
                        effect="light"
                        :show-after="500"
                      >
                      <div style="width: 100%">
                        <el-date-picker
                          type="datetime"
                          :shortcuts="shortcuts"
                          style="width: 100%"
                          v-model="ruleForm.scheduled_dt"
                          :placeholder="
                            $t('Order.form.scheduled_dt.placeholder')
                          "
                          :format="
                            $t('filters.components.CompDateTime.formatTemplate')
                          "
                          :default-time="defaultTime" })
                        ></el-date-picker>
                      </div>
                      </el-tooltip>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('Order.form.due_date.prefix')"
                      prop="due_date"
                    >
                      <el-tooltip
                        :content="$t('Order.form.due_date.placeholder')"
                        placement="top-end"
                        effect="light"
                        :show-after="500"
                      >
                      <div style="width: 100%">
                        <el-date-picker
                          style="width: 100%"
                          v-model="ruleForm.due_date"
                          :placeholder="$t('Order.form.due_date.placeholder')"
                          :format="
                            $t('filters.components.CompDate.formatTemplate')
                          "
                        ></el-date-picker>
                      </div>
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
                        v-model="ruleForm.third_company"
                        >{{
                          $t("Order.form.third_company.placeholder")
                        }}</el-checkbox
                      >
                    </el-form-item>
                  </el-col>
                  <el-col
                    v-if="
                      ruleForm.third_company === null ||
                      ruleForm.third_company === false
                    "
                    :span="12"
                  >
                    <el-form-item
                      :label="$t('Order.form.worker_id.prefix')"
                      prop="worker_id"
                    >
                      <el-tooltip
                        :content="$t('Order.form.worker_id.placeholder')"
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
                          v-model="ruleForm.worker_id"
                          :placeholder="$t('Order.form.worker_id.placeholder')"
                          :loading="workerIdLoading"
                          @change="(value) => modifyWorker(value)"
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
                  <el-col v-if="ruleForm.third_company === true" :span="12">
                    <el-form-item
                      :label="$t('Order.form.third_company_id.prefix')"
                      prop="third_company_id"
                    >
                      <el-tooltip
                        :content="$t('Order.form.third_company_id.placeholder')"
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
                          v-model="ruleForm.third_company_id"
                          :placeholder="
                            $t('Order.form.third_company_id.placeholder')
                          "
                          :loading="thirdCompanyIdLoading"
                          @change="
                            (value) => modifyThirdCompany(value)
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
                      :label="$t('Order.form.property_id.prefix')"
                      prop="property_id"
                    >
                      <el-tooltip
                        :content="$t('Order.form.property_id.placeholder')"
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
                          v-model="ruleForm.property_id"
                          :placeholder="$t('Order.form.property_id.placeholder')"
                          :loading="propertyIdLoading"
                          @change="
                            (value) => modifyProperty(value)
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
                      :label="$t('Order.form.entry_code.prefix')"
                      prop="entry_code"
                    >
                      <el-tooltip
                        :content="$t('Order.form.entry_code.placeholder')"
                        placement="top-end"
                        effect="light"
                      >
                        <el-input
                          style="width: 100%"
                          clearable
                          :placeholder="$t('Order.form.entry_code.placeholder')"
                          v-model="ruleForm.entry_code"
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
                        v-model="ruleForm.canceled"
                        >{{ $t("Order.form.canceled.placeholder") }}</el-checkbox
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
                        v-model="ruleForm.completed"
                        >{{
                          $t("Order.form.completed.placeholder")
                        }}</el-checkbox
                      >
                    </el-form-item>
                  </el-col>
                  <el-col v-if="ruleForm.canceled || ruleForm.completed" :span="12">
                    <el-form-item
                      :label="
                        ruleForm.canceled
                          ? $t('Order.form.done_dt.prefix')
                          : $t('Order.form.done_dt.prefix2')
                      "
                      prop="done_dt"
                    >
                      <el-tooltip
                        :content="
                          ruleForm.canceled
                            ? $t('Order.form.done_dt.placeholder')
                            : $t('Order.form.done_dt.placeholder2')
                        "
                        placement="top-end"
                        effect="light"
                        :show-after="500"
                      >
                        <div style="width: 100%">
                        <el-date-picker
                          type="datetime"
                          :shortcuts="shortcuts"
                          style="width: 100%"
                          v-model="ruleForm.done_dt"
                          :placeholder="
                            ruleForm.canceled
                              ? $t('Order.form.done_dt.placeholder')
                              : $t('Order.form.done_dt.placeholder2')
                          "
                          :format="
                            $t('filters.components.CompDateTime.formatTemplate')
                          "
                          :default-time="defaultTime"
                        ></el-date-picker>
                        </div>
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
              :label="$t('Access.form.manager.prefix')"
              prop="manager"
            >
              <el-tooltip
                :content="$t('Access.form.manager.placeholder')"
                placement="top-end"
                effect="light"
              >
                <el-input
                  style="width: 100%"
                  clearable
                  :placeholder="$t('Access.form.manager.placeholder')"
                  v-model="ruleForm.manager"
                ></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item
              :label="$t('Access.form.change_comment.prefix')"
              prop="change_comment"
            >
              <el-tooltip
                :content="$t('Access.form.change_comment.placeholder')"
                placement="top-end"
                effect="light"
              >
                <el-input
                  clearable
                  :placeholder="$t('Access.form.change_comment.placeholder')"
                  v-model="ruleForm.change_comment"
                ></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="footer-body">
        <el-button
          type="info"
          plain
          @click="resetForm(refMyForm)"
          :disabled="!isChanged || isLoading || isSaving"
          >{{ $t("Access.clear") }}</el-button
        >
        <el-button
          type="primary"
          plain
          @click="submitForm(refMyForm)"
          :disabled="!isChanged || isLoading || isSaving || componentIsLoading"
          >{{ $t("Access.saved") }}</el-button
        >
      </div>
    </div>
  </el-form>
</template>

<script lang='ts'>
/* eslint-disable  @typescript-eslint/no-explicit-any */
import orderFormComposition from "./composition/order_form_composition";
import calendarComposition from "./composition/calendar_composition";
import datepickerComposition from "./composition/datepicker_composition";
import { defineComponent } from "@vue/runtime-core";

const AddOrder = defineComponent({
  setup(_, { emit }) {
    

    const {
      resetForm,
      myForm,
      ruleForm,
      refMyForm,
      rules,
      componentIsLoading,
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
      refChargedFrom,
      refOrderType,
      lrID
    } = orderFormComposition(emit, (): Promise<void> => getCalendarList());

    const {
      calendarLoading,
      calendarList,
      dates,
      months,
      nowDate,
      prevDate,
      nextDate,
      colorsRate,
      getCalendarList
    } = calendarComposition(lrID);
  
    const {
      shortcuts,
      disabledDate,
      defaultTime,
      selfDate
    } = datepickerComposition();


    return {
      submitForm,
      resetForm,
      myForm,
      ruleForm,
      refMyForm,
      rules,
      isChanged,
      isLoading,
      componentIsLoading,
      isSaving,
      isVisible,
      defaultTime,
      shortcuts,
      disabledDate,

      refChargedFrom,
      refOrderType,
      
      colorsRate,
    
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
      selfDate,
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