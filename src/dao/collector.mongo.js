import collectorModel from "../models/collector.model.js";

export default class CollectorDao{
    create= async(data)=> await collectorModel.create(data);
    get= async()=> await collectorModel.find();
    getOne= async(data) => await collectorModel.findOne(data);
    getById= async(id) => await collectorModel.findById(id);
    update= async(id,data) => await collectorModel.findByIdAndUpdate(id,data, {returnDocument: "after"});
};