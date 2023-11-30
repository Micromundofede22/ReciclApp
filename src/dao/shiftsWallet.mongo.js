import shiftConfirmedModel from "../models/shiftsWallet.model.js";

export default class ShiftsWalletDAO{
    get= async() => await shiftConfirmedModel.find().lean();
    create= async (data) => await shiftConfirmedModel.create(data); 
};

