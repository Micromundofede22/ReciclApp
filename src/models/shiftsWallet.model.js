import mongoose from "mongoose";

//cada recolector tendrá su propia billetera de turnos, donde si  irán agendando los turnos que toman
const shiftsWalletSchema = new mongoose.Schema({
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
  },
  shiftsNotConfirmed: {
    type: [
      {
        shift: {
          _id: false,
          type: mongoose.Schema.Types.ObjectId,
          ref: "shifts-not-confirmed",
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
          _id: { type: String },
          state: { type: String }, 
          collector: { type: String, required: true }, 
          emailCollector: { type: String, required: true },
          collectionNumberCollector: { type: Number, required: true },
          done: { type: Boolean, required: true, default: false }, //       //cuando retira cartones, pone true
          street: { type: String, required: true }, 
          height: { type: Number, required: true }, 
          emailUser: { type: String, required: true }, 
          recyclingNumber: { type: Number, required: true }, 
          points: { type: Number, required: true }, 
          activatedPoints: { type: Boolean, default: false },
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
          _id: { type: String },
          state: { type: String, default: "finalized" },
          collector: { type: String, required: true },
          emailCollector: { type: String, required: true },
          collectionNumberCollector: { type: Number, required: true }, //actualizarlo ya q en done se suma 1
          done: { type: Boolean, required: true, default: false }, 
          street: { type: String, required: true },
          height: { type: Number, required: true },
          emailUser: { type: String, required: true },
          recyclingNumber: { type: Number, required: true }, //actualizarlo ya q en dondese suma 1
          points: { type: Number, required: true }, //actualizarlos si se modificó en done con kg
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
        },
      },
    ],
    default: [],
    _id: false,
  },
  //turnos user ausentes
  shiftsAbsents: {
    type: [
      {
        shift: {
          _id: { type: String },
          state: { type: String, default: "absent" }, 
          collector: { type: String, required: true }, 
          emailCollector: { type: String, required: true },
          collectionNumberCollector: { type: Number, required: true }, 
          done: { type: Boolean, required: true, default: false }, 
          street: { type: String, required: true }, 
          height: { type: Number, required: true }, 
          emailUser: { type: String, required: true }, 
          recyclingNumber: { type: Number, required: true }, 
          points: { type: Number, required: true }, 
          activatedPoints: { type: Boolean, default: false }, 
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
          _id: { type: String },
          state: { type: String, default: "cancelled" },
          emailCollector: { type: String, required: true },
          street: { type: String, required: true },
          height: { type: Number, required: true },
          emailUser: { type: String, required: true },
          points: { type: Number, required: true },
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
