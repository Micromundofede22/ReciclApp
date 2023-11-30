import AppRouter from "./app.router.js";
import {getShifts,createShift,getByIdShift,updateShift} from "../controllers/shift.controller.js";


export default class ShiftRouter extends AppRouter{
    init(){
        this.get("/", getShifts);

        this.get("/:sid", getByIdShift); //solo el user, y collector

        this.post("/", createShift);

        this.put("/:sid/confirmed", updateShift); //solo recolector !



    };
};