import { ShiftsService, ShiftsWalletService } from "../service/service.js";

export const getShifts= async(req,res) => {
    try {
        const result= await ShiftsService.get();
        if(!result) return res.sendRequestError("Petición incorrecta");

        res.sendSuccess(result);
    } catch (error) {
        res.sendServerError(error.message)
    }
};

export const getByIdShift= async(req,res) => {
    try {
        const sid= req.params.sid;
        const result= await ShiftsService.getById(sid);
        if(!result) return res.sendRequestError("petición incorrecta");
        res.sendSuccess(result);
    } catch (error) {
        res.sendServerError(error.message)
    };
};

export const createShift= async(req,res) => {
    try {
        const data= req.body;
        const result= await ShiftsService.create(data);
        if(!result) return res.sendRequestError("Petición incorrecta, turno no agendado");
        res.sendSuccess(result);
    } catch (error) {
        res.sendServerError(error.message);
    }
};

export const updateShift= async(req,res) => {
    try {

        const sid= req.params.sid;
        const collector= req.body.collector;
        // const collector= req.user.userToken.firstname   hacer handlepolice y tomar sus datos del token

        const shiftNotConfirmed= await ShiftsService.getById(sid); 
        
        if(!shiftNotConfirmed) return res.sendRequestError("Petición incorrecta");
        
        //cambio el estado del turno de "pending" a "confirmed"
        shiftNotConfirmed.state= "confirmed";
        //cambio collector "pending" por el del  recolector que toma el turno
        shiftNotConfirmed.collector= collector;

        //nro de recoleccion del recolector
        // const shiftsConfirmed= await ShiftConfirmedService.get();
        // const numberRecollection= shiftsConfirmed.filter(item => item.collector == collector);
        // shiftNotConfirmed.recollectionNumberCollector= numberRecollection.length > 0 ? numberRecollection.length : 0;
        
        
        // console.log(shiftNotConfirmed);
        // //creamos el turno confirmado en la coleccion shift-confirmed
        // const result= await ShiftConfirmedService.create(shiftNotConfirmed);


        res.sendSuccess(result);



    } catch (error) {
        res.sendServerError(error.message);
    };
};