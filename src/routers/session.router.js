import AppRouter from "./app.router.js";
import passport from "passport";
import {register, failRegister} from "../controllers/session.controller.js";



export default class SessionRouter extends AppRouter{
    init(){
        
        this.post("/register",
        passport.authenticate("registerPassport", {failureRedirect: "/api/session/failregister"}),
        register);

        this.get("/failregister", failRegister)


    };

}