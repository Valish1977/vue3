import { DateTime } from "luxon";
export enum CONVERT_DATA {
  FORMAT = "MM-dd-yyyy"
}
interface CustomDataTimeFormat {
  date: DateTime,
  str: string
}
export class Convert {
  
    public static parse_URL(url: string): any {
        const a: any = document.createElement("a");
        a.href = window.location;
        const location = {
          source: url,
          protocol: a.protocol.replace(":", ""),
          host: a.hostname,
          port: a.port,
          query: a.search,
          params: (() => {
            const ret: any = {};
            const seg: any = a.search.replace(/^\?/, "").split("&");
            const len: any = seg.length;
            let i: any = 0;
            let s: any;
            for (; i < len; i++) {
              if (!seg[i]) {
                continue;
              }
              s = seg[i].split("=");
              ret[s[0]] = s[1];
            }
            return ret;
          })(),
          //eslint-disable-next-line
          file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ""])[1],
          hash: a.hash.replace("#", ""),
          //eslint-disable-next-line
          path: a.pathname.replace(/^([^\/])/, "/$1"),
          //eslint-disable-next-line
          relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ""])[1],
          segments: a.pathname.replace(/^\//, "").split("/")
        };
        return location;
    }
    
    public static getDate = (name = "", value: string | null = null, format: string = CONVERT_DATA.FORMAT): CustomDataTimeFormat => {
      const location = Convert.parse_URL("");
      const dateNow = DateTime.local();
      let date = dateNow;
      if (name === "" ) {
         // если отсутствует значение возвращаем текущую дату
          return {date: DateTime.local(), str: DateTime.local().toFormat(format)};
      } else if ( value && value.indexOf("-") !== -1 ) {
         // если передаем значение даты в виде строки, парсим ее
        const a = value.split("-");
        date = DateTime.fromObject({
          year: parseInt(a[2], 10),
          month: parseInt(a[0], 10),
          day: parseInt(a[1], 10)
        });
      } else {
         // если запрашиваем дату по имени поля
        if (!location.params[name]) {
          if (name === "dateOut") {
            date = dateNow.plus({days: 1});
          } else {
            date = dateNow;
          }
        } else {
          date = DateTime.fromFormat(location.params[name], format);
          if (!date.isValid) {
            date = dateNow;
          }
          if (name === "dateOut") {
            let dateIn = DateTime.fromFormat(location.params.dateIn, format);
            if (!date.isValid) {
              dateIn = dateNow;
            } else {
              dateIn = dateIn < dateNow ? dateNow : dateIn;
            }
            if ( date <= dateIn ) {
              date = dateIn.plus({days: 1});
            }
          } else {
            date = date < dateNow ? dateNow : date;
          }
        }
      }
      return {date, str: date.toFormat(format)};
    }
}