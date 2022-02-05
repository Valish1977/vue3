import { Model } from "@vuex-orm/core";
// models list clients
export default class ThirdCompany extends Model {
  public static entity = "thirdCompanyDb";
  public static fields() {
    return {
        id: this.uid(),
        saved: this.string("").nullable(),
        fname: this.string("").nullable(), // 250
        sname: this.string("").nullable(), // 150
        address1: this.string("").nullable(), // 150
        address2: this.string("").nullable(), // 150
        city: this.string("").nullable(), // 150
        country: this.attr({}),
        country_code: this.string("").nullable(), // 2
        state_code: this.string("").nullable(), // 2
        state:  this.attr(null),
        post_code: this.string("").nullable(), // 15
        phone: this.string("").nullable(), // 50
        email: this.string("").nullable(), // 150
        del: this.boolean(false).nullable(),
        del_dt: this.string("").nullable(),
        del_reason: this.string("").nullable(), // 250
        manager: this.string("").nullable(), // 5
        change_comment: this.string("").nullable()
    };
  }
}
