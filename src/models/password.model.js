import mongoose from "mongoose";

const passwordSchema= new mongoose.Schema({
    email: {type: String, ref: "users"},
    token: {type: String, required: true},
    createdAt: {type: Date, default: Date.now, expireAfterSeconds: 3600 } 
});

mongoose.set("strictQuery", false);
const passwordModel= new mongoose.model("password", passwordSchema);

export default passwordModel;