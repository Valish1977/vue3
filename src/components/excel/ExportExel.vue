<template>
  <el-drawer
      ref="filterDrawer"
      :show-close="false"
      :modal="false"
      :wrapperClosable="false"
      :visible.sync="settings"
      :size="($store.getters['app/windowWidth'] < 768 ? $store.getters['app/windowWidth'] : 768) + 'px'"
      direction="rtl"
      destroy-on-close
      >
        <template v-slot:title>
          <div>
            {{$t('excel.title')}}
            <button @click="setDrawer()" style="position: absolute; right: 15px; top: 15px" aria-label="close drawer" type="button" class="el-drawer__close-btn"><i class="el-dialog__close el-icon el-icon-close"></i></button>
          </div>
        </template>
        <div class="selfForm drawer-content">
        <div class="drawer-body">
          <el-row>
            <el-col :span="24">
              <el-scrollbar class="page-component__scroll">
                <el-row>
                  <el-col :span="23">
                    <el-row :gutter="20" v-if="checkedItems.length > 0">
                      <el-col :span="24">
                        <el-row style="margin:0 15px;" v-for="(i, k) in params.tabs" :key="k">
                          <el-divider content-position="left">{{i.name}}</el-divider>
                          <el-checkbox-group v-model="checkedItems[k]">
                            <el-row :gutter="20">
                              <el-col
                                :span="$store.getters['app/windowWidth'] < 600 ? 24 : 12"
                                style="margin-bottom:15px;"
                                v-for="(item, key) in i.fields"
                                :key="key"
                              >
                                <el-checkbox :label="item.field">{{item.name}}</el-checkbox>
                              </el-col>
                            </el-row>
                          </el-checkbox-group>
                        </el-row>
                      </el-col>
                    </el-row>
                    <el-row 
                      :gutter="20"
                      align="middle"
                      v-if="checkedItems.length > 0">
                      <el-col v-if="params.types !== undefined && params.types.length > 1" :span="6">
                        <h4 style="font-size: 13px; line-height: 26px; height: 26px; margin-left: 15px;">
                        {{ $t(`excel.export`) }}:
                        </h4>
                      </el-col>
                      <el-col v-if="params.types !== undefined" :span="params.types !== undefined && params.types.length > 1 ? 18 : 24" align="right">
                        <el-button v-for="(type, k) in params.types"  :key="k"
                          size="mini"
                          plain
                          :loading="( $store.getters['excel/GET_EXCEL_DATA'].created && $store.getters['excel/GET_EXCEL_DATA'].key == key && typeResponse === type )"
                          @click="$store.dispatch('excel/SET_EXCEL_DATA', {name: 'data', data: params, params:{created: true, group, key, typeResponse: type  }});"
                        >{{ ( $store.getters['excel/GET_EXCEL_DATA'].created && $store.getters['excel/GET_EXCEL_DATA'].key == key && typeResponse === type ) ? $t("Access.loading") : params.types.length > 1 ? $t(`excel.${type}`) : $t(`excel.export`) }}</el-button>
                      </el-col>
                      <el-col v-if="params.types === undefined" :span="24" align="right">
                        <el-button
                          size="mini"
                          style="width:140px"
                          plain
                          :loading="( $store.getters['excel/GET_EXCEL_DATA'].created && $store.getters['excel/GET_EXCEL_DATA'].key == key)"
                          @click="$store.dispatch('excel/SET_EXCEL_DATA', {name: 'data', data: params, params:{created: true, group, key, typeResponse: $store.getters['excel/GET_EXCEL_DATA'].typeResponse }});"
                        >{{ ( $store.getters['excel/GET_EXCEL_DATA'].created && $store.getters['excel/GET_EXCEL_DATA'].key == key ) ? $t("Access.loading") : $t("excel.export") }}</el-button>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-scrollbar>
            </el-col>
          </el-row>
        </div>
        <div class="drawer-footer"></div>
        </div>
    </el-drawer>
</template>

