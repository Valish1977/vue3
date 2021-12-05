import { BusState } from "@/config";
import AuthService from "@/core/auth_service";
import { CoreActionNames } from "@/enums/core_enums";
import { reactive, ref } from "vue-demi";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
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
      auth.logOut();
    }
    const loginIn = async () => {
      authProcessLoading.value = true;
      
      const dataResult = await auth.loginIn(loginForm.username, loginForm.password);
      authProcessLoading.value = false;
      if (dataResult.type === "success") return;
      store.dispatch(CoreActionNames.setBus, {name: BusState.notifyBus, data: {
        title: i18n.t("notify.warning"),
        type: dataResult.type,
        message: i18n.t(dataResult.text),
        setTimeOut: 500,
        duration: 3000
      }});
    }
    return { 
      logOut,
      loginIn,
      authProcessLoading,
      loginForm,
      passwordType
    };
}