import passwordModel from "../models/password.model.js";

export default class PasswordMongoDAO{
    create= async(data) => await passwordModel.create(data);
    getOne= async(data) => await passwordModel.findOne(data);
    delete= async(id) => await passwordModel.findByIdAndDelete(id);
};