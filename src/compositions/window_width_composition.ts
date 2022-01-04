

import { APP_DISPATCH } from '@/store/modules/app';
import { onMounted } from 'vue';
import { useStore } from 'vuex';

export default function windowWidthComposition() {
    const store = useStore();
    // appSseComposition();
    const onMountFn = (): void => {
      setWindowInnerSize();
      window.onresize = () => {
        setWindowInnerSize();
      };
    };
    const setWindowInnerSize = () => {
      store.dispatch(APP_DISPATCH.SET_WINDOW_WIDTH, window.innerWidth);
      store.dispatch(APP_DISPATCH.SET_WINDOW_HEIGHT, window.innerHeight);
    }
    onMounted(onMountFn)
    /* switch (true) {
      case this.windowWidth > 992 && this.windowWidth <= 1200:
        // 992-1200
        break;
      case this.windowWidth > 768 && this.windowWidth <= 992:
        // 768-992
        break;
      case this.windowWidth > 576 && this.windowWidth <= 768:
        // 576-768
        break;
      case this.windowWidth > 320 && this.windowWidth <= 576:
        // 320-576
        break;
      default:
        // 1200+
        break;
    } */
    return {
      //
    }
}