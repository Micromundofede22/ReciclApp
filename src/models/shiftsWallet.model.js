import mongoose from "mongoose";

//cada recolector tendrá su propia billetera de turnos, donde si  irán agendando los turnos que toman
const shiftsWalletSchema = new mongoose.Schema({
  shiftsNotConfirmed: {
    type: [
      {
        shift: {
          _id: false,
          type: mongoose.Schema.Types.ObjectId,
          ref: "shifts-not-confirmed"
          
        },
      },
    ],
    default: [],
    _id: false,
  },
  shiftsConfirmed: {
    type: [
      {
        shift: {
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
  shiftsFinalized: {
    type: [
      {
        shift: {
          _id: {type: String},
          state: { type: String, default: "finalized" }, 
          collector: { type: String, required: true }, 
          emailCollector: {type: String, required: true},
          collectionNumberCollector: { type: Number, required: true }, //actualizarlo ya q en done se suma 1
          done: {type: Boolean,required: true, default: false}, //       
          date: { type: String, required: true }, 
          hour: { type: String, required: true }, 
          street: { type: String, required: true }, 
          height: { type: Number, required: true }, 
          emailUser: { type: String, required: true }, 
          recyclingNumber: { type: Number, required: true }, //actualizarlo ya q en dondese suma 1
          points: { type: Number, required: true }, //actualizarlos si se modificó en done con kg
        },
      },
    ],
    default: [],
    _id: false,
  },
  //turnos user ausentes
  shiftsAbsents:{ 
    type: [
      {
        shift: {
          _id: {type: String},
          state: { type: String, default: "absent" }, // estado, confirmado o pendiente (lo confirma un recoletor)
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
  shiftsCanceled: {
    type: [
      {
        shift: {
          _id: {type: String},
          state: { type: String, default: "cancelled"}, 
          emailCollector: {type: String, required: true},    
          date: { type: String, required: true }, 
          hour: { type: String, required: true }, 
          street: { type: String, required: true }, 
          height: { type: Number, required: true }, 
          emailUser: { type: String, required: true }, 
          points: { type: Number, required: true }, 
        },
      },
    ],
    default: [],
    _id: false,
  }
});

mongoose.set("strictQuery", false);

const shiftsWalletModel = new mongoose.model(
  "shifts-wallet",
  shiftsWalletSchema
);

export default shiftsWalletModel;
