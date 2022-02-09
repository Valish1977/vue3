<template>
  <span>
  <span v-if="windowWidth < 768 ">
    <span @click="visibleDrawer = true">
      <slot>
        <el-button
          v-if="arrView.length == 0"
          icon="el-icon-search"
          circle
          type="primary"
          size="small"
          plain
          style="margin-top:-4px"
        ></el-button>
        <el-button
          v-else
          circle
          type="primary"
          size="small"
          plain
          style="margin-top:-4px"
        >
          <font-awesome-icon icon="pen" />
        </el-button>
      </slot>
    </span>
    <el-drawer
      :show-close="false"
      :modal="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      v-model="visibleDrawer"
      :size="`${windowWidth}px`"
      direction="rtl"
      destroy-on-close
      >
        <template v-slot:title>
          <div>
            {{$t('filters.conditionSearch')}}
            <button @click="visibleDrawer = false" style="position: absolute; right: 15px; top: 15px" aria-label="close drawer" type="button" class="el-drawer__close-btn"><i class="el-dialog__close el-icon el-icon-close"></i></button>
          </div>
        </template>
      <el-form
        class="selfForm drawer-content"
        label-position="top"
        status-icon
        v-loading="isLoading">
        <div class="drawer-body">
          <el-row>
            <el-col :span="24">
              <el-scrollbar class="page-component__scroll">
                <el-row>
                  <el-col :span="23" style="font-size: 14px">
                    <el-row
                      v-for="(line, indexCondition) in this.selfConditions"
                      :key="indexCondition"
                      style="margin: 0 0 10px 0" 
                      align="center"
                      background
                    >
                      <el-divider class="custom-divider" v-if="indexCondition > 0"></el-divider>
                      <el-col :span="22">
                        <el-row :gutter="20">
                          <el-col :span="7">
                            <el-form-item v-show="indexCondition > 0" :label="$t('filters.operation')" style="margin-bottom: 5px">
                              <el-select
                                v-model="line.operation"
                                @change="changeField(indexCondition, 'operation', line.operation)"
                              >
                                <el-option value="and" :label="$t('filters.operations.and')"></el-option>
                                <el-option value="or" :label="$t('filters.operations.or')"></el-option>
                              </el-select>
                            </el-form-item>
                            <span v-show="indexCondition == 0" style="text-align:center; color: white">-</span>
                          </el-col>
                          <el-col :span="17">
                            <el-form-item :label="$t('filters.nameField')" style="margin-bottom: 5px">
                              <el-select
                                v-model="line.filter"
                                @change="changeField(indexCondition, 'filter', line.filter), line.component = model[line.filter].component"
                                style="width:100%"
                              >
                                <el-option-group
                                  v-for="itemg in filterGroupList"
                                  :key="itemg.key"
                                  :label="itemg.text"
                                >
                                  <el-option
                                    v-for="item in filterListFn(itemg.key)"
                                    :key="item.key"
                                    :selected="item.select"
                                    :label="item.text"
                                    :value="item.key"
                                  ></el-option>
                                </el-option-group>
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="7">
                            <el-form-item :label="$t('filters.condition')" style="margin-bottom: 5px">
                              <el-select
                                style="width:100%"
                                v-model="line.condition"
                                @change="changeField(indexCondition, 'condition', line.condition)"
                              >
                                <el-option
                                  v-for="(item, indexConditionList) in conditionListFn(line)"
                                  :key="indexConditionList"
                                  :value="item.name"
                                  :label="item.label"
                                  :selected="item.selected"
                                ></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="17">
                            <el-form-item :label="$t('filters.value')" style="margin-bottom: 5px">
                              <component
                                @getDataField="changeField"
                                @beforeMount="setConditionValue"
                                @beforeUpdate="setConditionValue"
                                :is="line.component"
                                :setName="line.filter"
                                :setValue="line.value"
                                :setIndex="indexCondition"
                                :setParam="line.compParam"
                              ></component>
                            </el-form-item>
                          </el-col>
                        </el-row>
                      </el-col>
                      <el-col :span="2" align="right">
                        <div
                          @click="removeCondition(indexCondition)"
                          style="cursor:pointer; padding-top:5px"
                        >
                          <i class="el-icon-close" style="cursor:pointer; font-size: 13px"></i>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20" style="margin:10px 0">
                      <el-col :span="16">
                        <a class="blue-text" @click="addCondition(null)">{{$t('filters.addCondition')}}</a>
                      </el-col>
                      <el-col :span="8"  align="right">
                        <el-button
                          icon="el-icon-search"
                          type="primary"
                          size="small"
                          plain
                          @click="search(); visibleDrawer = false"
                        >{{$t('filters.search')}}</el-button>
                      </el-col>
                    </el-row>
                    <el-row
                      :gutter="20"
                      style="margin:10px 0; padding-top:10px; border-top:1px solid #ccc"
                    >
                      <el-col :span="22">
                        <a
                          @click="openTemplateList = !openTemplateList"
                          class="blue-text"
                        >{{openTemplateList ? $t('filters.hide') : $t('filters.workTemplate')}}</a>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20" style="margin:10px 0" v-show="openTemplateList">
                      <el-col :span="24">
                        <el-row style="margin-bottom:10px">
                          <el-col :span="22">
                            <el-input
                              :placeholder="$t('filters.setNameTemplate')"
                              v-model="addTempTextField"
                            ></el-input>
                          </el-col>
                          <el-col :span="2">
                            <div
                              @click="setTemplateFn(addTempTextField)"
                              style="cursor:pointer; text-align:center; margin-top:6px"
                            >
                              <font-awesome-icon icon="save" style="color: grey" />
                            </div>
                          </el-col>
                        </el-row>
                        <el-row v-for="(item, index) in filters" :key="index" style="padding-bottom:5px">
                          <el-col :span="23">
                            <a
                              @click="selectTemplateFn(index)"
                              :class="(typeСast(radioTemplate) === typeСast(index) && radioTemplate !== false) ? 'blue-text' : 'black-text'"
                            >{{item.name}}</a>
                          </el-col>
                          <el-col :span="1">
                            <div
                              @click="delTemplate(index)"
                              style="cursor:pointer; text-align:right; padding-top:2px"
                            >
                              <i class="el-icon-close" style="cursor:pointer; font-size: 13px"></i>
                            </div>
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                      </el-col>
                    </el-row>
                  </el-scrollbar>
                </el-col>
              </el-row>
            </div>
          <div class="drawer-footer"></div>
      </el-form>
    </el-drawer>
  </span>
  <el-popover v-else placement="bottom-start" width="768" v-model="visibleDrawer">
    <div
      v-loading="isLoading"
      :element-loading-text="$t('filters.loading')"
      element-loading-spinner="el-icon-loading"
    >
      <el-row style="padding-bottom:10px">
        <el-col :span="22">
          <span class="black-text">{{$t('filters.conditionSearch')}}</span>
        </el-col>
        <el-col :span="2">
          <div @click="visibleDrawer = false" style="cursor:pointer; text-align:right;">
            <font-awesome-icon icon="times" />
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="3" style="text-align:center">
          <span v-if="selfConditions.length > 0">{{$t('filters.operation')}}</span>
        </el-col>
        <el-col :span="7" style="text-align:center">
          <span v-if="selfConditions.length > 0">{{$t('filters.nameField')}}</span>
        </el-col>
        <el-col :span="5" style="text-align:center">
          <span v-if="selfConditions.length > 0">{{$t('filters.condition')}}</span>
        </el-col>
        <el-col :span="8" style="text-align:center">
          <span v-if="selfConditions.length > 0">{{$t('filters.value')}}</span>
        </el-col>
      </el-row>
      <el-row
        :gutter="20"
        v-for="(line, indexCondition) in this.selfConditions"
        :key="indexCondition"
        style="margin:10px 0"
      >
        <el-col :span="3">
          <el-select
            v-show="indexCondition > 0"
            v-model="line.operation"
            @change="changeField(indexCondition, 'operation', line.operation)"
          >
            <el-option value="and" :label="$t('filters.operations.and')"></el-option>
            <el-option value="or" :label="$t('filters.operations.or')"></el-option>
          </el-select>
          <span v-show="indexCondition == 0" style="text-align:center; color: white">-</span>
        </el-col>
        <el-col :span="7">
          <el-select
            v-model="line.filter"
            @change="changeField(indexCondition, 'filter', line.filter), line.component = model[line.filter].component"
            style="width:100%"
          >
            <el-option-group
              v-for="itemg in filterGroupList"
              :key="itemg.key"
              :label="itemg.text"
            >
              <el-option
                v-for="item in filterListFn(itemg.key)"
                :key="item.key"
                :selected="item.select"
                :label="item.text"
                :value="item.key"
              ></el-option>
            </el-option-group>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-select
            style="width:100%"
            v-model="line.condition"
            @change="changeField(indexCondition, 'condition', line.condition)"
          >
            <el-option
              v-for="(item, indexConditionList) in conditionListFn(line)"
              :key="indexConditionList"
              :value="item.name"
              :label="item.label"
              :selected="item.selected"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <component
            @getDataField="changeField"
            @beforeMount="setConditionValue"
            @beforeUpdate="setConditionValue"
            :is="line.component"
            :setName="line.filter"
            :setValue="line.value"
            :setIndex="indexCondition"
            :setParam="line.compParam"
          ></component>
        </el-col>
        <el-col :span="1">
          <div
            @click="removeCondition(indexCondition)"
            style="cursor:pointer; text-align:right; padding-top:2px"
          >
            <i class="el-icon-close" style="cursor:pointer; margin-top:5px; font-size: 13px"></i>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin:10px 0">
        <el-col :span="20">
          <a class="blue-text" @click="addCondition(null)">{{$t('filters.addCondition')}}</a>
        </el-col>
        <el-col :span="4" style="padding-left:5px">
          <el-button
            icon="el-icon-search"
            type="primary"
            size="small"
            plain
            @click="search()"
          >{{$t('filters.search')}}</el-button>
        </el-col>
      </el-row>
      <el-row
        :gutter="20"
        style="margin:10px 0; padding-top:10px; border-top:1px solid #ccc"
      >
        <el-col :span="22">
          <a
            @click="openTemplateList = !openTemplateList"
            class="blue-text"
          >{{openTemplateList ? $t('filters.hide') : $t('filters.workTemplate')}}</a>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin:10px 0" v-show="openTemplateList">
        <el-col :span="24">
          <el-row style="margin-bottom:10px">
            <el-col :span="23">
              <el-input
                :placeholder="$t('filters.setNameTemplate')"
                v-model="addTempTextField"
              ></el-input>
            </el-col>
            <el-col :span="1">
              <div
                @click="setTemplateFn(addTempTextField)"
                style="cursor:pointer; text-align:right; margin-top:6px"
              >
                <font-awesome-icon icon="save" style="color: grey" />
              </div>
            </el-col>
          </el-row>
          <el-row v-for="(item, index) in filters" :key="index" style="padding-bottom:5px">
            <el-col :span="23">
              <a
                @click="selectTemplateFn(index)"
                :class="(typeСast(radioTemplate) === typeСast(index) && radioTemplate !== false) ? 'blue-text' : 'black-text'"
              >{{item.name}}</a>
            </el-col>
            <el-col :span="1">
              <div
                @click="delTemplate(index)"
                style="cursor:pointer; text-align:right; padding-top:2px"
              >
                <i class="el-icon-close" style="cursor:pointer; font-size: 13px"></i>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <template v-slot:reference>
      <el-button
        v-if="arrView.length == 0"
        circle
        type="primary"
        size="small"
        plain
        style="margin-top:-4px"
      >
        <font-awesome-icon icon="search" />
      </el-button>
      <el-button
        v-else
        circle
        type="primary"
        size="small"
        plain
        style="margin-top:-4px"
      >
        <font-awesome-icon icon="pen" />
      </el-button>
    </template>
  </el-popover>
  </span>
