import screenfull, { Screenfull } from "screenfull";
import { ElMessageBox, ElMessage } from 'element-plus'

export default function screenfullComposition($t: any) {
    const fullScreenClick = (): any => {
      if ( !( screenfull as Screenfull ).enabled ) {
        ElMessageBox.alert($t("notice.brouserNotWork"), 'Title', {
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
}