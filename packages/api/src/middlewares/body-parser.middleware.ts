import * as bodyParser from "body-parser";

export const urlEncoded = bodyParser.urlencoded({
    extended: true,
});

export const json = bodyParser.json();
