import winston from "winston";
import expressWinston from "express-winston";
import "winston-mongodb";
import { client } from "../shared/MongoConnection";

const LOGGER_SECRET_FIELDS = ["password", "token", "email", "phoneNumber", "firstName", "lastName", "hashPassword"];

const LOGGER_IGNORED_ROUTES = [/^\/docs/, /^\/assets/];

const CENSORED_VALUE = "**********";

function recursiveFilter(obj: object) {
    Object.entries(obj).forEach(([key, value]) => {
        if (LOGGER_SECRET_FIELDS.includes(key)) obj[key] = CENSORED_VALUE;
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

            if (propName === "headers" && req[propName]?.["x-access-token"])
                req[propName]["x-access-token"] = CENSORED_VALUE;
            if (propName === "headers" && req[propName]?.["cookie"])
                req[propName]["cookie"] = (req[propName]["cookie"] as string).replaceAll(
                    /token=([^;]*)(; )?/g,
                    `token=${CENSORED_VALUE}$2`,
                );

            return LOGGER_SECRET_FIELDS.includes(propName) ? CENSORED_VALUE : req[propName];
        },
        responseFilter: (req, propName) => {
            if (propName === "body" && typeof req[propName] === "object" && req[propName])
                recursiveFilter(req[propName]);
            return LOGGER_SECRET_FIELDS.includes(propName) ? CENSORED_VALUE : req[propName];
        },
    });
