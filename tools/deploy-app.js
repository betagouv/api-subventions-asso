/* eslint-disable @typescript-eslint/no-var-requires */
const child_process = require("child_process");
const fs = require("fs");

const appName = process.argv[2];
const envVarFile = process.argv[3];
const firstEmail = process.argv[4];


if (process.argv.length < 5) {
    console.error("Please use command: node deploy-app.js [YOUR_APP_NAME] [ENV_VAR_JSON_FILE] [FIRST_USER_EMAIL]");
    return;
}

function scalingoAppAction(action, value) {
    return child_process.execSync(`scalingo --app ${appName} ${action} ${value}`);
}

console.log("Welcome to automation deploy app !\n");

console.log(`Start init ${appName} ...\n`);

console.log(`Creating ENV vars from ${envVarFile}\n`);

const envVar = JSON.parse(fs.readFileSync(envVarFile));

scalingoAppAction('env-set', `JWT_SECRET="${envVar.JWT_SECRET}"`);
scalingoAppAction('env-set', `MAIL_HOST="${envVar.MAIL_HOST}"`);
scalingoAppAction('env-set', `MAIL_PASSWORD="${envVar.MAIL_PASSWORD}"`);
scalingoAppAction('env-set', `MAIL_PORT="${envVar.MAIL_PORT}"`);
scalingoAppAction('env-set', `MAIL_USER="${envVar.MAIL_USER}"`);

const mongoEnv = scalingoAppAction("env", "| grep SCALINGO_MONGO_URL=").toString();
const mongoPartOfUrl = mongoEnv.split("/");
const mongoDBName = mongoPartOfUrl[mongoPartOfUrl.length-1].split("?")[0];

if (!mongoDBName || !mongoDBName.length) {
    console.error("MONGO_DB name not found in SCALINGO_MONGO_URL");
    return;
}

scalingoAppAction('env-set', `MONGO_DBNAME="${mongoDBName}"`);

console.log("Env var has been set\n");

console.log("Creating the first user:", firstEmail);

console.log(scalingoAppAction("run", `node ./build/src/cli.js user create ${firstEmail}`).toString());

console.log("Add role admin to", firstEmail);

console.log(scalingoAppAction("run", `node ./build/src/cli.js user setRoles ${firstEmail} admin`).toString());

console.log("User has been created, please use forget-password !");