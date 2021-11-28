import Vuex from "vuex";
import VuexORM from "@vuex-orm/core";
import database from "./database";
import routes from "./modules/routes";
import auth from "./modules/auth";
import lang from "./modules/lang";
import app from "./modules/app";

const store = new Vuex.Store({
  strict: true,
  modules: {
    routes,
    auth,
    app,
    lang
  },
  plugins: [VuexORM.install(database)]
});

export default store;
