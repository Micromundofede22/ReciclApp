import passport from 'passport';


export const passportCall = strategy => {
    return async(req, res, next) => {
        passport.authenticate(strategy, function(err, user, info) {
            if (err) return next(err);
            if (!user) return res.status(401).json({status:"error", error: info.messages});
            req.user = user;
            // console.log("passportCall:", req.user)
            next();
        })(req, res, next);
    };
};