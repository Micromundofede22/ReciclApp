import { SIGNED_COOKIE_NAME } from "../config/config.js"


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
        .cookie(SIGNED_COOKIE_NAME, req.user.token, { signed: true }) //secreto de la firma está en la app.use
        .redirect("/recycled-products");
}

export const failLogin = (req, res) => {
    res
        .unauthorized(`Error al loguearse. Si se registró y aún no verificó su cuenta de email, 
    revise su correo y confirme con el link que se le envió. Caso contrario vuelva a loguearse`);
};


//google
export const getGoogle= (req,res) => { }

export const googleCallback = (req,res) => {
    res
        .cookie(SIGNED_COOKIE_NAME, req.user.token, { signed: true }) //secreto de la firma está en la app.use
        .redirect("/recycled-products");
};