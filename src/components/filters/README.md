#  фильтр версия 1.7.2
#  Дата 13.10.2021
# исправлена ошибка вывода значения в advanced filter
# нополнена документация

#        component: наименование компонента;
#        group_id: id группы селекта;
#        text: наименование в option;
#        value: значение назначаемое полю по умолчанию в селекте компонентов Advanced filter,
#        remoteFn: (query: string) => this.customSearch(query), если необходим внешний обработчик для наполнения селекта (в т.ч. через ajax запрос)
#        transformFn: (num: any) => num * 100, // callback трансформирующий значение перед отправкой
#        default: Ставиться только на одном элементе. при true выбирает данный фильтр, в селекте компонентов Advanced filter, по умолчанию. ВНИМАНИЕ! НЕ РАБОТАЕТ СОВМЕСТНО С query!!!
#        query: { данные формирующие запрос по умолчанию при загрузке страницы. Параметр может выставляться на нескольких элементах. Также поддерживается множественный query элемента [{}, {}]
#           condition: вид запроса ("eq", "gte" и т.д. относительно компонента),
#           operation: оператор запроса "and" или "or",
#           value: значение выбранного фильтра по умолчанию (добавляется в формируемом запросе на сервер)
#           name:  значение выбранного фильтра по умолчанию (добавляется в выводимую строку поиска)
#        }
#        params{: объект с параметрами отправляемый непосредственно в компонент фильтра, для его настройки
#           textView (строка как префикс к результату),
#           placeholder placeholder field,
#           + другие параметры - смотрите в примерах по компонентам ниже
#        }
### ФУНКЦИОНАЛ ДЛЯ БЫСРОГО ПОИСКА ###
### Компоненты использующие настройку: separatedSearch.vue и quickSearch.vue

#        quickSearch: {  при наличии переменной поле участвует в быстром поиске Параметр может быть добавлен к нескольким полям.
#           placeholder: плейсхолдер для поля, достаточно указать только в одном элементе из набора (всегда будет взят первый)
#           condition: указывает какой запрос будет применен (Использовать только для component: 'CompInput' или 'CompNumber' )
#        }

### Компоненты использующие настройку: separatedSearch.vue

#        separateField: { при наличии переменной, поле появится в раздельном поиске. Также поддерживается множественный separateField элемента [{}, {}] 
#           name: имя поля. Пример: "Property name",
#           condition: указывает какой запрос будет применен (любой относительно компонента). Пример: "eq",
#           selected: true необязательный параметр делает поле выбранным по умолчанию, указывается только на одном поле
#        }

