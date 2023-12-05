import mongoose from "mongoose";

//cada recolector tendrá su propia billetera de turnos, donde si  irán agendando los turnos que toman
const shiftsWalletSchema = new mongoose.Schema({
  shifts: {
    type: [
      {
        shiftConfirmed: {
          _id: {type: String},
          state: { type: String }, // estado, confirmado o pendiente (lo confirma un recoletor)
          collector: { type: String, required: true }, //recolector asignado
          emailCollector: {type: String, required: true},
          collectionNumberCollector: { type: Number, required: true }, //número de recolecciones del recolector
          done: {type: Boolean,required: true, default: false}, //       //cuando retira cartones, pone true
          date: { type: String, required: true }, //fecha
          hour: { type: String, required: true }, //hora
          street: { type: String, required: true }, //calle
          height: { type: Number, required: true }, //altura-número
          emailUser: { type: String, required: true }, //usuario
          recyclingNumber: { type: Number, required: true }, //número de reciclaje del usuario
          points: { type: Number, required: true }, //puntos acumulados por habilitar
          activatedPoints: { type: Boolean, default: false }, //puntos habilitados true or false
        },
      },
    ],
    default: [],
    _id: false,
  },
});

mongoose.set("strictQuery", false);
const shiftsWalletModel = new mongoose.model(
  "shifts-wallet",
  shiftsWalletSchema
);

export default shiftsWalletModel;
