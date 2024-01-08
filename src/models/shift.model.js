import mongoose from "mongoose";

const shiftsSchema= new mongoose.Schema({
    state: {type: String, default: "pending"},                           // estado, confirmado o pendiente (lo confirma un recoletor)
    collector: {type: String, required: true, default: "pending"},       //recolector asignado
    recollectionNumberCollector: {type: Number, default: 0},
    street: {type: String, required: true},            //calle
    height: {type: Number, required:true},             //altura-número
    date: {
      // 01 - 31
      type: Number,
      maxlength: 2,
    },
    month: {
      // 00 - 11
      type: Number,
      maxlength: 2,
    },
    year: {
      // 2022
      type: Number,
      maxlength: 4,
    },
    time: {
      // 09:15
      type: String,
      maxlength: 5,
    },
    emailUser:{type: String, required: true},          //email usuario
    recyclingNumber: {type: Number, required: true},   //número de reciclaje del usuario
    points: {type:Number, required:true},              //puntos acumulados por habilitar
    activatedPoints: {type:Boolean, default: false},    //puntos habilitados true or false
    productsToRecycled: {
        carton: {
          quantity: { type: Number, default: 0 },
          points: { type: Number, default: 0 },
        },
        latas: {
          quantity: { type: Number, default: 0 },
          points: { type: Number, default: 0 },
        },
        botellasVidrio: {
          quantity: { type: Number, default: 0 },
          points: { type: Number, default: 0 },
        },
        botellasPlastico: {
          quantity: { type: Number, default: 0 },
          points: { type: Number, default: 0 },
        },
      }
 

});

mongoose.set("strictQuery", false);

const shiftsModel= new mongoose.model("shifts-not-confirmed", shiftsSchema);

export default shiftsModel;