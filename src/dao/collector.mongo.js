import collectorModel from "../models/collector.model.js";

export default class CollectorDao{
    create= async(data)=> await collectorModel.create(data);
}