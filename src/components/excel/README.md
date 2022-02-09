#  ExportExcel версия 2.0.0
#  Дата 11.10.2021 
# произведен переход на работу в виде независимого модуля
# все зависимости теперь внутри
# добавлена возможность вариативного вывода данных в виде массивов
# исправлена ошибка формирования порядка столбцов

# -> КНОПКА РАЗМЕЩАЕМАЯ В ДЕРЕВЕ ЭЛЕМЕНТОВ
# name: 'data' - обязательно к заполнению, тупо указывает куда писать данные в стор - не менять!
# data: настройки передаваемые в эксель (paramsExcel - ниже описание геттера)
# params: {
#  group: название группы (обычно привязана к paramsExel - ниже), разноименных групп может быть несколько, данный параметр позволяет экселю понять с какой группой он работает
#   значение получается через $store.getters['excel/GET_EXCEL_DATA'].group
#  key: ключ, используется id записи если по ней необходимо выполнить запрос по ключу и вывести в эксель (обычно при формировании buttons в цикле), цель таже что и у group, только с более высоким уточнением
#   значение получается через $store.getters['excel/GET_EXCEL_DATA'].key
#  settings: true - будут выведены настройки эксель
#  created: true - эксель будет сразу сформирован без вывода настроек
# }
# <el-button
#          size="small"
#          style="width:140px"
#          plain
#          @click="$store.dispatch('excel/SET_EXCEL_DATA', {name: 'data', data: paramsExcel, params:{settings: true, group: 'allData', key: 'allData' }});"
#        >{{$t("excel.export")}} <i class="el-icon-setting el-icon-right"></i></el-button>


# -> ОПИСАНИЕ НАСТРОЕК
# name: имя сгенерированного excel файла
# types: варианты вывода таблиц (обязательно идут в паре с tabs[n].query, где описывается выдача по каждому типу)
# tabs[n]: { массив таблиц формируемые каждые в отдельной вкладке
#   name: Название вкладки (также название раздела в настройках),
#   query: запрос либо в виде строки: "/api/order?" + idOrder + "order=id.desc, либо в виде функции с возможностью описаниея под каждый тип (types - выше). Пример описания функции query ниже.
#   fields[n]: { массив полей
#       field: Имя поля из query response
#       name: Наименование поля в экселе
#       fn(cell: any, row: any): функция обработчик на уровне формирования данных в ячейке, получающая значение ячейки и вторым значением - строки 
#       enabled: true - true поле включено по умолчанию в выдачу, false - выключено
#   }
# }
# 
# get paramsExcel() {
#   return {
#      name: this.$t(this.$store.getters.getCurrentRoute.meta.pageName),
#      types: [ // задаем типы для формирования строк
#        "withConcatenatedArrays", // конкатенация массивов в одну ячейку
#        "multiLineWithoutFiltering", // с массивами но без фильтрации
#        "multilineFiltered" // с полноценной фильтрацией по массивам (избыточное заполнение данными)
#      ],
#      tabs: [
#        {
#          name: this.$t(this.$store.getters.getCurrentRoute.meta.pageName),
#          query: async (typeResponse: string) => {
#            // в коллбеке обрабатываем типы формирования строк
#            const response = await this.excelApi.getItems("/api/order?" +
#            this.filterStrQuery +
#            (this.filterStrQuery === "" ? "" : "&") +
#            "order=id.desc&select=*," +
#            "order_type:order_type_id(name)," +
#            "order_status:order_status_id(name)," +
#            "charged_from:charged_from_id(name)," +
#            "property:property_id(name, full_address)," +
#            "worker:worker_id(first_name, last_name)");
#            if (typeResponse === "multiLineWithoutFiltering") {
#              return this.multiLineWithoutFiltering(response);
#            } else if (typeResponse === "multilineFiltered") {
#              return this.multilineFiltered(response);
#            } else if (typeResponse === "withConcatenatedArrays") {
#              return this.withConcatenatedArrays(response);
#            }
#          },
#          fields: [
#            {
#              field: "id",
#              name: this.$t("Order.info.id"),
#              enabled: true
#            },
#            {
#              field: "task_json_backlog",
#              name: this.$t("Order.tableHeader.task_json2"),
#              enabled: true
#            },
#            {
#              field: "task_json_comment",
#              name: this.$t("Order.tableHeader.task_json3"),
#              enabled: true
#            },
#            {
#              field: "order_status.name",
#              name: this.$t("Order.info.order_status"),
#              enabled: true
#            },
#            {
#              field: "order_type.name",
#              name: this.$t("Order.info.order_type"),
#              enabled: true
#            },
#            {
#              field: "charged_from.name",
#              name: this.$t("Order.info.charged_from_id"),
#              enabled: true
#            },
#            {
#              field: "property_id",
#              name: this.$t("Order.info.property"),
#              fn: (v: any, row: any) => {
#                return row.property.name + "; Address: " + row.property.full_address;
#              },
#              enabled: true
#            },
#            {
#              field: "worker_id",
#              name: this.$t("Order.info.worker"),
#              fn: (v: any, row: any) => {
#                return row.worker !== null ? row.worker.first_name + " " + row.worker.last_name : "";
#              },
#              enabled: true
#            },
#            {
#              field: "third_company_name",
#              name: this.$t("Order.info.third_company_name"),
#              enabled: true
#            },
#            {
#              field: "scheduled_dt",
#              name: this.$t("Order.info.scheduled_dt"),
#              fn: (v: any, row: any) => {
#                return this.getDateTime(v);
#              },
#              enabled: true
#            },
#            {
#              field: "due_date",
#              name: this.$t("Order.info.due_date"),
#              fn: (v: any, row: any) => {
#                return this.getDate(v);
#              },
#              enabled: true
#            },
#            {
#              field: "next_arrival_dt",
#              name: this.$t("Order.info.next_arrival_dt"),
#              fn: (v: any, row: any) => {
#                return this.getDateTime(v);
#              },
#              enabled: true
#            },
#            {
#              field: "start_dt",
#              name: this.$t("Order.info.start_dt"),
#              fn: (v: any, row: any) => {
#                return this.getDateTime(v);
#              },
#              enabled: true
#            },
#            {
#              field: "done_dt",
#              name: this.$t("Order.info.done_dt"),
#              fn: (v: any, row: any) => {
#                return this.getDateTime(v);
#              },
#              enabled: true
#            },
#            {
#              field: "touch_up",
#              fn: (v: any) => {
#                return v ? "✔" : "";
#              },
#              name: this.$t("Order.info.touch_up"),
#              enabled: true
#            },
#            {
#              field: "owner_arrival",
#              fn: (v: any) => {
#                return v ? "✔" : "";
#              },
#              name: this.$t("Order.info.owner_arrival"),
#              enabled: true
#            },
#            {
#              field: "total_hour",
#              fn: (v: any) => {
#                return v !== null && v > 0 ? v / 60 : "";
#              },
#              name: this.$t("Order.info.total_hour"),
#              enabled: true
#            },
#            {
#              field: "priority_lvl",
#              name: this.$t("Order.info.priority_lvl"),
#              enabled: true
#            }
#          ]
#        }
#      ]
#    };
#  }