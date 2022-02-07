import { APP_BUS_STATE, APP_DISPATCH, APP_GETTERS } from '@/store/modules/app';
import { ElNotification } from 'element-plus'
import { computed, watch } from 'vue';
import { useStore } from 'vuex';

export default function notificationComposition() {
    const store = useStore();
    const showNotification = ({title = "", type = undefined, message = "", setTimeOut = 0, duration = 0, dangerouslyUseHTMLString = false } = {}) => {
        const notification = () => {
            ElNotification({
              title,
              message,
              type,
              duration,
              dangerouslyUseHTMLString
            });
        }
        if (setTimeOut) {
            setTimeout(() => {
                notification();
            }, setTimeOut);
          } else {
            notification()
          }
    }
    const notifyBus = computed(() => store.getters[APP_GETTERS.GET_BUS_STATE](APP_BUS_STATE.NOTIFY_BUS))
    watch(notifyBus, (): void => showNotification(store.getters[APP_GETTERS.GET_BUS](APP_BUS_STATE.NOTIFY_BUS)));

    // example notify fn
    /* const setNotify = ({
      title = "",
      type = "",
      text = "",
      setTimeOut = 0,
      duration = 5000,
    }) => {
      store.dispatch(APP_DISPATCH.SET_BUS, {
        name: APP_BUS_STATE.NOTIFY_BUS,
        data: { title, type, text, setTimeOut, duration },
      });
    }; */
    return {
      //
    }
}
