import { createApp } from 'vue'

import App from './App.vue'
import store from './store'
/* import ElementPlus from 'element-plus' */
/* import 'element-plus/lib/theme-chalk/index.css'*/
import '@/styles/index.scss' // global css 
import { i18n } from '@/i18n';
import { router } from '@/router';
import { locale } from '@/plugins/element';
import axios from 'axios'
// import Ref from "@/ref";
import VueAxios from 'vue-axios'
import { FontAwesomeIcon } from '@/plugins/icons';
const app = createApp(App);
// const ref = new Ref(app);

// TODO тормознулся переход на этапе использования 'vue-property-decorator' для реализции кода в TypeScript стиле, Работа стопорнулась в Login.vue.
app.config.globalProperties.$API_ROOT = process.env.VUE_APP_API_ROOT;
app.config.globalProperties.$FILE_PATH = process.env.VUE_APP_FILE_PATH ? process.env.VUE_APP_FILE_PATH : '';
app.config.globalProperties.$VERSION = process.env.VUE_APP_VERSION;
app.use(store).use(router)/* .use(ElementPlus, locale) */.use(i18n).use(VueAxios, axios);
app.component('FontAwesomeIcon', FontAwesomeIcon).mount('#app');
