import { ShiftsWalletService } from "../service/service.js";


export const getSW= async(req,res) => {
    try {
        const result= await ShiftsWalletService.get();
        if(!result) return res.sendRequestError("Petición incorrecta");
        res.sendSuccess(result);
    } catch (error) {
        res.sendServerError(error.message);
    }
}; 

export const getIdSW= async(req,res) => {
    try {
        const swid= req.params.swid;
        const user= req.user.tokenInfo;
        if(swid != user.shiftsWallet.toString()) return res.sendRequestError("Petición incorrecta")
        const result= await ShiftsWalletService.getByIdPopulate(swid);
        if(!result) return res.sendRequestError("Petición incorrecta");
        res.sendSuccess(result);
    } catch (error) {
        res.sendServerError(error.message);
    }
};

export const createSW= async(req,res) => {
    try {
        const result= await ShiftsWalletService.create({});
        if(result) return res.sendRequestError("Petición incorrecta");

        res.sendSuccess(result);
    } catch (error) {
        res.sendServerError(error.message);
    };
}

export const deleteSW= async(req,res) => {
    try {
        const swid= req.params.swid;
        const result= await ShiftsWalletService.getById(swid);
        if(!result) return res.sendRequestError("Petición incorrecta");
        res.sendSuccess(result);
    } catch (error) {
        res.sendServerError(error.message);
    };
};