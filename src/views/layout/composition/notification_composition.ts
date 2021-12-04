import { AppStoreGetters } from '@/config';
import { ElNotification } from 'element-plus'
import { computed, watch } from 'vue';
import { useStore } from 'vuex';
export default function notificationComposition() {
    const store = useStore();
    const showNotification = ({title = "", message = "", setTimeOut = 0, duration = 0 } = {}) => {
        const notification = () => {
            ElNotification({
              title,
              message,
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
    const notifyBus = computed(() => store.getters[AppStoreGetters.getBusState]("setNotifyBus"))
    watch(notifyBus, (): void => showNotification(store.getters[AppStoreGetters.getBus]("setNotifyBus")));
}