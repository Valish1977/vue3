import PropertyApi from "@/domain/api/property";
import { Data } from "@/enums/enum_other";
import { APP_GETTERS } from "@/store/modules/app";
import { DateTime, Interval } from "luxon";
import { computed, onMounted, reactive, Ref, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";

export default function calendarComposition(lrID: Ref<string | null>) {
    const store = useStore();
    const { t } = useI18n();
    const calendarLoading = ref(false);
    
    const calendarList = reactive<Data[]>([]);
    const dates = reactive<Data[]>([]);
    const months = reactive<Data[]>([]);
    const windowWidth = computed(() => store.getters[APP_GETTERS.WINDOW_WIDTH]);
    let dtIn: any = null;
    const params: Data = {
      countDays: 10,
      nextStep: 10,
    };
    const colorsRate: any = ["#99A9BF", "#F7BA2A", "#FF9900"];
    params.countDays =
      (windowWidth.value -
        (windowWidth.value < 768 ? 0 : 300) -
        (windowWidth.value % 60)) /
      60;
    const step = (params.countDays - (params.countDays % 4)) / 4;
    params.nextStep = step < 2 ? 1 : step;
    onMounted(() => {
      calculateDate();
      getCalendarList();
    });
    function nextDate(): void {
        dtIn = dtIn.plus({ days: params.nextStep });
        getCalendarList();
      }
      function prevDate (): void {
        dtIn = dtIn.minus({ days: params.nextStep });
        getCalendarList();
      }
      function nowDate (): void {
        dtIn = DateTime.local();
        getCalendarList();
      }
      function calculateDate(): void {
        if (dtIn === null) {
          dtIn = DateTime.local().startOf("day");
        }
      }
  
    async function getCalendarList() {
        calendarLoading.value = true;
        const startDate = dtIn.minus({ days: 30 });
        const endDate = dtIn.plus({ days: params.countDays });
        const startDateString = startDate.toFormat(
          t("filters.components.CompDate.formatTemplateValue") as string
        );
        const endDateString = endDate.toFormat(
          t("filters.components.CompDate.formatTemplateValue") as string
        );
        let days = 0;
        const interval = Interval.fromDateTimes(startDate, endDate)
          .toDuration("days")
          .toObject();
        if (interval.days) {
          days = Math.ceil(interval.days);
        }
        getHeaderDates(dtIn.minus({ days: 2 }), days - 28);
        if (lrID.value) {
          const list = await PropertyApi.getCalendarList(
            `?property=${lrID.value}&startDate=${startDateString}&endDate=${endDateString}`
          );
          calendarList.splice(0, calendarList.length);
          let reservation: any;
          for (let i = 0; i < days; i++) {
            let prevDateObject: any;
            let selfDateObject: any;
            const selfDate = startDate.plus({ days: i });
            const selfDateStr = selfDate.toFormat(
              t("filters.components.CompDate.formatTemplateValue") as string
            );
            // смотрим еслть ли резервация на предыдущее число
            if (reservation !== undefined) {
              prevDateObject = Object.assign({}, reservation);
              if (reservation.checkOut === selfDateStr) {
                reservation = undefined;
              }
            }
            // получаем резервацию на сегодняшнее число
            if (list.data.length > 0 && reservation === undefined) {
              reservation = list.data.find((k: any) => k.checkIn === selfDateStr);
            }
            // уже получена резервация на сегодняшнее число
            if (reservation !== undefined) {
              selfDateObject = Object.assign({}, reservation);
            }
  
            const colors = getColorClass(prevDateObject, selfDateObject);
            const split =
              prevDateObject !== undefined &&
              selfDateObject !== undefined &&
              prevDateObject.reservationId !== selfDateObject.reservationId;
            calendarList.push({
              date: selfDate.toFormat(
                t("filters.components.CompDate.formatTemplateValue") as string
              ),
              bgColor: colors.colorClass,
              weekday: selfDate.weekday,
              split,
            });
          }
        } else {
          calendarList.splice(0, calendarList.length);
          let date = startDate;
          for (let i = 0; i < days; i++) {
            date = startDate.plus({ days: i });
            calendarList.push({
              date: date.toFormat(
                t("filters.components.CompDate.formatTemplateValue") as string
              ),
              weekday: date.weekday,
              split: false,
              bgColor: "free",
            });
          }
        }
        calendarList.splice(0, 29); // удаляем первые 29 элементов
        calendarLoading.value = false;
      }
  
      function getColorClass(prevItem: any, selfItem: any): any {
        let prev = "free";
        let self = "free";
        if (prevItem) {
          // если предыдущая дата не свободна
          prev = getColor(prevItem);
        }
        self = getColor(selfItem);
        if (prev !== self) {
          self = prev + "-" + self;
        }
        if (prevItem && selfItem) {
          if (prevItem.reservationId !== selfItem.reservationId) {
            self += " split";
          }
        } else if ((prevItem && !selfItem) || (!prevItem && selfItem)) {
          self += " split";
        }
        return { colorClass: self };
      }
      function getColor (item: any): string {
        if (!item) {
          return "free";
        }
        if (item.reservationType === "AdministrationBlock") {
          return "blocked";
        }
        if (item.reservationType === "Guest") {
          return "booked-int";
        }
        if (item.reservationType === "Owner") {
          return "booked-own";
        }
        if (item.reservationType === "Comp") {
          return "booked-exist-cl";
        }
        return "free";
      }
  
      function getHeaderDates(startDate: any, daysAmount: number): void {
        dates.splice(0, dates.length);
        months.splice(0, months.length);
        let date = startDate.setLocale(store.getters.language);
        for (let i = 0; i < daysAmount; i++) {
          if (i === 0) {
            continue;
          }
          date = startDate.plus({ days: i }).setLocale(store.getters.language);
          if (
            months.length === 0 ||
            months[months.length - 1].month !== date.monthLong
          ) {
            months.push({ month: date.monthLong, year: date.year, days: 0 });
          }
          months[months.length - 1].days = months[months.length - 1].days + 1;
          dates.push({
            date: date.toFormat(
              t("filters.components.CompDate.formatTemplateValue") as string
            ),
            weekday: date.weekday,
            weekdayShort: date.weekdayShort,
            day: date.day,
            monthLong: date.monthLong,
          });
        }
      }
    return {
      calendarLoading,
      calendarList,
      dates,
      months,
      nowDate,
      prevDate,
      nextDate,
      colorsRate,
      getCalendarList
    };
}