<script lang="ts">
import * as exceljs from "exceljs/dist/exceljs.min.js";
import ExcelApi from "@/components/excel/api/excel";
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
export type VDrawer = Vue & { closeDrawer: () => boolean };
@Component({
  computed: {
    selfDrawer(): VDrawer {
      return this.$refs.filterDrawer as VDrawer;
    }
  }
})
export default class ExportExelM extends Vue {
  @Prop({ default: null })
  public parametrs: any;
  private selfDrawer: any;
  private selfGroup: any = "";
  private settings: any = false;
  private checkedItems: any = [];
  private excelApi = new ExcelApi();
  private alphabet: any = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
  ];
  @Watch("createdd")
  private watchCreatedd() {
    if (this.createdd) {
      setTimeout(() => {
        this.tabExel();
      }, 500);
    }
  }
  @Watch("params")
  private watchParams() {
    if (this.selfGroup !== this.group) {
      this.selfGroup = this.group;
      this.setList();
    }
  }
  @Watch("sett")
  private watchSett() {
    this.settings = this.sett;
  }
  @Watch("settings")
  private watchSettings() {
    if (!this.settings && this.settings !== this.sett) {
      this.$store.dispatch("excel/SET_EXCEL_DATA", {
        name: "settings",
        data: false
      });
    }
  }
  get language(): any {
    return this.$store.getters.language;
  }
  get createdd(): any {
    return this.$store.getters["excel/GET_EXCEL_DATA"].created;
  }
  get sett(): any {
    return this.$store.getters["excel/GET_EXCEL_DATA"].settings;
  }
  get group(): any {
    return this.$store.getters["excel/GET_EXCEL_DATA"].group;
  }
  get key(): any {
    return this.$store.getters["excel/GET_EXCEL_DATA"].key;
  }
  get params(): any {
    return this.$store.getters["excel/GET_EXCEL_DATA"].data;
  }
  get typeResponse(): any {
    return this.$store.getters["excel/GET_EXCEL_DATA"].typeResponse;
  }
  private setList() {
    this.checkedItems = [];
    for (const v of this.params.tabs) {
      const arr: any = [];
      for (const t of v.fields) {
        if (t.enabled) {
          arr.push(t.field);
        }
      }
      this.checkedItems.push(arr);
    }
  }
  private async tabExel() {
    const data: any = [];
    for (const i in this.params.tabs) {
      if (this.params.tabs[i] !== undefined) {
        let items: any = [];
        if ( typeof this.params.tabs[i].query === "function" ) {
          items = await this.params.tabs[i].query(this.typeResponse);
        } else {
          items = await this.excelApi.getItems(this.params.tabs[i].query);
        }
        if (items.length === 0) {
          continue;
        }
        // -> создаем массив в порядке заданном в описании
        const arrFields: any = [];
        for (const v of this.params.tabs[i].fields) {
           if (this.checkedItems[i].indexOf(v.field) !== -1 ) {
             arrFields.push(v.field);
           }
        }
        // <-
        const columns: any = [];
        for (const v in arrFields) {
          if (arrFields[v] !== undefined) {
            const item: any = this.params.tabs[i].fields.find(
              (t: any) => t.field === arrFields[v]
            );
            columns.push({ header: item.name, key: "cell" + v, width: 20 });
          }
        }
        const rows: any = [];
        for (const v of items) {
          const arr: any = [];
          let key = 0;
          let maxCountLine = 1;
          for (const n of arrFields) {
            const item = this.params.tabs[i].fields.find(
              (t: any) => t.field === n
            );
            let itemValue: any;
            if (item.field.indexOf(".") !== -1) {
              itemValue = this.getField(v, item);
            } else {
              if (item.fn !== undefined) {
                itemValue = item.fn(v[item.field], v);
              } else {
                itemValue = v[item.field];
              }
            }
            arr[key] = this.getData(itemValue);
            if (arr[key].length > maxCountLine) {
              maxCountLine = arr[key].length;
            }
            key++;
          }
          rows.push({
            line: arr,
            maxCountLine
          });
        }
        data.push({
          columns,
          rows,
          name: this.params.tabs[i].name
        });
      }
    }
    this.viewExel(data);
  }
  private getData(itemValue: any) {
    let arr: any = [];
    if (Array.isArray(itemValue)) {
      if (itemValue.length === 0) {
        arr.push("");
      } else {
        arr = itemValue;
      }
    } else {
      arr.push(itemValue);
    }
    return arr;
  }
  private getField(v: any, item: any): any {
    const a = item.field.split(".");
    switch (a.length) {
      case 2:
        return (v[a[0]] !== null) ? v[a[0]][a[1]] : "";
      case 3:
        if (v[a[0]] !== null) {
          return (v[a[0]][a[1]] !== null) ? v[a[0]][a[1]][a[2]] : "";
        } else {
          return "";
        }
      case 4:
        if (v[a[0]] !== null) {
          if (v[a[0]][a[1]] !== null) {
            return (v[a[0]][a[1]][a[2]] !== null) ? v[a[0]][a[1]][a[2]][a[3]] : "";
          } else {
            return "";
          }
        } else {
          return "";
        }
      default:
        return "";
    }
  }
  private setDrawer() {
    this.selfDrawer.closeDrawer();
  }
  private viewExel(data: any): any {
    const name = this.params.name;
    const wb: any = new exceljs.Workbook();
    let columnNames: any = [];
    let mergeCells: any = [];  // колличество слияемых ячеек в колонках
    for (const v of data) {
      const ws = wb.addWorksheet(v.name);
      ws.columns = v.columns;
      columnNames = [];
      if ( v.columns.length <= this.alphabet.length) {
        for (let i = 0; i < v.columns.length; i++) {
          columnNames.push(this.alphabet[i]);
        }
      } else {
        const remainder = v.columns.length % this.alphabet.length;
        const len = (v.columns.length - remainder) / this.alphabet.length;
        for (let i = 0; i < len; i++) {
          for (const s of this.alphabet) {
            columnNames.push(`${this.alphabet[i]}${s}`);
          }
        }
        for (let i = 0; i < remainder; i++) {
          columnNames.push(`${this.alphabet[len]}${this.alphabet[i]}`);
        }
      }
      const rows: any = [];
      let rowNum: number = 1;
      for (const t of v.rows) {
        mergeCells = []; // обнуляем для нового row
        for (let i = 0; i < t.maxCountLine; i++) {
          const cells: any = [];
          for (const n of t.line) {
            if (i === 0) {
              // заполняем данные о слиянии только при первой итерации
              mergeCells.push(t.maxCountLine - n.length);
            }
            if ( n[i] !== undefined ) {
              cells.push(n[i]);
            } else {
              cells.push("");
            }
          }
          ws.addRow(cells);
          rowNum++;
          if (i === t.maxCountLine - 1) {
            // редактируем ячейки на последней итерации записи
            for (const key in mergeCells) {
              if ( mergeCells[key] > 0) {
                 // вычисляем целевую ячейку
                const targetCell = `${columnNames[key]}${rowNum - mergeCells[key]}`;
                // слияние ячеек
                const mergeCell = `${columnNames[key]}${rowNum}`;
                ws.mergeCells(targetCell, mergeCell);
                // назначаем позицию: top для слитых ячеек
                ws.getCell(targetCell).alignment = { vertical: "top", horizontal: "left" };
                /* const  firstRow = rowNum - mergeCells[key];
                for (let n = 1; n <= mergeCells[key]; n++) {
                  ws.getCell(`${columnNames[key]}${firstRow + n}`).fill = {
                    type: 'pattern',
                    pattern:'darkTrellis',
                    fgColor:{argb:'FFEBEEF5'},
                    bgColor:{argb:'FFEBEEF5'}
                  };
                } */
              }
            }
          }
        }
      }
    }
    wb.xlsx.writeBuffer().then((buffer: any) => {
      const blob = new Blob([buffer], { type: "application/vnd.ms-excel" });
      const link: any = document.createElement("a");
      link.style = "display: none";
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.download = name + ".xlsx";
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 0);
    });
    setTimeout(() => {
      this.$store.dispatch("excel/SET_EXCEL_DATA", {
        data: false,
        name: "created"
      });
    }, 500);
  }
}
</script>

<style scoped>
.international-icon {
  font-size: 20px;
  cursor: pointer;
  padding-right: 2px;
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