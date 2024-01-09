import tokenVerifyModel from "../models/tokenVerify.model.js";

export default class TokenVerifyDAO{
    create= async(data) => await tokenVerifyModel.create(data);
    getOne= async(data) => await tokenVerifyModel.findOne(data);
    delete= async(data) => await tokenVerifyModel.deleteOne(data);
}