import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import dayjs from "dayjs";
import { NODEMAILER_USER, NODEMAILER_PASS } from "../config/config.js";

export const sendEmailValidation = async (email, first_name) => {
  //ENVÍO DE EMAIL AL REGISTRARSE
  let configNodemailer = {
    service: "gmail",
    auth: {
      user: NODEMAILER_USER,
      pass: NODEMAILER_PASS,
    },
  };
  let transporter = nodemailer.createTransport(configNodemailer);

  let MailGenerator = new Mailgen({
    theme: "cerberus",
    product: {
      //encabezado
      name: "ReciclApp",
    //   link: "http://reciclapp.com", //link clikeable a pagina web
      // logo: "",
      // logoHeight: "30px"
    },
  });
  let content = {
    //cuerpo del mensaje
    body: {
      name: first_name,
      intro: `Bienvenido a ReciclApp. Es un placer que seas parte de nuestra comunidad recicladora. Haz click en el siguiente botón para verificar tu cuenta.`,
      action: {
        button: {
          color: "#22BC66",
          text: "Confirme su cuenta",
          link: `http://localhost:8080/api/session/verify-user/${email}`,
        },
      },
      dictionary: {
        Fecha: dayjs().format("DD/MM/YYYY HH:mm"),
      },
      signature: false,
    },
  };
  let mail = MailGenerator.generate(content);

  let message = {
    from: NODEMAILER_USER,
    to: email,
    subject: "🍀Validación de cuenta🍀",
    html: mail,
  };
  try {
    await transporter.sendMail(message);
  } catch (error) {
    logger.error(error);
  }
};

export const sendEmailRestPassword = async (email, token) => {
  let configNodemailer = {
    service: "gmail",
    auth: {
      user: NODEMAILER_USER,
      pass: NODEMAILER_PASS,
    },
  };
  let transporter = nodemailer.createTransport(configNodemailer);

  let message = {
    from: NODEMAILER_USER,
    to: email,
    subject: "Restablecer contraseña ",
    html: `<h1>Restablece tu contraseña</h1><hr /> Haz click en el siguiente enlace:
          <a href="http://localhost:8080/api/session/verify-token/${token}">Click Aquí</a>`,
  };
  try {
    await transporter.sendMail(message);
  } catch (error) {
    console.log(error);
  }
};
