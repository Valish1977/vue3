

<template>
  <div>
    <el-form v-if="selfCondition.component" ref="myForm" :model="myForm" @submit.prevent.native="search()">
      <el-form-item
        style="margin-bottom:0"
        prop="name"
        :rules="[
            { min: 0, max: 250, message: $t('filters.quickSearch.form.name.error'), trigger: ['blur', 'change'] },
            { validator: validateInput, trigger: ['blur', 'change']}
        ]"
      >
          <el-row
            type="flex"
            class="row-bg"
            width="100%"
          >
          <el-col :span="7">
          <el-select
            v-model="fieldIndex"
            @change="
              selfCondition = Object.assign({}, filterList[fieldIndex]);
              changeValue = ''
            "
            style="width:100%"
          >
            <el-option
              v-for="item in filterList"
              :key="item.key"
              :selected="item.key === fieldIndex"
              :label="item.name"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-col>
            <el-col  :span="$store.getters['app/windowWidth'] < 768 ? 15 : 10">
              <el-form-item  style="margin-bottom: 5px">
                <component
                  @getDataField="changeField"
                  :is="selfCondition.component"
                  :setName="selfCondition.filter"
                  :setParam="selfCondition.compParam"
                ></component>
              </el-form-item>
            </el-col>
            <el-col :span="$store.getters['app/windowWidth'] < 768 ? 5 : 2">
              <el-button
                  plain
                  type="info"
                  :disabled="isLoading"
                  @click.native="searchFn()"
              >{{$t("filters.quickSearch.form.send")}}</el-button>
            </el-col>
          </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang='ts'>
import { mapState, mapActions, mapGetters } from "vuex";
import { ACTIONS, GETTERS } from "@/components/filters/store/filters";
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import CompDate from "@/components/filters/CompDate.vue";
import CompInput from "@/components/filters/CompInput.vue";
import CompNumber from "@/components/filters/CompNumber.vue";
import CompSelect from "@/components/filters/CompSelect.vue";
import CompSelectCs from "@/components/filters/CompSelectCs.vue";
import CompBool from "@/components/filters/CompBool.vue";
@Component({
  components: {
    CompDate,
    CompInput,
    CompNumber,
    CompSelect,
    CompSelectCs,
    CompBool
  },
  computed: {
    ...mapState("filters", ["model", "isLoading"])
  },
  methods: {
    ...mapActions("filters", {
      setQuickSearch: ACTIONS.SET_QUICK_SEARCH // делаем поисковый запрос
    })
  }
})
export default class SeparatedSearch extends Vue {
  @Prop({ default: null })
  public setParam: any;
  private param: any;
  private myForm: any;
  private validateInput: any;
  private filterList: any = [];
  private selfCondition: any = {};
  private fieldIndex: number = 0;
  private setQuickSearch: any;
  private isLoading: any;
  private changeValue: string = "";
  private model: any;
  constructor() {
    super();
    this.myForm = {
      name: null
    };
  }
  private created(): void {
    this.param = {
      placeholder: this.$t("filters.quickSearch.form.name.placeholder")
    };
    this.validateInput = (rule, value, callback) => {
      if (value === undefined || value === null || value === "") {
        callback();
        return true;
      }
      const regex = /^[А-Яа-яA-Za-z0-9sS_\.\-]*$/i;
      value = value.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
      if (!regex.test(value)) {
        callback(
          new Error(this.$t("filters.quickSearch.form.name.error1") as string)
        );
        return true;
      }
    };
  }
  private isIssetSeparatedField(v: string) {
    if ( this.model[v] !== undefined &&
    this.model[v].separateField &&
    ((Array.isArray(this.model[v].separateField) && this.model[v].separateField.length > 0) ||
    this.model[v].separateField.condition )) {
      return true;
    }
    return false;
  }
  private mounted(): void {
    this.fieldIndex = 0;
    this.filterList = [];
    this.getQuickSearch();
    for (const v in this.model) {
      if ( this.isIssetSeparatedField(v) ) {
        const condition: any = {};
        if (Array.isArray(this.model[v].separateField)) {
          for (const i in this.model[v].separateField) {
            if (this.model[v].separateField[i] !== undefined) {
              const item = this.setCondition(v, parseInt(i, 10), this.filterList.length);
              this.filterList.push(item);
            }
          }
        } else {
          this.filterList.push(this.setCondition(v, 0, this.filterList.length));
        }
      }
    }
    this.selfCondition = Object.assign({}, this.filterList[this.fieldIndex]);
  }
  private getQuickSearch() {
    let quickSearch: any = null;
    for (const v in this.model) {
      if (this.model[v].quickSearch) {
        quickSearch = {
          quickSearch: true,
          selected: true,
          component: "CompInput",
          filter: null,
          key: 0,
          name: "",
          compParam: {placeholder: ""}
        };
        if (this.model[v].quickSearch.params) {
          quickSearch.compParam = this.model[v].quickSearch.params;
          if (this.model[v].quickSearch.params.name) {
            quickSearch.name = this.model[v].quickSearch.params.name;
          }
        }
      }
    }
    if ( quickSearch ) {
      this.filterList.push(quickSearch);
    }
  }
  private setCondition(v: string, num: number, key: number) {
    let item: any;
    if (Array.isArray(this.model[v].separateField)) {
      item = this.model[v].separateField[num];
    } else {
      item = this.model[v].separateField;
    }
    const condition: any = {};
    condition.filter = this.model[v];
    if (this.model[v].value !== undefined) {
      condition.value = this.model[v].value;
    } else {
      condition.value = undefined;
    }
    condition.component = this.model[v].component;
    condition.compParam = this.model[v].params;
    condition.field = v;
    condition.condition = item.condition;
    condition.name = item.name;
    condition.key = key;
    if (item.selected) {
      this.fieldIndex = key;
    }
    return condition;
  }

  private searchFn(): any {
    if (this.changeValue === ""  || this.changeValue === null) {
      return;
    }
    const arr: any = [];
    if (this.selfCondition.quickSearch) {
      // если поле быстрого поиска
      for (const v in this.model) {
        if (this.model[v] !== undefined) {
          let val: any = this.changeValue;
          if (this.model[v].component === "CompNumber") {
            val = Number(this.changeValue);
            if (!Number.isFinite(val)) {
              continue;
            }
          }
          if (this.model[v].quickSearch) {
            arr.push({
              operation: "or",
              condition: this.model[v].quickSearch.condition,
              filter: this.model[v].key,
              component: this.model[v].component,
              value: val
            });
          }
        }
      }
    } else {
      let val: any = Number(this.changeValue);
      if (!Number.isFinite(val)) {
        val = this.changeValue;
      }
      arr.push({
        operation: "and",
        condition: this.selfCondition.condition,
        filter: this.selfCondition.filter.key,
        component: this.selfCondition.component,
        value: val
      });
    }
    if (arr.length > 0) {
      this.setQuickSearch(arr);
    }
  }
  private changeField(obj: any): void {
    const str = obj.value ? obj.value.toString() : "";
    this.changeValue = str.replace(
        /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
        ""
      );
  }
  private compParam(name: string): any {
    if (this.setParam[name] === undefined) {
      return this.param[name];
    }
    return this.setParam[name];
  }
  private typeСast(v: any) {
    if (typeof v === "string") {
      if (!!(parseFloat(v) % 1) && v.toString() === parseFloat(v).toString()) {
        return parseFloat(v);
      }
      if (!(parseFloat(v) % 1) && v.toString() === parseInt(v, 10).toString()) {
        return parseInt(v, 10);
      }
    }
    return v;
  }
}
</script>