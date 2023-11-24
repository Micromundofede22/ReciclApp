import AppRouter from "./app.router.js";
import passport from "passport";
import { register, failRegister, login, failLogin,getGoogle,googleCallback } from "../controllers/session.controller.js";



export default class SessionRouter extends AppRouter {
    init() {
        //registro
        this.post("/register",
            passport.authenticate("registerPassport", { failureRedirect: "/api/session/failregister" }),
            register);

        this.get("/failregister", failRegister);

        //login
        this.post("/login",
            passport.authenticate("loginPassport", { failureRedirect: "/api/session/faillogin" }),
            login
        );

        this.get("/faillogin",
            failLogin);

        //google
        this.get("/google",
            passport.authenticate("googlePassport", {
                scope: [
                    "https://www.googleapis.com/auth/userinfo.email",
                    "https://www.googleapis.com/auth/userinfo.profile"
                ],
                session: false
            }),
            getGoogle);

        this.get("/googlecallback",
            passport.authenticate("googlePassport", { failureRedirect: '/api/session/faillogin' }),
            googleCallback);


    };

}