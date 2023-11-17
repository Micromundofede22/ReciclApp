import passport from "passport";
import local from "passport-local";



const LocalStrategy = local.Strategy;


const initializePassport = () => {

    passport.use("registerPassport", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    },
        async (req, username, password, done ) => {
            const {first_name, last_name, addres, email, age, role} = req.body;


            const newUser= {
                first_name,
                last_name,
                addres,
                email,
                age,
                role,
                password,
                verifiedAccount,
                pointsWallet,
                service: "local",
                imageProfile: "usuario.jpg"

            }

        }))
}

export default initializePassport;