import { SIGNED_COOKIE_NAME } from "../config/config.js";
import { PasswordService, UserService } from "../service/service.js";
import { sendEmailRestPassword } from "../service/nodemailer.js";
import { createHash, generateRandomString, isValidpassword } from "../utils.js";

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

export const forgetPassword= async(req,res) =>{
  try {
    const email= req.body.email;
    const user= await UserService.getEmail({email:email});
    if(!user) return res.sendRequestError("Petición incorrecta");
    //genero un token en db
    const token= generateRandomString(16);
    await PasswordService.create({email, token});
    sendEmailRestPassword(email, token);
    res.sendSuccess(`Hemos enviado un link a su email ${email} , para resetear la contraseña.`)
  } catch (error) {
    res.sendServerError(error.message);
  };
};

export const verifyToken= async(req,res) => {
  try {
    const tokenParams= req.params.token;
    const token= await PasswordService.getOne({token: tokenParams});
    if(!token) return res.sendRequestError("El token caducó, vuelva a solicitar cambio de contraseña.");
    res.redirect(`/api/session/reset-password/${token.email}`)

  } catch (error) {
    res.sendServerError(error.message);
  };
};

export const resetPassword= async(req,res) => {
  try {
    const newPassword= req.body.password;
    const user= await UserService.getEmail({email: req.params.user});
    if(isValidpassword(user, newPassword)) return res.sendRequestError("Petición incorrecta");
    await UserService.update(user._id, {password: createHash(newPassword) });
    await PasswordService.delete({email: user.email})
    res.sendSuccess("Contraseña cambiada");
  } catch (error) {
    res.sendServerError(error.message);
  }
}




