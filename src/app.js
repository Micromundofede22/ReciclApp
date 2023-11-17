import express from "express";
import run from "./run.js";
import { PORT, MONGO_URI, MONDO_DB_NAME } from "./config/config.js";
import passport, { session } from "passport";
import initializePassport from "./config/passport.config.js";
import mongoose from "mongoose";

const app= express();


//PASSPORT
app.use(session({
    secret: "secretSessionPassport",
    resave: true,
    saveUninitialized: true
}));
initializePassport();
app.use(passport.initialize());
app.use(passport.session());



try {
    app.listen(PORT, ()=> console.log(`Server up ${PORT}`));

    await mongoose.connect(`${MONGO_URI}${MONDO_DB_NAME}`);

    run(app);
    
} catch (error) {
    console.log(error);
};