import winston from "winston";
import expressWinston from "express-winston";
import "winston-mongodb";
import { client } from "../shared/MongoConnection";

const LOGGER_SECRET_FIELDS = ["password", "token", "email", "phoneNumber", "firstName", "lastName", "hashPassword"];

const LOGGER_IGNORED_ROUTES = [/^\/docs/, /^\/assets/];

function recursiveFilter(obj: object) {
    Object.entries(obj).forEach(([key, value]) => {
        if (LOGGER_SECRET_FIELDS.includes(key)) obj[key] = "**********";
        else if (typeof value === "object" && value) recursiveFilter(obj[key]);
    });
}

export const expressLogger = () =>
    expressWinston.logger({
        transports: [
            new winston.transports.MongoDB({
                db: Promise.resolve(client),
                options: {
                    useNewUrlParser: true,
                    poolSize: 2,
                    autoReconnect: true,
                },
                metaKey: "meta",
            }),
        ],
        meta: true,
        msg: "Request: HTTP {{req.method}} {{req.url}}; ipAddress {{req.connection.remoteAddress}}",
        requestWhitelist: [
            "url",
            "method",
            "httpVersion",
            "originalUrl",
            "query",
            "body",
            "user",
            "connection",
            "headers",
        ],
        responseWhitelist: ["statusCode"],
        ignoreRoute: req => {
            return LOGGER_IGNORED_ROUTES.some(regex => regex.test(req.url));
        },
        requestFilter: (req, propName) => {
            if (propName === "body" && typeof req[propName] === "object" && req[propName])
                recursiveFilter(req[propName]);

            // @ts-expect-error strange express-winston types
            // we convert _id into string as a workaround to winston-mongodb bug that serializes them to {}
            if (propName === "user" && req[propName]?._id)
                // @ts-expect-error strange express-winston types
                return recursiveFilter({ ...req[propName], _id: req[propName]._id.toString() });

            return LOGGER_SECRET_FIELDS.includes(propName) ? "**********" : req[propName];
        },
        responseFilter: (req, propName) => {
            if (propName === "body" && typeof req[propName] === "object" && req[propName])
                recursiveFilter(req[propName]);
            return LOGGER_SECRET_FIELDS.includes(propName) ? "**********" : req[propName];
        },
    });
