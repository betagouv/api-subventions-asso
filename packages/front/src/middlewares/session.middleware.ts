import session from "express-session";
import { MONGO_URL, SESSION_SECRET } from "../shared/config";
import MongoStore from "connect-mongo";

const twoDay = 1000 * 60 * 60 * 24 * 2;

const sessionMiddleware = () => {
    return session({
        secret: SESSION_SECRET || "",
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: MONGO_URL,
            collectionName: "sessions_front"
        }),
        cookie: { maxAge: twoDay },
        resave: false
    });
};

export default sessionMiddleware;
