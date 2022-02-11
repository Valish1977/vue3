import { Data } from "@/enums/enum_other";
import { DateTime } from "luxon";
import { useI18n } from "vue-i18n";
export default function datepickerComposition(): Data {
    const { t } = useI18n();
    const selfDate = DateTime.local().toFormat(t("filters.components.CompDate.formatTemplateValue") as string);
    const defaultTime = new Date(2000, 1, 1, 12, 0, 0);
    const shortcuts = [
        {
            text: "Today",
            value: () => {
                return new Date()
            },
        },
        {
            text: "Yesterday",
            value: () => {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24);
                return date
            },
        },
        {
            text: "A week ago",
            value: () => {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                return date
            },
        },
    ];

    function disabledDate(time: Date): boolean {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24);
        return time.getTime() < date.getTime();
    }
    return {
        shortcuts,
        disabledDate,
        defaultTime,
        selfDate
    }
}