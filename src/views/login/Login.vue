<template>
    <div class="login-container">
    <el-form 
      class="login-form"
      :class="windowWidth < 768 ? 'login-form-mobile' : 'login-form-full'"
      autoComplete="on"
      :model="loginForm"
      ref="loginFormElement"
      label-position="left"
    >
      <!-- <div class="title-container">
        <h3 class="title">{{ $t('Login.title') }}</h3>
       <lang-select class="set-language"></lang-select>
      </div> -->
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <font-awesome-icon icon="user" style="width: auto; height: 0.7em;" />
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" :placeholder="$t('Login.form.loginPlaceholder')" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
         <font-awesome-icon icon="unlock-alt" style="width: auto; height: 1em;" />
        </span>
        <el-input name="password" :type="passwordType" @keyup.enter="doLogin" v-model="loginForm.password" autoComplete="on" :placeholder="$t('Login.form.passPlaceholder')" />
        <span class="show-pwd" @click="showPwd">
          <font-awesome-icon :icon="(passwordType === '')? 'eye': 'eye-slash' " style="width: auto; height: 1em;" />
        </span>
      </el-form-item>
      <el-button type="round" plain style="width:100%;margin-bottom:30px" :loading="authProcessLoading" @click.prevent="doLogin" size="medium">{{$t('Login.form.authBtn')}}</el-button>
    </el-form>
  </div>
</template>

<script lang="ts">

import { computed, defineComponent, reactive, ref } from 'vue';
import notificationComposition from "@/compositions/notification_composition";
import authComposition from "@/compositions/auth_composition";
import { useStore } from 'vuex';
import { APP_GETTERS } from '@/store/modules/app';
const LoginView = defineComponent({
  data() {
    return {}
  },
  setup() {
    const store = useStore();
    const windowWidth = computed(() => store.getters[APP_GETTERS.WINDOW_WIDTH]);
    notificationComposition();
    const {
      loginIn,
      showPwd,
      authProcessLoading,
      loginForm,
      passwordType
    } = authComposition();
    const doLogin = () => {
      loginIn(() => { /**/});
    }
    
    return {
      windowWidth,
      showPwd,
      doLogin,
      authProcessLoading,
      loginForm,
      passwordType
    }
  }

});
export default LoginView;
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>


<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#007D7B;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  top:0;
  left:0;
  background: $bg url("/theme/bg.jpg") no-repeat;
  background-size: 100% 100%;
  .login-form {
    background-color: $bg; 
    position: absolute;
    left: 0;
    right: 0;
    margin: 120px auto;
  }
  .login-form-full {
    width: 520px;
    padding: 35px 35px 15px 35px;
  }
  .login-form-mobile {
    width: 100vw;
    padding: 25px 15px 15px 15px;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0px auto 10px auto;
      text-align: center;
      font-weight: bold;
    }
    .more{
      font-size:14px !important
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
}
</style>