import { Data } from "@/enums/enum_other";
import { DateTime } from "luxon";

const dateConvert = (): Data => {
    const getDateTime = (date: string): string => {
        if (DateTime.fromISO(date).isValid) {
          return DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_SHORT);
        } else if (DateTime.fromSQL(date).isValid) {
          return DateTime.fromSQL(date).toLocaleString(DateTime.DATETIME_SHORT);
        } else {
          return "";
        }
      }
      const getDate = (date: string): string => {
        return date !== null ? DateTime.fromISO(date).toLocaleString() : "";
      }
      return {
        getDateTime,
        getDate
      }
}
export default dateConvert;