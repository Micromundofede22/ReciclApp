import multer from "multer";
import { __dirname } from "../utils.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "dni") {
      cb(null, __dirname + "public/dni");
    }
    if(file.fieldname === "addres"){
        cb(null, __dirname + "/public/addres")
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + file.originalname);
  },
});

export const uploader = multer({ storage });
