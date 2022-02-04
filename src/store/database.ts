import { Database } from "@vuex-orm/core";
import clientModel from "@/store/models/ClientDb";
import clientModule from "@/store/modules/clientDb";

const database = new Database();

database.register(clientModel, clientModule);
export default database;