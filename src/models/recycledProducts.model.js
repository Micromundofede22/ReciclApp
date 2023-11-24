import mongoose from "mongoose";

const ProductsSchema= new mongoose.Schema({
    product: {type: String, required: true},
    kg: {type: Number, required: true},
    category: {type: String, required: true},
    code: {type: Number, required: true, unique: true},
    points: {type: Number, required: true},
    thumbnails: {type: [String], default: []}
});

mongoose.set("strictQuery", false);
const productsModel= new mongoose.model("recycled-products", ProductsSchema);

export default productsModel;