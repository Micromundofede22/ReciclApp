import UserModel from "../models/user.model.js";

export default class UserMongoDAO{
    create= async(data) => await UserModel.create(data);
    get= async() => await UserModel.find();
    getEmail= async (data) => await UserModel.findOne(data).lean();
    getById= async(id) => await UserModel.findById(id);
    update= async(id,data) => await UserModel.findByIdAndUpdate(id,data);
    delete= async(id) => await UserModel.findByIdAndDelete(id);
};