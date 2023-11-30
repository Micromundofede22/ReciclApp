import AppRouter from "./app.router.js";
import {getByIdPointsWallet,getWallets,createWallet,updateWallet, deleteWallet} from "../controllers/pointsWallet.controller.js";

export default class PointsWalletRouter extends AppRouter{
    init(){
        this.get("/", getWallets);
        
        this.get("/:wid", getByIdPointsWallet);

        this.post("/", createWallet);

        this.put("/:wid", updateWallet);

        this.delete("/:wid", deleteWallet);
    }
}