### ФУНКЦИОНАЛ ДЛЯ СПИСКА ОТОБРАЖАЕМЫХ НАСТРАИВАЕМЫХ ФИЛЬТРОВ ###
### Компоненты использующие настройку: ListOfFiltersTemplate.vue
#
#        listOfFiltersParams = { параметр содержащий все настройкинастройки
#          showUserTemplates: true  - выведет все, настроенные пользователем, фильтры,
#          customFilters: [ настраиваемые фильтры выводимые 
#            {
#              name : имя выводимого фильтра Пример: "Not assigned"
#              code: [ набор (Array) полей со значением для фильтра. Может состоять как из одного так и из множества, в т.ч. одноименных полей, с разными значениями 
#                {
#                  component: Имя компонента реализующего поле Пример: "CompSelect",
#                  condition: вид запроса. Пример: "eq",
#                  filter: Имя поля по которому ведется поиск отправляемое на сервер. Пример: "order_status_id",
#                  name: Имя поля отображаемое в строке поиска: Пример: "Not assigned",
#                  operation: Оператор используемый в запросе. Пример: "and",
#                  value: Значение поля отправляемое на сервер. Пример: 3
#                }
#              ]
#            },
#          }
#
#
#  filterModel: {
#        header_all: { header: 'Общие сведения', group_id: 1 },
#        header_test: { header: 'Дополнительно', group_id: 2 },
#        listOfFiltersParams = {
#           showUserTemplates: true,
#           customFilters: [
#             {
#               name : "Not assigned",
#               code: [
#                 {
#                   component: "CompSelect",
#                   condition: "eq",
#                   filter: "order_status_id",
#                   name: "Not assigned",
#                   operation: "and",
#                   value: 1
#                 },
#                 {
#                   component: "CompInput",
#                   condition: "eq",
#                   filter: "id",
#                   name: "ID order",
#                   operation: "or",
#                   value: 1
#                 }
#               ]
#             },
#             {
#               name : "Assigned",
#               code: [
#                 {
#                   component: "CompSelect",
#                   condition: "eq",
#                   filter: "order_status_id",
#                   name: "Assigned",
#                   operation: "and",
#                   value: 2
#                 }
#               ]
#             },
#           ]
#        },
#        car_num: {
#          component: 'CompInput',
#          group_id: 1,
#          text: 'Номер карты',
#          params: {
#            textView: 'Номер карты',
#            placeholder:'Укажите номер карты',
#          },
#          quickSearch: {
#            condition: 'ilike*'
#          }
#          separateField: {
#              name: 'Номер карты',
#              condition: 'eq'
#          }
#        },
#        doc_date: {
#          component: 'CompDate',
#          group_id: 2,
#          text: 'дата документа',
#          default: true,
#          params: {
#            textView: 'дата документа',
#            placeholder:'Укажите дату документа',
#          },
#          query: {
#            condition: "gte",
#            operation: "and",
#            value: DateTime.local()
#              .minus(604800000)
#              .toISODate(),
#            name: DateTime.local()
#              .minus(604800000)
#              .toLocaleString(),
#          } // 60*60*24*7*1000
#        },
#        number: {
#          component: 'CompNumber',
#          group_id: 2,
#          text: 'кол-во',
#          value: 25,
#          transformFn: (num: any) => num * 100, // функция трансформирующая значение перед отправкой
#          params: {
#            textView: 'кол-во',
#            placeholder:'Укажите кол-во',
#            min: 7,
#            max: 30,
#            precision:2,
#            step:0.1
#          }
#        },
#        select: {
#          component: 'CompSelect',
#          group_id: 2,
#          text: 'Выберите роль',
#          // если необходим внешний обработчик для наполнения
#          // селекта (через ajax запрос) образец функции прилагается ниже
#          remoteFn: (query: string) => this.tagsSearch(query),
#          params: {
#            textView: 'Тип',
#            placeholder:'Выберите роль',
#            reference: 'ref_role',
#            key: 'code', // алиас поля id
#            label: 'sname' // алиас поля name
#          },
#          query: [{ condition: 'eq', operation: 'and', value: 'adm' },{ condition: 'eq', operation: 'or', value: 'operator' }]
#        },
#        select2: {
#          component: 'CompSelect',
#          group_id: 2,
#          text: 'Выберите язык',
#          params: {
#            textView: 'Язык',
#            placeholder:'Выберите язык',
#            reference: [
#              {id:1, name:'Русский'},
#              {id:2, name:'Английский'},
#              {id:3, name:'Испанский'},
#            ],
#            key: 'id'
#          }
#        },
#        select3: {
#          component: 'CompSelectCs', // выполняет поиск по массиву в поле ?tags=cs.{example, new}
#          group_id: 2,
#          text: 'Выберите тег',
#          remoteFn: (query: string) => this.tagSearch(query),
#          params: {
#            textView: 'Тип',
#            placeholder:'Выберите тег',
#            key: 'id', // алиас поля id
#            label: 'sname' // алиас поля name
#          },
#        },
#        bool: {
#          component: 'CompBool',
#          group_id: 2,
#          text: 'Выбор сделан',
#          params: {
#            textView: 'Выбор сделан',
#            placeholder:'Выбор сделан',
#            reference: [
#              {id:1, name: this.$t('filters.components.CompBool.true')},
#              {id:2, name: this.$t('filters.components.CompBool.false')},
#            ]
#          }
#        }
#      }
#
#
#   формирование внешнего запроса (с другого роута) на фильтр
#   Template часть: <a  @click='setFilter()' >Тестовый фильтр</a>
#   JS часть: setFilter(){
#      this.requestFilter( [{filter: 'sname', condition: 'neq', operation: 'and', value: 'sds' },
#      {filter: 'sname', condition: 'ilike*', operation: 'and', value: 'www' },
#      {filter: 'inn', condition: 'ilike', operation: 'and', value: '123' },
#      {filter: 'active', condition: 'is', operation: 'or', value: true }] )
#      this.$router.push({ path: '/adm/org' })
#    }
#   ...mapActions("filters", {
#      // перезаписывает условия набираемого фильтра в stor в запрос на другой роут
#      requestFilter: ACTIONS.SET_REQUEST_FILTER,
#      setConditions: ACTIONS.SET_CONDITIONS, // перезаписывает условия набираемого фильтра в stor
#      search: ACTIONS.SET_USE_FILTER // запрос на поиск
#    }),
#    // tslint:disable-next-line:max-line-length
#    setFilter(){ // условие для подключения запроса с другого роута
#    (name используется для прямой записи названия, ипользуется для обхода
#    запроса в reference при формировании справочников пользовательской функцией)
#      this.requestFilter( [ {filter: 'select', condition: 'neq', operation: 'and', value: 1 },
#      {filter: 'opi_type_id', condition: 'eq', operation: 'and', value: 2 },
#      {filter: 'from_stock_id', condition: 'eq', operation: 'and', value: 2, name:'Карьер 6' }] )
#      this.$router.push({ path: '/cl/sale' })
#  },
#  private setOutherRoute(): void { // делаем запрос на другой роут
#    this.requestFilter([
#      { filter: "geotags", condition: "cs", operation: "and", value: 7, name: 'test' },
#      {filter: 'opi_type_id', condition: 'eq', operation: 'and', value: 2 },
#      {filter: 'from_stock_id', condition: 'eq', operation: 'and', value: 2, name:'Карьер 6' }
#      ] )
#      this.$router.push({ path: "/adm/property" });
#  }
#  private async setCurrentRoute() { // обновляем фильтр на текущем роуте
#    const list = await this.getGeoTagList("?id=eq." + this.dataItem.id); // получаем соответствующую запись
#    this.$store.dispatch("filters/SET_REFERENCE", { // добавляем запись в стор
#      name: "pid",
#      items: list
#    });
#    this.setConditions([ // устанавливаем фильтр соответственно записи
#      { filter: "pid", condition: "eq", operation: "and", value: this.dataItem.id, name: this.dataItem.path }
#    ]);
#    this.search(); // делаем поисковый запрос
#  }
#  private async getGeoTagList(str: string) {
#    const items: any = [];
#    const arr = await getItem(str);
#    if (Array.isArray(arr) && arr.length > 0) {
#      for ( const v of arr ) {
#        items.push({name: v.name, id: v.id });  // name задаем обязательно !!!!
#      }
#    }
#    return items;
#  }
#  // запрос с фильтра geoTags
#   private async tagsSearch(v) {
#    const ref: any = [];
#    const arr = v.split(" ");
#    let res: string = "";
#    for (const z of arr ) {
#      if ( z !== "") {
#        if (res !== "") {
#          res += "&";
#        }
#        res += "name=ilike.*" + z + "*";
#      }
#    }
#    const query = "?" + res;
#    const data = await getGeoTags(query);
#    if (data) {
#      for (const z of data) {
#        ref.push( {id: z.id, name: z.name}); // name задаем обязательно !!!!
#      }
#    }
#    this.$store.dispatch("filters/SET_REFERENCE", {
#      name: "geotags",
#      items: ref
#    });
#  }