import passport from "passport";
import local from "passport-local";
import {OAuth2Strategy as GoogleStrategy} from "passport-google-oauth";
import { PointsWalletService, UserService } from "../service/service.js";
import { createHash, generateToken, isValidpassword } from "../utils.js";
import {GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET,GOOGLE_CALLBACK_URL} from "../config/config.js"


const LocalStrategy = local.Strategy;


const initializePassport = () => {

    passport.use("registerPassport", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    },
        async (req, password, username, done) => {
            const { first_name, last_name, addres, email, age } = req.body;


            try {
                const user = await UserService.getEmail({ email: username });

                const newPointsWallet = await PointsWalletService.create({});
                console.log(newPointsWallet);

                if (user) {
                    console.log("usuario ya existe");
                    return done(null, false);
                }

                const newUser = {
                    first_name,
                    last_name,
                    addres,
                    email,
                    age,
                    password: createHash(password),
                    role,
                    verifiedAccount: "UNVERIFIED",
                    pointsWallet: newPointsWallet._id,
                    service: "local",
                    imageProfile: "usuario.jpg"
                };
                console.log(newUser)
                const result = await UserService.create(newUser);
                return done(null, result);

            } catch (error) {

            };
        }));


    passport.use("loginPassport", new LocalStrategy({
        usernameField: "email"
    },async (username, password, done)=> {
        try {
            const user= await UserService.getEmail({email: username});

            if(!user) return done(null,false);

            if(!isValidpassword(password,user)) return done(null, false)

            const token= generateToken(user);
            user.token= token;
            done(null, user);

        } catch (error) {
            
        }
    }));


    passport.use("googlePassport", new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL
    }, async(profile,done)=>{
        try {
            // busca usuarios ya registrados
            // console.log(profile) //profile tiene todos los datos del user de google
            const user = await UserService.getEmail({ email: profile._json.email });
            //si email existe, genera token y lo loguea
            if (user) {
                const token = generateToken(user);
                user.token = token;
                if (user) return done(null, user);

                // si no existe usuario, lo registra 
            } else {
                const newPointsWallet = await PointsWalletService.create({});
                const newUser = await UserService.create({
                    first_name: profile._json.name,
                    last_name: profile._json.family_name,
                    addres: "desconocida",
                    email: profile._json.email,
                    age,
                    password: " ",
                    role: "user",
                    verifiedAccount:"UNVERIFIED",
                    pointsWallet: newPointsWallet._id,
                    servicio: "Google",
                    imageProfile: profile._json.picture,
                });

                const token = generateToken(newUser);
                newUser.token = token;
                return done(null, newUser);
            }
        } catch (err) {
            return done(`Error to login with Google => ${err.message}`);
        }
    }));



    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await UserService.getById(id);
        done(null, user);
    });
};

export default initializePassport;