</template>

<script lang='ts'>
/* eslint-disable  @typescript-eslint/no-explicit-any */
import { Data } from "@/enums/enum_other";
import { APP_BUS_STATE, APP_DISPATCH, APP_GETTERS } from "@/store/modules/app";
import { defineComponent } from "@vue/runtime-core";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import constantsComposition from "./composition/constantsComposition"
import convertComposition from "./composition/convertComposition"
import { FILTER_DISPATCH, FILTER_GETTERS } from "./store/filters";
import { EditPen } from '@element-plus/icons-vue';

const CompFilter = defineComponent({
  data() {
    return {
    }
  },
  components: {
    EditPen
  },
  setup() {
    const store = useStore();
    const { t } = useI18n();

    const quickSearch = computed<boolean>(() => store.state.filters.quickSearch);
    const conditions = computed<Data[]>(() => store.state.filters.conditions);
    const model = computed<Data>(() => store.state.filters.model);
    const filters = computed<Data[]>(() => store.state.filters.filters);
    const useFilter = computed<Data[]>(() => store.state.filters.useFilter);
    const windowWidth = computed(() => store.getters[APP_GETTERS.WINDOW_WIDTH]);
    const arrView = computed(() => store.getters[FILTER_GETTERS.ARR_VIEW]);
    const isLoading = computed<boolean>(() => store.state.filters.isLoading);

    const visibleDrawer = ref(false);
    const radioTemplate = ref<any>(false);
    const openTemplateList = ref(false);
    const addTempTextField = ref("");

    const selfConditions = reactive<Data[]>([]);
    const filterGroupList = reactive<Data[]>([]);

    const search = () => store.dispatch(FILTER_DISPATCH.SET_USE_FILTER); // запрос на поиск
    const setTemplate = (v: any) => store.dispatch(FILTER_DISPATCH.SET_TEMPLATE, v); // созраняет набранные условия как шаблон
    const delTemplate = (v: any) => store.dispatch(FILTER_DISPATCH.DEL_TEMPLATE, v); // удаляет шаблон
    const selectTemplate = (v: any) => store.dispatch(FILTER_DISPATCH.SELECT_TEMPLATE, v); // выбирает шаблон
    const setConditions = (v: any) => store.dispatch(FILTER_DISPATCH.SET_CONDITIONS, v); // перезаписывает условия набираемого фильтра в stor
    
    const filterList: Data[] = [];
    const conditionLoaded: Data[] = [];

    let filterIndex: number | null = null;
    const {
        componentConditions,
        defaultCondition,
        conditionList
    } = constantsComposition();

    const {
      typeСast
    } = convertComposition();

    onMounted(() => {
      // console.log(this.filters);
      // запускается при начальном формировании компонента
      for (const v in model.value) {
        // формируем по умолчанию добавляемый элемент поиска из первого в переданной модели
        if (model.value[v].component !== undefined) {
          defaultCondition.filter = v;
          if (model.value[v].value !== undefined) {
            defaultCondition.value = model.value[v].value;
          } else {
            defaultCondition.value = undefined;
          }
          defaultCondition.component = model.value[v].component;
          defaultCondition.compParam = model.value[v].params;
          defaultCondition.condition = conditionList[
            componentConditions[model.value[v].component][0]
          ].name;
          break;
        }
      }
  
      for (const v in model.value) {
        if (model.value[v] !== undefined) {
          if (model.value[v].header !== undefined) {
            // создаем массив групп фильтров
            filterGroupList.push({
              text: model.value[v].header,
              key: model.value[v].group_id
            });
          }
          filterList.push(model.value[v]);
          // задаем значения по умолчанию если default === true
          if (model.value[v].default) {
            defaultCondition.filter = v;
            if (model.value[v].value !== undefined) {
              defaultCondition.value = model.value[v].value;
            } else {
              defaultCondition.value = undefined;
            }
            defaultCondition.component = model.value[v].component;
            defaultCondition.compParam = model.value[v].params;
            // tslint:disable-next-line:max-line-length
            defaultCondition.condition = conditionList[componentConditions[model.value[v].component][0]].name;
          }
        }
      }
      // задается список фильтров из одного - дефлотного (в данный момент сам фильтр скрыт)
      selfConditions.splice(0, selfConditions.length);
      selfConditions.push(Object.assign({}, defaultCondition));
    });

    const filterListFn = (v: Data, name: any): any => {
      // формируем список имен для селекта
      const items: any = [];
      for (const item of filterList) {
        if (typeСast(item.group_id) === typeСast(v) && item.component) {
          const n: any = Object.assign({}, item);
          n.select = false;
          if (typeСast(name) === typeСast(n.key)) {
            n.select = true;
          }
          items.push(n);
        }
      }
      return items;
    }

    const conditionListFn = (item: any): any => {
      // формируем список conditions для селекта
      const arr: any = [];
      let i = 0;
      for (const v of componentConditions[item.component]) {
        const obj = Object.assign({}, conditionList[v]);
        obj.selected = false;
        if (i === 0 || typeСast(item.condition) === typeСast(obj.name)) {
          obj.selected = true;
        }
        arr.push(obj);
        i++;
      }
      return arr;
    }

    // удаление описаний страница проперти
    const removeCondition = (index: any): void => {
      filterIndex = null;
      selfConditions.splice(index, 1);
      modifyConditions();
    }
    const clearConditions = (): void => {
      filterIndex = null;
      selfConditions.splice(0, selfConditions.length);
      selfConditions.push(Object.assign({}, defaultCondition));
      selfConditions[0].value = undefined;
      modifyConditions();
      search();
    }
    const selectTemplateFn = (index: any): void => {
      filterIndex = index;
      selectTemplate(index);
      radioTemplate.value = index;
      selfConditions.splice(0, selfConditions.length);
      conditionLoaded.splice(0, conditionLoaded.length);
      for (const v of filters.value[index].code) {
        conditionLoaded.push({
          value: v.value,
          component: v.component,
          loaded: false
        });
        addCondition(v);
      }
    }
  
    watch(quickSearch, (): void  => {
      // формируется набор фильтров при quick search (templates, reset, quickSearch panel, custom filters)
      filterIndex = null;
      selfConditions.splice(0, selfConditions.length);
      if (conditions.value.length > 0) {
        for (const v in conditions.value) {
          if (conditions.value[v] !== undefined) {
            const cond: any = Object.assign({}, conditions.value[v]);
            selfConditions.push({
              operation: cond.operation,
              condition: cond.condition,
              filter: cond.filter,
              component: cond.component,
              value: cond.value,
              name: cond.name,
              compParam: model.value[cond.filter].params
            });
          }
        }
      } else {
        selfConditions.push(Object.assign({}, defaultCondition));
      }
      search();
    });
    watch(visibleDrawer,(): void => {
      // формируется сборка фильтров при запросе фильтрации с другого роута
      if (selfConditions[0].value === null) {
        selfConditions[0].value = undefined;
      }
      if (
        visibleDrawer.value &&
        conditions.value.length > 0 &&
        selfConditions.length === 1 &&
        typeСast(selfConditions[0].value) ===
          typeСast(model.value[selfConditions[0].filter].value)
      ) {
        selfConditions.splice(0, selfConditions.length);
        conditionLoaded.splice(0, conditionLoaded.length);
        for (const v of conditions.value) {
          conditionLoaded.push({
            value: v.value,
            component: v.component,
            loaded: false
          });
          addCondition(v);
        }
      }
    });
    const addCondition = (condition: Data): void => {
      // добавляет новый фильтр в список
      if (condition === null) {
        filterIndex = null;
        selfConditions.push(Object.assign({}, defaultCondition));
      } else if (condition.component !== undefined) {
        const cond = Object.assign({}, condition);
        cond.compParam = model.value[cond.filter].params;
        if (cond.value === undefined) {
          if (model.value[cond.filter].value !== undefined) {
            cond.value = model.value[cond.filter].value;
          } else {
            cond.value = null;
          }
        }
        selfConditions.push(Object.assign({}, cond));
      }
    }
    const setConditionValue = (index: any): void => {
      let count = 0;
      if (
        conditions.value.length > 0 &&
        useFilter.value.length > 0 &&
        conditionLoaded.length !== 0 &&
        filterIndex === null
      ) {
        // наполняем значениями когда запрос на фильтрацию пришел с другого роута
        for (const n in conditionLoaded) {
          if (conditionLoaded[n].loaded === false) {
            if (typeСast(n) === typeСast(index)) {
              selfConditions[n].value = conditions.value[n].value;
              conditionLoaded[n].loaded = true;
            } else {
              count++;
            }
          }
        }
        if (count === 0) {
          conditionLoaded.splice(0, conditionLoaded.length);
        }
      }
      if (conditionLoaded.length === 0 || filterIndex === null) {
        return;
      }
      // далее отрабатывает в случае если фильтр выбран из готовых
      for (const n in conditionLoaded) {
        if (conditionLoaded[n].loaded === false) {
          if (typeСast(n) === typeСast(index)) {
            selfConditions[n].value = filters.value[filterIndex].code[n].value;
            conditionLoaded[n].loaded = true;
          } else {
            count++;
          }
        }
      }
      if (count === 0) {
        conditionLoaded.splice(0, conditionLoaded.length);
      }
    }
    const changeField = (index: any, name: any = null, value: any = null): void => {
      if (typeof index === "object") {
        const copyObj = Object.assign({}, index);
        index = copyObj.index;
        name = "value";
        value = copyObj.value;
        selfConditions[index].name = undefined;
        if ( copyObj.name !== undefined ) {
           // Имя заменяющее в селекте value. Необходимо для remoteFn
          selfConditions[index].name = copyObj.name;
        }
      }
      selfConditions[index][name] = value;
      if (name === "filter") {
        if (model.value[value].value !== undefined) {
          selfConditions[index].value = model.value[value].value;
        } else {
          selfConditions[index].value = undefined;
        }
        selfConditions[index].compParam = model.value[value].params;
        selfConditions[index].component = model.value[value].component;
        selfConditions[index].condition = conditionList[
          componentConditions[model.value[value].component][0]
        ].name;
      }
      if (visibleDrawer.value) {
        modifyConditions();
      }
    }
    const modifyConditions = (): void => {
      // формируем массив условий в стор
      const arr: any = [];
      for (const v of selfConditions) {
        if (
          v.condition !== null &&
          v.value !== "" &&
          v.value !== undefined &&
          v.value !== null
        ) {
          arr.push({
            operation: v.operation,
            condition: v.condition,
            filter: v.filter,
            component: v.component,
            value: v.value,
            name: v.name
          });
        }
      }
      setConditions(arr);
    }
    const setTemplateFn = async(fieldName: string) => {
      if (fieldName === "") {
        setNotify({
          title: t("filters.notify.warning"),
          type: "warning",
          dangerouslyUseHTMLString: true,
          message: t("filters.notify.text")
        });
        return false;
      }
      for (const v of filters.value) {
        if (typeСast(v.name) === typeСast(fieldName)) {
          setNotify({
            title: t("filters.notify.warning"),
            type: "warning",
            dangerouslyUseHTMLString: true,
            message: t("filters.notify.text1")
          });
          return false;
        }
      }
      await setTemplate(fieldName);
      for (const v in filters.value) {
        if (typeСast(filters.value[v].name) === typeСast(fieldName)) {
          radioTemplate.value = v; // делаем выделенным добавленный фильтр
        }
      }
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
      filters,
      filterGroupList,
      filterListFn,
      conditionListFn,
      visibleDrawer,
      clearConditions,
      addCondition,
      removeCondition,
      selectTemplateFn,
      search,
      typeСast,
      radioTemplate,
      setConditionValue,
      setTemplate,
      delTemplate,
      selectTemplate,
      openTemplateList,
      addTempTextField,
      changeField,
      selfConditions,
      isLoading,
      setTemplateFn,
      windowWidth,
      arrView
    }
  }
});
export default CompFilter;

