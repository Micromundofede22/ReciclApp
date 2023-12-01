import collectorModel from "../models/collector.model.js";

export default class CollectorDao{
    create= async(data)=> await collectorModel.create(data);
    getOne= async(data) => await collectorModel.findOne(data);
    getById= async(id) => await collectorModel.findById(id);
};