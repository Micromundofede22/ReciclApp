import shiftsModel from "../models/shift.model.js";

export default class ShiftsMongoDao{
    create= async(data) => await shiftsModel.create(data);
    get= async() => await shiftsModel.find().lean();
    getById= async(id) => await shiftsModel.findById(id);
    update= async(id,data) => await shiftsModel.findByIdAndUpdate(id,data, { returnDocument: "after" });
    delete= async(id) => await shiftsModel.findByIdAndDelete(id);
};