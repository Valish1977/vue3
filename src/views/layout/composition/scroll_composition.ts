import { ref } from "vue";

export default function scrollComposition() {
  const scrollPosition = ref(0);
  const scrollContainer = ref(null);
  const scrollWrapper = ref(null);
  const delta = 15;
  const handleScroll = (e: any): any => {
      const eventDelta = e.wheelDelta || -e.deltaY * 3;
      const $container: any = scrollContainer.value;
      const $containerHeight = $container.offsetHeight;
      const $wrapper: any = scrollWrapper.value;
      const $wrapperHeight = $wrapper.offsetHeight;
      if (eventDelta > 0) {
        scrollPosition.value = Math.min(0, scrollPosition.value + eventDelta);
      } else {
        if ($containerHeight - delta < $wrapperHeight) {
          if (scrollPosition.value >= -($wrapperHeight - $containerHeight + delta)) {
            scrollPosition.value = Math.max(
              scrollPosition.value + eventDelta,
              $containerHeight - $wrapperHeight - delta
            );
          }
        } else {
          scrollPosition.value = 0;
        }
      }
    }
    return {
      scrollPosition,
      handleScroll
    }
}