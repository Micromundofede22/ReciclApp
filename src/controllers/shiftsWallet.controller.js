import { RecycledProductsService, ShiftsWalletService } from "../service/service.js";


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
        if(!result) return res.sendRequestError("Petición incorrecta");

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

export const addProductToRecycled= async(req,res) => {
    try {
        const token= req.user.tokenInfo;
        const swid= req.params.swid;
        const pid= req.params.pid;

        if(token.shiftsWallet.toString() != swid) return res.sendRequestError("Petición incorrecta");

        const shiftsWallet= await ShiftsWalletService.getById(swid);
        const product= await RecycledProductsService.getById(pid);

        if(product.category=== "carton"){
            shiftsWallet.productsToRecycled.carton.quantity= product.quantity;
            shiftsWallet.productsToRecycled.carton.points= product.points;
        }
        if(product.category=== "latas"){
            shiftsWallet.productsToRecycled.carton.quantity= product.quantity;
            shiftsWallet.productsToRecycled.carton.points= product.points;
        }
        if(product.category=== "botellasVidrio"){
            shiftsWallet.productsToRecycled.carton.quantity= product.quantity;
            shiftsWallet.productsToRecycled.carton.points= product.points;
        }
        if(product.category=== "botellasPlastico"){
            shiftsWallet.productsToRecycled.carton.quantity= product.quantity;
            shiftsWallet.productsToRecycled.carton.points= product.points;
        }

        const result= await ShiftsWalletService.update(swid, {productsToRecycled: shiftsWallet.productsToRecycled});
        res.sendSuccess(result) 

    } catch (error) {
        res.sendServerError(error.message);
    };
};