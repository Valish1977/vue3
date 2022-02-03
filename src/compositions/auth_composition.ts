import { CoreCallback } from "@/core/core_callback";
import { AppPreloadService } from '@/services/app_preload_service';
import StoreService  from "@/store/index";
import AuthService from "@/core/auth_service";
import { reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import RouterService from "@/core/router_service";
import { useRouter } from "vue-router";
import { APP_BUS_STATE, APP_DISPATCH } from "@/store/modules/app";
export interface LoginFormEl {
  username: string,
  password: string 
}
export default function authComposition() {
    const auth = new AuthService(); 
    const appPreloadService = AppPreloadService.Instance;
    const store = useStore();
    const router = useRouter();
    const i18n = useI18n();
    const authProcessLoading = ref(false);
    const loginForm = reactive({ username: "", password: "" } as LoginFormEl);
    const passwordType = ref("password");
    const showPwd = (): void => {
      if (passwordType.value === "password") {
        passwordType.value = "";
      } else {
        passwordType.value = "password";
      }
    }
    const logOut = (): void => {
      auth.logOut(CoreCallback.logOut);
    }
    const loginIn = async (callback: () => void) => {
      authProcessLoading.value = true;
      appPreloadService.startLoader("SignIn.vue  doLogin");
      const result = await auth.loginIn(loginForm.username, loginForm.password, CoreCallback.loginIn);
      appPreloadService.stopLoader("SignIn.vue  doLogin");
      authProcessLoading.value = false;
      if (result.type === "success") {
        callback();
        return;
      }
      store.dispatch(APP_DISPATCH.SET_BUS, {name: APP_BUS_STATE.NOTIFY_BUS, data: {
        title: i18n.t("notify.warning"),
        type: result.type,
        message: i18n.t(result.text),
        setTimeOut: 0,
        duration: 3000
      }});
    }

    return { 
      logOut,
      loginIn,
      showPwd,
      authProcessLoading,
      loginForm,
      passwordType
    };
}
