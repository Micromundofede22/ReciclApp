import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_PRIVATE_KEY } from "./config/config.js";
import {fileURLToPath} from 'url';
import { dirname } from "path";

//hashea contraseña
export const createHash= (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

//compara contraseñas hasheadas
export const isValidpassword= (user, password) => {
    return bcrypt.compareSync(password, user.password);
};

//genero token 
export const generateToken= (userToken) => {
    const token= jwt.sign({userToken}, JWT_PRIVATE_KEY, {expiresIn:"24h"});
    return token;
};

export const __filename= fileURLToPath(import.meta.url);
export const __dirname= dirname(__filename);


