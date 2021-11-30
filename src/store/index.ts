import { Store, createStore, useStore } from "vuex";
import VuexORM from "@vuex-orm/core";
import database from "./database";
import routes from "./modules/routes";
import auth from "./modules/auth";
import lang from "./modules/lang";
import app from "./modules/app";
export class StoreService {
  private static _instance: StoreService;
  /* private _store: Store<any>; */
  private constructor(){
    /* this._store =  */createStore({
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
    return useStore();
  }
  public static get Instance(): StoreService {
      return this._instance?? new this();
  }
}
