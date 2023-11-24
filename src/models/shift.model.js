import mongoose from "mongoose";

const shiftsSchema= new mongoose.Schema({
    date: {type: Date, required: true},              //fecha
    hour: {type: Date, required: true},              //hora
    street: {type: String, required: true},          //calle
    height: {type: Number, required:true},           //altura-número
    collector: {type: String, required: true},       //recolector asignado
    user:{type: String, required: true},             //usuario
    recyclingNumber: {type: Number, required: true},  //número de reciclaje del usuario
    points: {type:Number, required:true},
    activatedPoints: {type:Boolean, default: false}

});

mongoose.set("strictQuery", false);

const shiftsModel= new mongoose.model("shifts", shiftsSchema);

export default shiftsModel;