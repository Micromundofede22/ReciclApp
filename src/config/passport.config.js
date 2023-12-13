import passport from "passport";
import local from "passport-local";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import passport_jwt from "passport-jwt";
import {
  CollectorService,
  PointsWalletService,
  ShiftsWalletService,
  UserService,
} from "../service/service.js";
import {
  createHash,
  generateToken,
  isValidpassword,
  extractCookie,
} from "../utils.js";
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
  JWT_PRIVATE_KEY,
} from "../config/config.js";


const LocalStrategy = local.Strategy;
const JWTStrategy = passport_jwt.Strategy;
const ExtractJWT = passport_jwt.ExtractJwt; //extrae token de cookie


const initializePassport = () => {
  //REGISTER LOCAL
  passport.use(
    "registerPassport",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      //si o si en este orden req, username,password,done
      async (req, username, password, done) => {
        const { first_name, last_name, street, height, email, age, role } = req.body;

        try {
          //registro de recolectores
          if (role == "collector") {
            const collector = await CollectorService.getOne({
              email: username,
            });

            if (collector) {
              console.log("collector ya registrado");
              return done(null, false);
            };

            const shiftsWallet = await ShiftsWalletService.create({});
            const newPointsWallet = await PointsWalletService.create({});

            const newCollector = {
              first_name,
              last_name,
              street,
              height,
              email,
              age,
              password: createHash(password),
              role,
              verifiedAccount: "UNVERIFIED",
              shiftsWallet: shiftsWallet._id,
              pointsWallet: newPointsWallet._id,
              identityDocuments: [],
              service: "local",
              imageProfile: "collector.jpg",
            };
            // console.log("newCollector:", newCollector);
            const result = await CollectorService.create(newCollector);
            return done(null, result);
          }

          //USUARIOS
          const user = await UserService.getEmail({ email: username });

          if (user) {
            console.log("usuario ya existe");
            return done(null, false);
          }
          const newPointsWallet = await PointsWalletService.create({});
          const shiftsWallet = await ShiftsWalletService.create({});
          //registro de usuarios
          const newUser = {
            first_name,
            last_name,
            street,
            height,
            email,
            age,
            password: createHash(password),
            role,
            verifiedAccount: "UNVERIFIED",
            shiftsWallet: shiftsWallet._id,
            pointsWallet: newPointsWallet._id,
            service: "local",
            imageProfile: "usuario.jpg",
          };
          // console.log(newUser);
          const result = await UserService.create(newUser);
          return done(null, result);
        } catch (error) {}
      }
    )
  );

  //LOGIN LOCAL
  passport.use(
    "loginPassport",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          const user = await UserService.getEmail({ email: username });
          const collector = await CollectorService.getOne({ email: username });
          // console.log(user, password);

          if (!user && !collector) return done(null, false);
          
          if(user){
            if (!isValidpassword(user, password)) return done(null, false);
            const token = generateToken(user);
            user.token = token;
            done(null, user);
          }

          if (collector) {
            if (!isValidpassword(collector,password )) return done(null, false);
            const token = generateToken(collector);
            collector.token = token;
            done(null, collector);
          }
        } catch (error) {}
      }
    )
  );

  //GOOGLE
  passport.use(
    "googlePassport",
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
      },
      async (profile, done) => {
        try {
          // busca usuarios ya registrados
          // console.log(profile) //profile tiene todos los datos del user de google
          const user = await UserService.getEmail({
            email: profile._json.email,
          });
          //si email existe, genera token y lo loguea
          if (user) {
            const token = generateToken(user);
            user.token = token;
            if (user) return done(null, user);

            // si no existe usuario, lo registra
          } else {
            const newPointsWallet = await PointsWalletService.create({});
            const newshiftsWallet= await ShiftsWalletService.create({});

            const newUser = await UserService.create({
              first_name: profile._json.name,
              last_name: profile._json.family_name,
              addres: "desconocida",
              email: profile._json.email,
              age,
              password: " ",
              role: "user",
              verifiedAccount: "UNVERIFIED",
              pointsWallet: newPointsWallet._id,
              shiftsWallet: newshiftsWallet._id,
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
      }
    )
  );

  //JWT ESTRATEGY
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([extractCookie]), //extrae la cookie
        secretOrKey: JWT_PRIVATE_KEY, //clave de token para extraer su contenido
      },
      async (jwt_payload, done) => {
        // console.log("jwt_payload:", jwt_payload);
        done(null, jwt_payload); //devuelve contenido del jwt
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await UserService.getById(id);
    done(null, user);
  });
};

export default initializePassport;
