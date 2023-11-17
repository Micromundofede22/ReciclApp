import express from "express";
import run from "./run.js";

const app= express();



try {

    app.listen(8080, ()=> console.log("Conectado"));
    run(app);
    
} catch (error) {
    console.log(error);
};