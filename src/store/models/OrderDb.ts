import { Model } from "@vuex-orm/core";
export default class Order extends Model {
  public static entity = "orderDb";
  public static fields() {
    return {
      id: this.uid(),
      saved: this.string("").nullable(),
      user_id: this.number(null).nullable(),
      user: this.attr(null),
      client_id: this.number(null).nullable(),
      client: this.attr(null),
      property_id: this.number(null).nullable(),
      property: this.attr(null),
      order_type_id: this.number(null).nullable(),
      order_type: this.attr(null),
      charged_from_id: this.number(null).nullable(),
      charged_from: this.attr(null),
      order_status_id: this.number(null).nullable(),
      order_status: this.attr(null),
      order_status_dt: this.string("").nullable(),
      order_status_comment: this.string("").nullable(), // 250
      scheduled_dt: this.string("").nullable(), // дата и время начала работ запланированная
      scheduled_date: this.string("").nullable(), // дата начала работ запланированная
      next_arrival_dt: this.string("").nullable(), // дата и время следующего заезда
      next_arrival_date: this.string("").nullable(), // дата следующего заезда
      owner_arrival: this.boolean(false).nullable(), // приезжает овнер
      due_date: this.string("").nullable(), // дата до которой необходимо сделать
      start_dt: this.string("").nullable(), // дата, время начала ордера
      start_date: this.string("").nullable(), // дата, время начала ордера
      done_dt: this.string("").nullable(), // дата, время окончания ордера
      done_date: this.string("").nullable(), // дата, время окончания ордера
      plan_min: this.number(1).nullable(), // планируемо времени работ в минутах (будет рассчитываться нейронкой)
      total_min: this.number(1).nullable(), // всего времени работ в минутах
      time_table: this.attr(null),   // таблица с периодами работ
      task_count: this.number(0).nullable(), // кол-во задач в заказе
      task_count_done: this.number(0).nullable(), // кол-во выполненных задач в заказе
      task_json: this.attr(null),   // таблица с тасками
      comment_json: this.attr(null),   // таблица с комментариями
      worker_id: this.number(null).nullable(),
      worker: this.attr(null),
      title: this.string("").nullable(), // 250
      priority_lvl: this.number(1).nullable(),
      checks: this.attr(""), // json
      total_sum: this.number(null).nullable(),
      entry_code: this.string("").nullable(), // 10
      third_company: this.boolean(false).nullable(), //  при true значении -> работу выполняет сторонняя компания
      third_company_id: this.number(null).nullable(), // 250 Наименование компании которая будет выполнять работы
      third_company_obj: this.attr(null),
      touch_up: this.boolean(false).nullable(), // необходима уборка после проведенных работ
      manager: this.string("").nullable(), // 5
      change_comment: this.string("").nullable(),
      work_start_dt: this.string("").nullable() // приостановлена задача - указывается дата и время, либо null
    };
  }
}
