import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    street: {type: String, required: true},
    height: {type: Number, required: true},
    email: {type: String, required: true},
    age: {type: Number, required: true},
    role: {type: String, required: true, default: "user", enum: ["user", "premium", "collector","admincollector","admin"]},
    password: {type: String, required: true},
    verifiedAccount: {type: String, default: "UNVERIFIED"},
    pointsWallet: {type: mongoose.Schema.Types.ObjectId , ref: "pointsWallet"}, //billetera de puntos
    recyclingNumber:{type: Number, required: true, default: 1},
    service: {type: String,required: false},
    imageProfile:{type: String, required: false}
});

mongoose.set("strictQuery", false);

const UserModel= new mongoose.model("users", userSchema);

export default UserModel;
