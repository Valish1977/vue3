import { createApp } from 'vue'
import App from './App.vue'
import { StoreService } from '@/store'
const store = StoreService.Instance.store;
/* import ElementPlus from 'element-plus' */
/* import 'element-plus/lib/theme-chalk/index.css'*/
import '@/styles/index.scss' // global css 
import { I18nService } from '@/i18n';
const i18n = I18nService.Instance.i18n;
import { RouterService } from '@/router';
const router = RouterService.Instance.router;
import { locale } from '@/plugins/element';
import { AxiosService } from '@/vuex';
const axios = AxiosService.Instance.axios;
AxiosService.Instance.setInterceptorResponse();

// import Ref from "@/ref";
import VueAxios from 'vue-axios'
import { FontAwesomeIcon } from '@/plugins/icons';
import { AppPreloadService, PreloaderSettersName, HelloPreloaderOpacitySettings } from './services/app_preload_service';


const app = createApp(App);
// const ref = new Ref(app);
const appPreloadService = AppPreloadService.Instance;
appPreloadService.startLoader(PreloaderSettersName.StartMain, HelloPreloaderOpacitySettings.OpacityMedium);


// TODO тормознулся переход на этапе использования 'vue-property-decorator' для реализции кода в TypeScript стиле, Работа стопорнулась в Login.vue.
app.config.globalProperties.$API_ROOT = process.env.VUE_APP_API_ROOT;
app.config.globalProperties.$FILE_PATH = process.env.VUE_APP_FILE_PATH ? process.env.VUE_APP_FILE_PATH : '';
app.config.globalProperties.$VERSION = process.env.VUE_APP_VERSION;


// if no auth, user exist in local store?
/* if (!store.getters.getUser.auth) {
  // console.log("no user");
  // check user in localStorage
  if (auth.checkUserInLocalStorage()) {
    router.push({ path: "/login" });
  }
} */
// before each navigate to route

app.use(store).use(router)/* .use(ElementPlus, locale) */.use(i18n).use(VueAxios, axios);
app.component('FontAwesomeIcon', FontAwesomeIcon).mount('#app');