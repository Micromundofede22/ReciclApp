import AppRouter from "./app.router.js";
import {getByIdPointsWallet,getWallets,createWallet,updateWallet, deleteWallet} from "../controllers/pointsWallet.controller.js";

export default class PointsWalletRouter extends AppRouter{
    init(){
        this.get("/", getWallets); //solo admin
        
        this.get("/:wid", getByIdPointsWallet); //solo user y premium (adminCollector accede y habilita)

        this.post("/", createWallet); //admin

        this.put("/:wid", updateWallet); //solo user o premium

        this.delete("/:wid", deleteWallet); //solo admin
    }
}