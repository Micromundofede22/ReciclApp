import SessionRouter from "./routers/session.router.js";

export default run= (app) => {

    //instancio routers
    const sessionRouter= new SessionRouter();

    app.use("/api/session", sessionRouter.getRouter())
}