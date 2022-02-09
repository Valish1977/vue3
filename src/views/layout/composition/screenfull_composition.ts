/* eslint-disable  @typescript-eslint/no-explicit-any */
import screenfull, { Screenfull } from "screenfull";
import { ElMessageBox, ElMessage } from 'element-plus'
import { useI18n } from "vue-i18n";
import { Data } from "@/enums/enum_other";

const screenfullComposition = (): Data => {
    const {t} = useI18n();
    const fullScreenToggle = (): any => {
      if ( !( screenfull as Screenfull ).enabled ) {
        ElMessageBox.alert(t("notice.brouserNotWork"), 'Title', {
          confirmButtonText: 'OK',
          callback: (action: string) => {
            ElMessage({
              type: 'warning',
              message: `action: ${action}`,
            })
          },
        });
        return false;
      }
      ( screenfull as Screenfull ).toggle();
    }
    return { fullScreenToggle };
}
export default screenfullComposition;