import shiftsModel from "../models/shift.model.js";
import shiftsWalletModel from "../models/shiftsWallet.model.js";

export default class ShiftsWalletDAO{
    get= async() => await shiftsWalletModel.find().lean();
    create= async (data) => await shiftsWalletModel.create(data); 
    getById= async(id) => await shiftsWalletModel.findById(id).lean();
    getByIdPopulate= async(id) => await shiftsWalletModel.findById(id).populate("shiftsNotConfirmed.shift");
    update= async(id,data) => await shiftsWalletModel.findByIdAndUpdate(id, data, {returnDocument: "after"});
    delete= async(id) => await shiftsModel.findByIdAndDelete(id);
};

