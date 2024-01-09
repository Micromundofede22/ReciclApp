import mongoose from "mongoose";

const tokenVerifySchema= new mongoose.Schema({
    email: {type: String, required: true},
    token: {type: String, required:true},
    createdAt: {type: Date, default: Date.now}
});

mongoose.set("strictQuery",false);

const tokenVerifyModel= new mongoose.model("token-verify", tokenVerifySchema);

export default tokenVerifyModel;