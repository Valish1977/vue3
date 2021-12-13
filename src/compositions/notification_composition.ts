
import { BusState } from '@/config';
import { CoreGetterNames } from '@/core/core_enums';
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
    const notifyBus = computed(() => store.getters[CoreGetterNames.getBusState](BusState.notifyBus))
    watch(notifyBus, (): void => showNotification(store.getters[CoreGetterNames.getBus](BusState.notifyBus)));
}
