import { Model } from "@vuex-orm/core";
// models list clients
export default class ClientDb extends Model {
  public static entity = "clientDb";
  public static fields() {
    return {
      id: this.uid(),
      saved: this.string("").nullable(),
      user_id: this.number(0).nullable(),
      first_name: this.string("").nullable(), // 150
      last_name: this.string("").nullable(), // 150
      company: this.string("").nullable(), // 250
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
      reg_date: this.string("").nullable(),
      client_status_id: this.number(0).nullable(),
      client_status: this.attr({}),
      active: this.boolean(false).nullable(),
      verified: this.boolean(false).nullable(),
      files: this.attr(""), // json
      prefs: this.attr(null), // json
      prefs_changed: this.attr(null),
      del: this.boolean(false).nullable(),
      del_dt: this.string("").nullable(),
      del_reason: this.string("").nullable(), // 250
      manager: this.string("").nullable(), // 5
      change_comment: this.string("").nullable()
    };
  }
}
