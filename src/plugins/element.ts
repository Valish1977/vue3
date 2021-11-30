import "element-plus/lib/theme-chalk/index.css";
import "@/styles/index.scss"; // global css
import { I18nService } from '@/i18n';
const i18n = I18nService.Instance.i18n;
export const locale = {
        /* eslint-disable  @typescript-eslint/no-explicit-any */
    i18n:  (key: any): any => i18n.global.messages[key],
    size: "small"
};
