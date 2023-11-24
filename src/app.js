import express from "express";
import handlebars from "express-handlebars"
import session from "express-session";
import run from "./run.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { __dirname } from "./utils.js";
import {
    PORT,
    MONGO_URI,
    MONDO_DB_NAME,
    SIGNED_COOKIE_SECRET
} from "./config/config.js";

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(SIGNED_COOKIE_SECRET));


//PASSPORT
app.use(session({
    secret: "secretSessionPassport",
    resave: true,
    saveUninitialized: true
}));
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//handlebars
app.engine('handlebars', handlebars.engine({
    helpers: { //permiten realizar if en las plantillas
        igual: function (value, value2) {
            if (value == value2) {
                return true;
            }
        }
    }
}));
app.set('views', __dirname + "/views");
app.set('view engine', 'handlebars');


try {
    app.listen(PORT, () => console.log(`Server up ${PORT}`));

    await mongoose.connect(`${MONGO_URI}${MONDO_DB_NAME}`);


    run(app);

} catch (error) {
    console.log(error);
};