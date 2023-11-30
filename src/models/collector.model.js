import mongoose from "mongoose";

const collectorSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  addres: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number, required: true },
  role: {
    type: String,
    required: true,
    default: "collector",
    enum: ["collector", "admincollector"],
  },
  password: { type: String, required: true },
  verifiedAccount: { type: String, default: "UNVERIFIED" },
  shiftsWallet: { type: mongoose.Schema.Types.ObjectId, ref: "shifts-wallet" }, //billetera de puntos
  identityDocuments: {
    type: [
      {
        imageDNI: { type: String, required: false }, //luego ponerla como obligatoria
      },
    ],
    default: [],
  },
  service: { type: String, required: false },
  imageProfile: { type: String, required: false },
});

const collectorModel= new mongoose.model("collector", collectorSchema);

export default collectorModel;
