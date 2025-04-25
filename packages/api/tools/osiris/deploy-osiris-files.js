import child_process, { execSync } from "child_process";
import { readdirSync } from "fs";

// scalingo app name
const appName = process.argv[2];

// i.e : "requests" | "actions"
const importType = process.argv[3];
if (!["requests", "actions"].includes(importType)) throw new Error("import type must be 'requests' or 'actions'");

// directory with xls files OR directory with split zips
const osirisDir = process.argv[4];

// year of exercise (i.e: 2024)
const yearOfFile = process.argv[5];

// option to skip
const skipZip = process.argv[6] || false;

if (process.argv.length < 6) {
    console.error(
        "Please use command: node deploy-osiris-file.js [YOUR_APP_NAME] [OSIRS_FILE_TYPE] [LINK_TO_DATA_DIR_OSIRIS] [YEAR_OF_EXTRACT_FILE]",
    );
    process.exit();
}

function scalingoAppAction(action, value) {
    return child_process.execSync(`scalingo --app ${appName} ${action} ${value}`);
}

function scalingAsyncAppAction(action, value) {
    const child = child_process.spawn(`scalingo`, ["--app", appName, action, ...value.split(" ")], {
        env: process.env,
    });

    return new Promise(resolve => {
        console.log("RUN", `scalingo --app ${appName} ${action} ${value}`);

        child.stdout.on("data", data => {
            console.log(`stdout: ${data}`);
        });

        child.stderr.on("data", data => {
            console.error(`stderr: ${data}`);
        });

        child.on("close", () => {
            resolve();
        });
    });
}

console.log("Welcome to OSIRIS automation deploy files !\n");

if (!skipZip) {
    console.log("Zipping files...\n");

    const zipCmd = `zip -j ${osirisDir}/../${importType}.zip ${osirisDir}/* ; zip ${osirisDir}/../${importType}.zip --out ${osirisDir}/../${importType}-split.zip -s 80m`;
    execSync(zipCmd);
}

const zipDir = skipZip ? osirisDir : `${osirisDir}/../`;

console.log(`Finding files in ${zipDir} ...
`);

const files = readdirSync(`${zipDir}`)
    .filter(f => f.startsWith(`${importType}-split`))
    .map(archiveName => `--file ${zipDir}/${archiveName}`)
    .join(" ");

console.log("Getting scalingo app info... \n");

const addonsInfo = scalingoAppAction("addons", "").toString();
console.log("Scalingo addons info : ", "\n", addonsInfo, "\n");

const mongoId = addonsInfo.split("\n")[3].split("|")[2].trim();
const plan = addonsInfo.split("\n")[3].split("|")[3].trim();

console.log(`MongoDB id : ${mongoId}`);
console.log(`Mongo plan : ${plan}`);
console.log(`Start deploy ${appName} ...\n`);

scalingAsyncAppAction(
    "run",
    `--size 2XL ${files} --env TMP_YEAR_OF_FILE=${yearOfFile} --env IMPORT_TYPE=${importType} bash ./packages/api/tools/osiris/deploy-files-container.sh`,
).then(() => {
    console.log("Extract end !");

    console.log(`You can read logs in https://dashboard.scalingo.com/apps/osc-fr1/${appName}/activity/`);

    console.log("Have a good day !");

    process.exit();
});