</script>
<style scoped>
.blue-text {
  color: #409eff;
}
.black-text {
  color: #303133;
}
.str-view {
  font-size: 14px;
}
.str-view .operation {
  color: red;
}
</style>

<style lang="scss">
  .box-card {
    .el-row {
      margin-bottom: 5px;
      .el-col {
        font-size: 12px;
      }
    }
  }
</style>
<style scoped lang="scss">
@mixin position{
  top: 0;
  right: 0;
  position: fixed;
  z-index: 999;
}
.bar {
  &__side-bar-bg {
    @include position();
    height: 100%;
    width: 10px;
    background-color: #304156;
    &.is-mobile {
      width: 0px;
    }
  }
  &__btn-list {
    @include position();
    top: 70px;
    transform: translate(0, -50%);
  }
  &__btn {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
    .el-button--primary {
      background-color: #304156;
      border-color: #304156;
      padding-left: 10px;
      padding-right: 15px;
    }
  }
}
.custom-divider {
  margin-top: 10px;
  margin-bottom: 5px;
}
.page-component__scroll{
  height: calc(100vh - 90px);
}
.page-component__scroll .el-scrollbar__wrap {
  overflow: scroll;
  overflow-x: hidden;
  overflow-y: auto;
}
.page-component__scroll .el-scrollbar__bar.is-horizontal {
  display:none;
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
.selfForm label.el-form-item__label {
  padding-bottom: 0;
}
</style>