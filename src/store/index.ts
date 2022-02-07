import { Store, createStore } from "vuex";
import VuexORM from "@vuex-orm/core";
import database from "./database";
import routes from "./modules/routes";
import auth from "./modules/auth";
import lang from "./modules/lang";
import app from "./modules/app";
import filters from "@/components/filters/store/filters";
import excel from "@/components/excel/store/excel";
import clientForm from "./modules/clientForm";
import propertyForm from "./modules/propertyForm";
import orderForm from "./modules/orderForm";
import thirdCompanyForm from "./modules/thirdCompanyForm";
export default class StoreService {
  private static _instance: StoreService;
  private _store: Store<any>;
  private constructor(){
    this._store = createStore({
      strict: true,
      modules: {
        routes,
        auth,
        app,
        lang,
        filters,
        excel,
        clientForm,
        propertyForm,
        orderForm,
        thirdCompanyForm
      },
      plugins: [VuexORM.install(database)]
    });
  }
  public get store(): Store<any> {
    return this._store;
  }
  public static get Instance(): StoreService {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }
}
