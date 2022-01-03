import { APP_BUS_STATE, APP_GETTERS } from '@/store/modules/app';
import { ElNotification } from 'element-plus'
import { computed, watch } from 'vue';
import { useStore } from 'vuex';

export default function notificationComposition() {
    const store = useStore();
    const showNotification = ({title = "", type = undefined, message = "", setTimeOut = 0, duration = 0 } = {}) => {
        const notification = () => {
            ElNotification({
              title,
              message,
              type,
              duration,
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
}
