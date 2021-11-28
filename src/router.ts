import { App } from "vue";
import { createWebHistory, createRouter, Router } from "vue-router";
import Error404 from "./views/Error404.vue";
import LoginView from "./views/Login.vue";
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
export {router, resetRouter};
