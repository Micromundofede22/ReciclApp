import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_PRIVATE_KEY, SIGNED_COOKIE_NAME } from "./config/config.js";
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

//genero token (llamado token)
export const generateToken= (tokenInfo) => {
    const token= jwt.sign({tokenInfo}, JWT_PRIVATE_KEY, {expiresIn:"24h"});
    return token;
};

//directorio actual
export const __filename= fileURLToPath(import.meta.url);
export const __dirname= dirname(__filename);

// extraer token de cookie (se usa en la estrategy de JWT en passport)
export const extractCookie = req => {
    return (req && req.cookies) ? req.cookies[SIGNED_COOKIE_NAME] : null;
};

//genera string random
export const generateRandomString= (num)=>{
    return [...Array(num)].map(()=>{
        const randomNum= ~~(Math.random()* 36);
        return randomNum.toString(36)
    })
    .join("")
    .toUpperCase();
};





