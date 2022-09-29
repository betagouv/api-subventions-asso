import passport from 'passport';
import { Express } from "express"
import { IVerifyOptions, Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy } from 'passport-jwt';
import userService from '../modules/user/user.service';
import { JWT_EXPIRES_TIME, JWT_SECRET } from '../configurations/jwt.conf';
import UserDto from "@api-subventions-asso/dto/user/UserDto";
export function authMocks(app: Express) {
    // A passport middleware to handle User login
    passport.use(
        'login',
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
            },
            async (email, password, done) => {
                const result = await userService.login(email, password);
                if (result.success) return done(null, result.user, { message: 'Logged in Successfully' });

                return done(null, false, { message: result.code.toString() }); // It's hack because message accept just string
            }
        )
    );

    // This verifies that the token sent by the user is valid
    passport.use(
        new JwtStrategy(
            {
                secretOrKey: JWT_SECRET,
                jwtFromRequest: (req) => {
                    let token = null;
                    if (req) {
                        token =
                            req.body.token 
                            || req.query.token
                            || req.headers["x-access-token"];
                    }

                    return token;
                },
            },
            async (token, done) => {
                // Find the user associated with the email provided by the user
                const user = await userService.findByEmail(token.email);
                if (!user) {
                    // If the user isn't found in the database, return a message
                    return done(null, false, { message: 'User not found' });
                }

                if (!user.active) {
                    return done(null, false, { message: 'User is not active' });
                }

                if (new Date(token.now).getTime() + JWT_EXPIRES_TIME < Date.now()) {
                    return done(null, false, { message: 'JWT has expired, please login try again' });
                }

                // Send the user information to the next middleware
                return done(null, user, { message: 'Logged in Successfully' });
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user: UserDto, done) => {
        done(null, user);
    });

    app.post("/auth/login", (req, res, next) => {
        passport.authenticate("login", (error, user, info: IVerifyOptions) => {

            console.log(error);
            if (error) return next(error)
            if (user) {
                req.user = user;
            }
            req.authInfo = info;

            next();
        })(req, res, next);
    });

    app.use((req, res, next) => {
        passport.authenticate("jwt", (error, user, info: IVerifyOptions) => {
            if (error) return next(error)
            if (user) {
                req.user = user;
            }
            req.authInfo = info;

            next();
        })(req, res, next);
    })
}
