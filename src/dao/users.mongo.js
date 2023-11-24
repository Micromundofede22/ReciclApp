import UserModel from "../models/user.model.js";

export default class UserMongoDAO{
    create= async(data) => await UserModel.create(data);
    getEmail= async (data) => await UserModel.findOne(data).lean();
    getById= async(id) => await UserModel.findById(id);
};