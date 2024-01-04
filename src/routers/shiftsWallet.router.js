import AppRouter from "./app.router.js";
import {
  getSW,
  getIdSW,
  createSW,
  deleteSW,
  addProductToRecycled
} from "../controllers/shiftsWallet.controller.js";
import { handlePolicies } from "../middleware/authentication.js";

export default class ShiftsWalletRouter extends AppRouter {
  init() {
    this.get("/", handlePolicies(["ADMIN"]), getSW); //solo admin. trae todas las shiftswallets

    this.get(
      "/:swid",
      handlePolicies(["USER", "PREMIUM", "COLLECTOR"]),
      getIdSW
    ); //shiftswallet ID. solo user, premium y collector traen sus propias sw

    this.post("/", handlePolicies(["ADMIN"]), createSW); //solo admin puede crear shifts wallet

    this.delete("/:swid/delete", handlePolicies(["ADMIN"]), deleteSW); //solo admin

    this.post("/:swid/recycled/:pid",  handlePolicies(["USER", "PREMIUM"]), addProductToRecycled);
  };
};
