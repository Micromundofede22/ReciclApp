import SessionRouter from "./routers/session.router.js";
import RecycledProductsRouter from "./routers/recycledProducts.router.js";
import PointsWalletRouter from "./routers/pointsWallet.router.js";

const run = (app) => {

    //instancio routers
    const sessionRouter = new SessionRouter();
    const recycledproductsrouter = new RecycledProductsRouter();
    const pointswalletrouter = new PointsWalletRouter();

    //endpoint
    app.use("/api/session", sessionRouter.getRouter());
    app.use("/api/recycled-products", recycledproductsrouter.getRouter());
    app.use("/api/points-wallet", pointswalletrouter.getRouter()); 
};


export default run;