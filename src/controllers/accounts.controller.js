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

    const result = await CollectorService.create(newCollector);
    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

export const onCollector = async (req, res) => {
  try {
    const cid = req.params.cid;
    const collector = await CollectorService.getById(cid);
    if (!collector) return res.sendRequestError("Petición incorrecta");
    collector.status = "active";
    const result = await CollectorService.update({ _id: cid }, collector);
    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

export const offCollector = async (req, res) => {
  try {
    const cid = req.params.cid;
    const collector = await CollectorService.getById(cid);
    if (!collector) return res.sendRequestError("Petición incorrecta");
    collector.status = "inactive";
    const result = await CollectorService.update({ _id: cid }, collector);
    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

export const createAdmincollector = async (req, res) => {
  try {
    const data = req.body;
    const newPointsWallet = await PointsWalletService.create({});
    const newshiftsWallet = await ShiftsWalletService.create({});

    const newAdminCollector = {
      first_name: data.first_name,
      last_name: data.last_name,
      street: data.street,
      height: data.height,
      email: data.email,
      age: data.age,
      password: createHash(data.password),
      role: "admincollector",
      verifiedAccount: "UNVERIFIED",
      status: "active",
      shiftsWallet: newshiftsWallet._id,
      pointsWallet: newPointsWallet._id,
      service: "local-admin",
      imageProfile: "admincollector.jpg",
    };
    const result = await CollectorService.create(newAdminCollector);
    if (!result) return res.sendRequestError("Petición incorrecta");
    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

export const onAdmincollector = async (req, res) => {
  try {
    const acid = req.params.acid;
    const admincollector = await CollectorService.getById(acid);
    if (!admincollector) return res.sendRequestError("Petición incorrecta");
    admincollector.status = "active";
    const result = await CollectorService.update({ _id: acid }, admincollector);
    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

export const offAdmincollector = async (req, res) => {
  try {
    const acid = req.params.acid;
    const admincollector = await CollectorService.getById(acid);
    if (!admincollector) return res.sendRequestError("Petición incorrecta");
    admincollector.status = "inactive";
    const result = await CollectorService.update({ _id: acid }, admincollector);
    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

export const uploadDocuments = async (req, res) => {
  try {
    const userToken = req.user.tokenInfo;
    const uid = req.params.uid.toString();
    if (uid != userToken._id.toString())
      return res.unauthorized("No autorizado");

    const user = await UserService.getById(uid);
    const documentsCurrent = user.documents;
    const files = req.files; //documentos
    // console.log(files);

    //dni
    if (
      files.dni &&
      !documentsCurrent.some((item) => item.name.includes("dni"))
    ) {
      documentsCurrent.push({
        name: files.dni[0].filename,
        reference: files.dni[0].path
      });
    } else if (files.dni) {
      documentsCurrent.forEach((item) => {
        if (item.name.includes("dni")) {
          item.name = files.dni[0].filename,
          item.reference = files.dni[0].path
        }
      });
    }
    //servicio con addres
    if (
      files.addres &&
      !documentsCurrent.some((item) => item.name.includes("addres"))
    ) {
      documentsCurrent.push({
        name: files.addres[0].filename,
        reference: files.addres[0].path
      });
    } else if (files.addres) {
      documentsCurrent.forEach((item) => {
        if (item.name.includes("addres")) {
          item.name = files.addres[0].filename,
          item.reference = files.addres[0].path
        }
      });
    }
    //si user cargo ambos documentos, su cuenta se activa
    if (documentsCurrent.length == 2) {
      await UserService.update(uid, { status: "active" });
    }

    await UserService.update(uid, { documents: documentsCurrent });
    res.sendSuccess(
      "Archivos subidos con éxito. Su cuenta ya se encuentra activa. Ya puede pedir turnos para retirar sus materias primas. Gracias! Tu labor, será recompensada."
    );
  } catch (error) {
    res.sendServerError(error.message);
  }
};
