import { Database } from "@vuex-orm/core";
import clientModel from "@/store/models/ClientDb";
import clientModule from "@/store/modules/clientDb";
import propertyModule from "@/store/modules/propertyDb";
import propertyModel from "@/store/models/PropertyDb";
import orderModel from "@/store/models/OrderDb";
import orderModule from "@/store/modules/orderDb";
import thirdCompanyModel from "@/store/models/ThirdCompanyDb";
import thirdCompanyModule from "@/store/modules/thirdCompanyDb";

const database = new Database();

database.register(clientModel, clientModule);
database.register(propertyModel, propertyModule);
database.register(orderModel, orderModule);
database.register(thirdCompanyModel, thirdCompanyModule);
export default database;