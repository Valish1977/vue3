import Vuex, { Store } from "vuex";
import VuexORM from "@vuex-orm/core";
import database from "./database";
import routes from "./modules/routes";
import auth from "./modules/auth";
import lang from "./modules/lang";
import app from "./modules/app";
export class StoreService {
  private static _instance: StoreService;
  private _store: Store<any>;
  private constructor(){
    this._store = new Vuex.Store({
      strict: true,
      modules: {
        routes,
        auth,
        app,
        lang
      },
      plugins: [VuexORM.install(database)]
    });
  }
  public get store(): Store<any> {
    return this._store;
  }
  public static get Instance(): StoreService {
      return this._instance?? new this();
  }
}
