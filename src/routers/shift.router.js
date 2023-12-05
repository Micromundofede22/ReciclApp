import AppRouter from "./app.router.js";
import {
  getShifts,
  createShift,
  getByIdShift,
  updateShiftConfirmed,
  updateDoneShift,
  finalizedProcess
} from "../controllers/shift.controller.js";
import { handlePolicies } from "../middleware/authentication.js";

export default class ShiftRouter extends AppRouter {
  init() {
    this.get("/", getShifts);

    this.get("/:sid", getByIdShift); //solo el user, y collector

    this.post("/", handlePolicies(["USER"]), createShift); //solo user y premium

    this.put("/:sid/confirmed",handlePolicies(["COLLECTOR"]), updateShiftConfirmed); //solo recolector. Confirma turno y lo mete en su shiftswallet

    this.put("/:scid/done", updateDoneShift); //(scid= Shift Confirmed id)solo recolectores

    this.put("/:cid/finalized", finalizedProcess) //(cid= collector ID)solo el admincollector puede acceder aca 
  }
}
