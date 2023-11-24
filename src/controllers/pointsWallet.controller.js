import { PointsWalletService } from "../service/service.js";

export const getByIdPointsWallet = async (req, res) => {
  //solo el usuario puede acceder a su billetera
  try {
    const wid = req.params.wid; //wallet id
    const result = await PointsWalletService.getById(wid);

    if (!result) return res.sendRequestError("Id no coincide");

    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

export const getWallets = async (req, res) => {
  //solo administradores poder ver todas las billeteras
  try {
    const result = await PointsWalletService.get();
    if (!result) return res.sendError("solicitud errónea");
    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

export const createWallet = async (req, res) => {
    //solo admin
  try {
    const data = req.body;
    const result = await PointsWalletService.create(data);
    if (!result) return res.sendRequestError("Petición incorrecta");
    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

export const updateWallet = async (req, res) => {
  try {
    const wid = req.params.wid;
    const data = req.body;
    const wallet = await PointsWalletService.getById(wid);
    if (!wallet) return res.sendRequestError("Id incorrecto");
    //solo editar puntos aun no habilitados, no habilitados. solo el user puede acceder a esto
    const result = await PointsWalletService.update(wid, {
      notEnabledPoints: data,
    });

    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  };
};

export const deleteWallet= async(req,res)=> {
    //solo administradores
    try {
        const wid= req.params.wid;
        const wallet= await PointsWalletService.getById(wid);
        if(!wallet) return res.sendRequestError("Wallet no encontrada");
        await PointsWalletService.delete(wid);
        res.sendSuccess("Wallet eliminada");
    } catch (error) {
        res.sendServerError(error.message);
    };
};
