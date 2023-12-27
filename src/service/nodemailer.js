import nodemailer from "nodemailer";
import { NODEMAILER_USER, NODEMAILER_PASS} from "../config/config.js";


export const sendEmailRestPassword = async (email, token) => {

    let configNodemailer = {
        service: "gmail",
        auth: {
            user: NODEMAILER_USER,
            pass: NODEMAILER_PASS
        }
    };
    let transporter = nodemailer.createTransport(configNodemailer);

    let message = {
        from: NODEMAILER_USER,
        to: email,
        subject: "Restablecer contraseña ",
        html: `<h1>Restablece tu contraseña</h1><hr /> Haz click en el siguiente enlace:
          <a href="http://localhost:8080/api/session/verify-token/${token}">Click Aquí</a>`
    };
    try {
        await transporter.sendMail(message);
    } catch (error) {
        console.log(error);
    };
};
