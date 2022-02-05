import { Model } from "@vuex-orm/core";
// models list propertys
export default class Property extends Model {
  public static entity = "propertyDb";
  public static fields() {
    return {
      id: this.uid(),
      client_id: this.number(null).nullable(),
      client: this.attr(null),
      type_id: this.number(null).nullable(),
      type: this.attr(null),
      lr_id: this.number(null).nullable(),
      code: this.string("").nullable(), // 50
      name: this.string("").nullable(), // 50
      country_code: this.string("").nullable(), // 2
      country: this.attr(null),
      county_code: this.string("").nullable(), // 5
      county: this.attr(null),
      state_code: this.string("").nullable(), // 2
      state: this.attr(null),
      region: this.string("").nullable(), // 50
      city: this.string("").nullable(), // 50
      post_code: this.string("").nullable(), // 15
      location: this.attr(null), // json
      full_address: this.string("").nullable(), // 250
      gm_place_id: this.string("").nullable(), // 250
      formatted_address: this.string("").nullable(), // 250
      description: this.string("").nullable(),
      rate: this.number(0).nullable(),
      entry_code: this.string("").nullable(), // 10
      entry_comment: this.string("").nullable(),
      timezone_code: this.string("").nullable(), // 100
      del: this.boolean(false).nullable(),
      del_dt: this.string("").nullable(),
      del_reason: this.string("").nullable(),
      manager: this.string("").nullable(), // 5
      change_comment: this.string("").nullable()
    };
  }
}
