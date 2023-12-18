import { SIGNED_COOKIE_NAME } from "../config/config.js";
import { CollectorService, UserService } from "../service/service.js";

//REGISTER
export const register = (req, res) => {
  res.sendSuccess("ususario registrado");
};

export const failRegister = (req, res) => {
  res.sendRequestError("Fail register");
};

//LOGIN
export const login = (req, res) => {
  res
    .cookie(SIGNED_COOKIE_NAME, req.user.token, { signed: false }) //secreto de la firma está en la app.use
    .status(200)
    .json({ message: "logueado" });
};

export const failLogin = (req, res) => {
  res.unauthorized(`Error al loguearse. Si se registró y aún no verificó su cuenta de email, 
    revise su correo y confirme con el link que se le envió. Caso contrario vuelva a loguearse`);
};

//google
export const getGoogle = (req, res) => {};

export const googleCallback = (req, res) => {
  res
    .cookie(SIGNED_COOKIE_NAME, req.user.token, { signed: true }) //secreto de la firma está en la app.use
    .sendSuccess("Logueado google");
};

//logout
export const logout = (req, res) => {
  try {
    req.session.destroy((err) => {}); //destruyo la session que usa passport
    res.clearCookie(SIGNED_COOKIE_NAME); //limpio la cookie que tiene el token
  } catch (error) {
    res.sendServerError(error.message);
  }
};

export const editProfile = async (req, res) => {
  try {
    const infoToken= req.user.tokenInfo;
    const emailUser = req.params.emailUser;

    if(infoToken.email != emailUser) return res.unauthorized("No autorizado");

    const user = await UserService.getEmail({ email: emailUser });
    const collector= await CollectorService.getOne({email: emailUser});
    if(!user && !collector) return res.sendRequestError("Petición incorrecta");

    const data = req.body;
    
    const newAddres = {
      street: data.street,
      height: data.height
    //   identityDocuments: data.identityDocuments,
    };
    if (user) {
    const userID = user._id.toString();
      await UserService.update(userID, newAddres);
      return res.sendSuccess("Dirección actualizada");
    }
     if(collector){
        const collectorID= collector._id.toString();
        await CollectorService.update({_id: collectorID}, newAddres);
        return res.sendSuccess("Dirección actualizada");
     }
     
  } catch (error) {
    res.sendServerError(error.message);
  }
};


