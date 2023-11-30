import pointWalletModel from "../models/pointWallet.model.js";

export default class PointsWalletMongoDAO{
    create= async(data) => await pointWalletModel.create(data);
    get= async() => await pointWalletModel.find().lean();
    getById= async(id) => await pointWalletModel.findById(id);
    update= async(id,data) => await pointWalletModel.findByIdAndUpdate(id, data, {returnDocument: "after"});
    delete= async(id) => pointWalletModel.findByIdAndDelete(id);
};