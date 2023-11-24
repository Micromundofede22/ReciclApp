import mongoose from "mongoose";

const pointWalletSchema= new mongoose.Schema({
    enabledPoints:{type: Number, default: 0},      //puntos habilitados
    notEnabledPoints: {type: Number, default: 0},  //puntos por habilitar post turno
    pointsRedeemed: {type: Number, default: 0}     //puntos ya canjeados
});

mongoose.set("strictQuery", false);

const pointWalletModel= new mongoose.model("pointsWallet", pointWalletSchema);

export default pointWalletModel;