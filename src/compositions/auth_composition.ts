import { CoreCallback } from "@/core/core_callback";
import AuthService from "@/core/auth_service";
import { reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { APP_BUS_STATE, APP_DISPATCH } from "@/store/modules/app";
export interface LoginForm {
  username: "",
  password: "" 
}
export default function authComposition() {
    const auth = new AuthService(); 
    const store = useStore();
    const i18n = useI18n();
    const authProcessLoading = ref(false);
    const loginForm = reactive({ username: "", password: "" } as LoginForm);
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
    const loginIn = async () => {
      authProcessLoading.value = true;
      const dataResult = await auth.loginIn(loginForm.username, loginForm.password, CoreCallback.loginIn);
      authProcessLoading.value = false;
      if (dataResult.type === "success") return;
      store.dispatch(APP_DISPATCH.SET_BUS, {name: APP_BUS_STATE.NOTIFY_BUS, data: {
        title: i18n.t("notify.warning"),
        type: dataResult.type,
        message: i18n.t(dataResult.text),
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