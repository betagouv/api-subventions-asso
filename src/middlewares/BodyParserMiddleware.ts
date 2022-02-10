import * as bodyParser from 'body-parser';

export const BodyParserUrlEncoded = bodyParser.urlencoded({
    extended: true
});


export const BodyParserJSON = bodyParser.json();
