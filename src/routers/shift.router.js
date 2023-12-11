import AppRouter from "./app.router.js";
import {
  getShifts,
  createShift,
  getByIdShift,
  updateShiftConfirmed,
  updateDoneShift,
  finalizedProcess,
  cancelShift,
  cancelCollectorShift,
  cancelAdminCollectorShift
} from "../controllers/shift.controller.js";
import { handlePolicies } from "../middleware/authentication.js";

export default class ShiftRouter extends AppRouter {
  init() {
    this.get("/",handlePolicies(["COLLECTOR"]), getShifts); //trae turnos sin confirmar

    this.get("/:sid",handlePolicies(["COLLECTOR"]), getByIdShift); //solo el user, y collector

    this.post("/", handlePolicies(["USER", "PREMIUM"]), createShift); //solo user y premium

    this.put("/:sid/confirmed",handlePolicies(["COLLECTOR"]), updateShiftConfirmed); //solo recolector. Confirma turno y lo mete en su shiftswallet

    this.put("/:scid/done",handlePolicies(["COLLECTOR"]), updateDoneShift); //(scid= Shift Confirmed id)solo recolectores

    this.put("/:cid/finalized",handlePolicies(["ADMINCOLLECTOR"]), finalizedProcess); //(cid= collector ID)solo el admincollector. HABILITA POINTS 
  
    this.delete("/:sid/cancel",handlePolicies(["USER"]), cancelShift);

    this.delete("/:scid/cancel-collector",handlePolicies(["COLLECTOR"]), cancelCollectorShift);

    this.delete("/:cid/cancel/:scid/admin-collector",handlePolicies(["ADMINCOLLECTOR"]),cancelAdminCollectorShift )

  }
}
