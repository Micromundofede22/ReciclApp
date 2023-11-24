import productsModel from "../models/recycledProducts.model.js";

export default class RecycledProductsDAO{
    create= async(data) => await productsModel.create(data);
    getProducts= async() => await productsModel.find().lean();
    getById= async(id) => await productsModel.findById(id);
    update= async(id,data) => await productsModel.findByIdAndUpdate(id, data, {returnDocument: "after"});
    delete= async(id) => await productsModel.findByIdAndDelete(id);
};