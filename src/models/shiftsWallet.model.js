import mongoose from "mongoose";

//cada recolector tendrá su propia billetera de turnos, donde si  irán agendando los turnos que toman
const shiftConfirmedSchema = new mongoose.Schema({
  shifts: {
    type: [
      {
        
        state: { type: String }, // estado, confirmado o pendiente (lo confirma un recoletor)
        collector: { type: String, required: true }, //recolector asignado
        recollectionNumberCollector: { type: Number, required: true }, //número de recolecciones del recolector
        date: { type: String, required: true }, //fecha
        hour: { type: String, required: true }, //hora
        street: { type: String, required: true }, //calle
        height: { type: Number, required: true }, //altura-número
        user: { type: String, required: true }, //usuario
        recyclingNumber: { type: Number, required: true }, //número de reciclaje del usuario
        points: { type: Number, required: true }, //puntos acumulados por habilitar
        activatedPoints: { type: Boolean, default: false }, //puntos habilitados true or false
      },
    ],
    default: [],
    _id: false,
  },
});

mongoose.set("strictQuery", false);
const shiftConfirmedModel = new mongoose.model(
  "shifts-wallet",
  shiftConfirmedSchema
);

export default shiftConfirmedModel;
