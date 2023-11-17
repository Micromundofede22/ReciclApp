import SessionRouter from "./routers/session.router.js";

const run= (app) => {

    //instancio routers
    const sessionRouter= new SessionRouter();

    app.use("/api/session", sessionRouter.getRouter());
};

export default run;