import AuthService from "@/core/auth_service";
import { reactive, ref } from "vue-demi";
import { useStore } from "vuex";
export interface LoginForm {
  username: "",
  password: "" 
}
export default function authComposition() {
    const auth = new AuthService(); 
    const store = useStore();
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
      if ( dataResult.type === "success" ) {
        // notice
      } else {
        // notice
      }
      authProcessLoading.value = false;
    }
    return { 
      logOut,
      loginIn,
      authProcessLoading,
      loginForm,
      passwordType
    };
}