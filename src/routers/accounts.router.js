import AppRouter from "./app.router.js";
import { handlePolicies } from "../middleware/authentication.js";
import {
    createAdmincollector,
    onAdmincollector,
    offAdmincollector,
    createUser,
    offUser,
    onUser,
    createCollector,
    onCollector,
    offCollector
} from "../controllers/accounts.controller.js";

export default class AccountsRouter extends AppRouter{
    init(){
        //create admincollector
        this.post("/admincollector",handlePolicies(["ADMIN"]), createAdmincollector)
        //alta admincollector
        this.put("/:acid/on-admincollector", handlePolicies(["ADMIN"]), onAdmincollector) //acid= admincollector id
        //baja admincollector
        this.put("/:acid/off-admincollector", handlePolicies(["ADMIN"]), offAdmincollector)
        //create user
        this.post("/user",handlePolicies(["ADMINCOLLECTOR"]), createUser); //cuenta status active
        //alta user
        this.put("/:uid/onuser",handlePolicies(["ADMINCOLLECTOR"]), onUser); //uid= user id
        //baja user
        this.put("/:uid/offuser",handlePolicies(["ADMINCOLLECTOR"]), offUser); //uid= user id

        //create collector
        this.post("/collector",handlePolicies(["ADMINCOLLECTOR"]), createCollector);
        //alta collector
        this.put("/:cid/on-collector",handlePolicies(["ADMINCOLLECTOR"]), onCollector);
        //baja collector
        this.put("/:cid/off-collector",handlePolicies(["ADMINCOLLECTOR"]), offCollector);

        //alta admin-collector

        //baja admin-collector
    };
};