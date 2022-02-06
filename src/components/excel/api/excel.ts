// load DTO from server and transform to internal format
import AxiosService from "@/core/axios_service";

export default class ExcelApi {
public async getItems(query: any) {
  const items: any = await AxiosService.Instance.axios.get( query ).then(
    (response: any) => {
      if (response.status === 200 || response.status === 206) {
        return response.data;
      } else {
        return false;
      }
    },
    (err: any) => {
      console.log(err);
    }
  ).catch((error: any) => {
    console.log(error);
    return false;
  });
  return items;
}
}
