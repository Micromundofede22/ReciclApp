import {
  UserService,
  PointsWalletService,
  ShiftsWalletService,
  CollectorService,
} from "../service/service.js";
import { createHash } from "../utils.js";

export const createUser = async (req, res) => {
  try {
    const data = req.body;
    const newPointsWallet = await PointsWalletService.create({});
    const newshiftsWallet = await ShiftsWalletService.create({});
    if (!newPointsWallet && newshiftsWallet)
      return res.sendServerError("Error en nuestro servidor");
    //registro de usuarios
    const newUser = {
      first_name: data.first_name,
      last_name: data.last_name,
      street: data.street,
      height: data.height,
      email: data.email,
      age: data.age,
      password: createHash(data.password),
      role: data.role,
      verifiedAccount: "UNVERIFIED",
      status: "active",
      shiftsWallet: newshiftsWallet._id,
      pointsWallet: newPointsWallet._id,
      service: "local-admin",
      imageProfile: "usuario.jpg",
    };
    const result = await UserService.create(newUser);

    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

export const offUser = async (req, res) => {
  try {
    const uid = req.params.uid;
    const user = await UserService.getById(uid);
    if (!user) return res.sendRequestError("Petición incorrecta");
    user.status = "inactive";
    const result = await UserService.update({ _id: uid }, user);
    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

export const onUser = async (req, res) => {
  try {
    const uid = req.params.uid;
    const user = await UserService.getById(uid);
    if (!user) return res.sendRequestError("Petición incorrecta");
    user.status = "active";
    const result = await UserService.update({ _id: uid }, user);
    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

export const createCollector = async (req, res) => {
  try {
    const data = req.body;
    const newPointsWallet = await PointsWalletService.create({});
    const newshiftsWallet = await ShiftsWalletService.create({});
    if (!newPointsWallet && newshiftsWallet)
      return res.sendServerError("Error en nuestro servidor");
    const newCollector = {
      first_name: data.first_name,
      last_name: data.last_name,
      street: data.street,
      height: data.height,
      email: data.email,
      age: data.age,
      password: createHash(data.password),
      role: data.role,
      verifiedAccount: "UNVERIFIED",
      status: "active", //activo cuando es creado directamente por el admin o admincollector
      shiftsWallet: newshiftsWallet._id,
      pointsWallet: newPointsWallet._id,
      service: "local-admin",
      imageProfile: "collector.jpg",
    };

    const result= await CollectorService.create(newCollector);
    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

export const onCollector = async (req, res) => {
  try {
    const cid= req.params.cid;
    const collector= await CollectorService.getById(cid);
    if(!collector) return res.sendRequestError("Petición incorrecta");
    collector.status= "active";
    const result= await CollectorService.update({_id:cid}, collector);
    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

export const offCollector = async (req, res) => {
  try {
    const cid= req.params.cid;
    const collector= await CollectorService.getById(cid);
    if(!collector) return res.sendRequestError("Petición incorrecta");
    collector.status= "inactive";
    const result= await CollectorService.update({_id:cid}, collector);
    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};
