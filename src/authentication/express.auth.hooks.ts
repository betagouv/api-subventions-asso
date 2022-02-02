import passport from 'passport';
import { Express } from "express"
import {Strategy as LocalStrategy} from 'passport-local';
import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';
import userService from '../modules/user/user.service';
import { JWT_SECRET } from '../configurations/jwt.conf';
import { UserWithoutSecret } from '../modules/user/entities/User';

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
                
                return done(null, false, { message: result.message });
            }
        )
    );
    
    // This verifies that the token sent by the user is valid
    passport.use(
        new JwtStrategy(
            {
                secretOrKey: `${JWT_SECRET}`,
    
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            },
            async (token, done) => {
                // Find the user associated with the email provided by the user
                const user = await userService.findByEmail(token.email);
                if (!user) {
                    // If the user isn't found in the database, return a message
                    return done(null, false, { message: 'User not found' });
                }
    
                // Send the user information to the next middleware
                return done(null, user, { message: 'Logged in Successfully' });
            }
        )
    );
    
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    
    passport.deserializeUser((user: UserWithoutSecret, done) => {
        done(null, user);
    });

    app.post("/auth/login", passport.authenticate("login"));
}
