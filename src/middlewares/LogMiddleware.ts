
import winston from "winston";
import expressWinston from "express-winston";
import {client} from "../shared/MongoConnection";

import "winston-mongodb";

const LOGGER_SECRET_FIELDS = [
    'password',
    'token',
];

const LOGGER_IGNORED_ROUTES = [
    /^\/docs/,
    /^\/assets/
]

export const expressLogger = () => expressWinston.logger({
    transports: [
        new winston.transports.MongoDB({
            db: Promise.resolve(client),
            options: {
                useNewUrlParser: true,
                poolSize: 2,
                autoReconnect: true,
            },
            metaKey: "meta"
        })
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
        'headers'
    ],
    responseWhitelist: [
        "body",
        "statusCode",
    ],
    ignoreRoute: (req) => {
        if (LOGGER_IGNORED_ROUTES.some(regex => regex.test(req.url))) return true
        return false;
    },
    requestFilter: (req, propName) => LOGGER_SECRET_FIELDS.includes(propName) ? "**********" : req[propName],
    responseFilter: (req, propName) => {
        if (propName === "body" && req[propName]) {
            LOGGER_SECRET_FIELDS.forEach(field => {
                if (!req[propName][field]) return;
                req[propName][field] = "**********";
            });
        }
        return LOGGER_SECRET_FIELDS.includes(propName) ? "**********" : req[propName]
    }
})