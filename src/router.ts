import { App } from "vue";
import { useStore } from 'vuex';
import { createWebHistory, createRouter, Router } from "vue-router";
import { AppPreloadService, PreloaderSettersName, HelloPreloaderOpacitySettings } from './services/app_preload_service';
import Error404 from "./views/Error404.vue";
import LoginView from "./views/Login.vue";
export class RouterService{
  
const store = useStore();
const appPreloadService = AppPreloadService.Instance;
const createRouterSelf = () => createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      name: "error404",
      component: Error404,
      meta: { showToolbar: false, showDrawer: false, showAddItem: false, showInMenu: false }
    },
    {
      path: process.env.BASE_URL + "/login",
      name: "login",
      component: LoginView,
      meta: { showToolbar: false, showDrawer: false, showAddItem: false, showInMenu: false }
    },
    
  ]
});

const router: Router = createRouterSelf();
const resetRouter = function resetRouterFn(app: App<Element>): void {
  const newRouter: Router = createRouterSelf();
 //  TODO: проверить на правильность реализацию newRouter.install(app);
  newRouter.install(app);
};
let redirectRoute = false;
router.beforeEach((to: any, from: any, next: any) => {
  if ( !redirectRoute ) {
    if (to.matched.length > 0) {
      // если роут существует и не выбросит в редирект
      // навешиваем обработчик на false - нужно чтобы запустить лоадер дабы показать загрузку страницы
      appPreloadService.startLoader(PreloaderSettersName.RouterBeforeEach, HelloPreloaderOpacitySettings.OpacityMedium);
    }
  }
  setTimeout(() => {  // this delay is necessary for "loading.." window has time to appear
    // console.log("beforeEach",to.path, to.matched.length)
    // console.log(router)
    if (to.matched.length > 0) { // is route exist?
      switch ((to.path).toLowerCase()) { // route processing
        case "/login":
          if (store.getters.getUser.auth ) {
            redirectRoute = true;
            next(store.getters.getFirstRoute(store.getters.getUser.RoleCode));
          } else {
            if (to.path === "/") {
              next(store.getters.getFirstRoute(store.getters.getUser.RoleCode));
            }
            next();
          }
          break;
        default:
          if (to.path === "/") {
            next(store.getters.getFirstRoute(store.getters.getUser.RoleCode));
          }
          return next();
      }
    } else {
      next(store.getters.getFirstRoute(store.getters.getUser.RoleCode));
      // next("/404"); if route isn"t exist go to /404
    }
  }, 500);
});
// eslint-disable-next-line
router.afterEach((to: any) => {
  store.dispatch("setCurrentRoute", to); // без этого не работает пагинация !!!
  appPreloadService.stopLoader(PreloaderSettersName.RouterAfterEach);
});
}
