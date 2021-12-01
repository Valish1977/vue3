import MainService from '@/core/main_service';
import StoreService from '@/store'
import I18nService from '@/core/i18n_service';
import RouterService from '@/core/router_service';
import VueAxios from 'vue-axios'
import VuexService from '@/core/vuex_service';
import ElementPlus from 'element-plus';
import ElementUiService from '@/services/element_ui_service';
import 'element-plus/dist/index.css';
import "@/styles/index.scss"; // global css


MainService.Instance.app.config.globalProperties.$API_ROOT = process.env.VUE_APP_API_ROOT;
MainService.Instance.app.config.globalProperties.$FILE_PATH = process.env.VUE_APP_FILE_PATH ? process.env.VUE_APP_FILE_PATH : '';
MainService.Instance.app.config.globalProperties.$VERSION = process.env.VUE_APP_VERSION;


MainService.Instance.app.use(StoreService.Instance.store)
  .use(RouterService.Instance.router)
  .use(ElementPlus, ElementUiService.Instance.options)
  .use(I18nService.Instance.i18n)
  .use(VueAxios, VuexService.Instance.axios);

MainService.Instance.appComponents();
MainService.Instance.runApp();
