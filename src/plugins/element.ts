import "element-plus/lib/theme-chalk/index.css";
import "@/styles/index.scss"; // global css
import {i18n}  from "@/i18n";
export const locale = {
        /* eslint-disable  @typescript-eslint/no-explicit-any */
    i18n:  (key: any): any => i18n.global.messages[key],
    size: "small"
};
