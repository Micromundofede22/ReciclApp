import AppRouter from "./app.router.js";
import { handlePolicies } from "../middleware/authentication.js";
import {
    createUser,
    offUser,
    onUser,
    createCollector,
    onCollector,
    offCollector
} from "../controllers/accounts.controller.js";

export default class AccountsRouter extends AppRouter{
    init(){
        //create user
        this.post("/user",handlePolicies(["ADMIN", "ADMINCOLLECTOR"]), createUser); //cuenta status active
        //alta user
        this.put("/:uid/onuser",handlePolicies(["ADMIN", "ADMINCOLLECTOR"]), onUser); //uid= user id
        //baja user
        this.put("/:uid/offuser",handlePolicies(["ADMIN", "ADMINCOLLECTOR"]), offUser); //uid= user id

        //create collector
        this.post("/collector",handlePolicies(["ADMIN", "ADMINCOLLECTOR"]), createCollector);
        //alta collector
        this.put("/:cid/on-collector",handlePolicies(["ADMIN", "ADMINCOLLECTOR"]), onCollector);
        //baja collector
        this.put("/:cid/off-collector",handlePolicies(["ADMIN", "ADMINCOLLECTOR"]), offCollector);

        //alta admin-collector

        //baja admin-collector
    };
};