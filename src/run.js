import SessionRouter from "./routers/session.router.js";
import RecycledProductsRouter from "./routers/recycledProducts.router.js";
import PointsWalletRouter from "./routers/pointsWallet.router.js";
import ShiftRouter from "./routers/shift.router.js";
import {passportCall} from "./middleware/passportCall.js"

const run = (app) => {

    //instancio routers
    const sessionRouter = new SessionRouter();
    const recycledproductsrouter = new RecycledProductsRouter();
    const pointswalletrouter = new PointsWalletRouter();
    const shiftrouter= new ShiftRouter();

    //endpoint
    app.use("/api/session", sessionRouter.getRouter());                    //sesiones
    app.use("/api/recycled-products", recycledproductsrouter.getRouter()); //productos a reciclar
    app.use("/api/points-wallet", pointswalletrouter.getRouter());         //biletera puntos
    app.use("/api/shift", passportCall("jwt"),shiftrouter.getRouter());    //turnos
};


export default run;