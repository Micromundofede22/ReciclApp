import SessionRouter from "./routers/session.router.js";
import RecycledProductsRouter from "./routers/recycledProducts.router.js";
import PointsWalletRouter from "./routers/pointsWallet.router.js";
import ShiftsWalletRouter from "./routers/shiftsWallet.router.js";
import ShiftRouter from "./routers/shift.router.js";
import AccountsRouter from "./routers/accounts.router.js";
import {passportCall} from "./middleware/passportCall.js"

const run = (app) => {

    //instancio routers
    const sessionRouter = new SessionRouter();
    const recycledproductsrouter = new RecycledProductsRouter();
    const pointswalletrouter = new PointsWalletRouter();
    const shiftswalletrouter= new ShiftsWalletRouter();
    const shiftrouter= new ShiftRouter();
    const accountsrouter= new AccountsRouter();

    //endpoint
    app.use("/api/session", sessionRouter.getRouter());                    //sesiones
    app.use("/api/recycled-products", recycledproductsrouter.getRouter()); //productos a reciclar
    app.use("/api/points-wallet", pointswalletrouter.getRouter());         //biletera puntos
    app.use("/api/shifts-wallet",passportCall("jwt"), shiftswalletrouter.getRouter()); //billetera turnos
    app.use("/api/shift", passportCall("jwt"),shiftrouter.getRouter());    //turnos
    app.use("/api/accounts",passportCall("jwt"), accountsrouter.getRouter());
};


export default run;