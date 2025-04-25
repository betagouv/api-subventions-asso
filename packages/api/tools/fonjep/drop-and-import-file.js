import { asyncAppAction } from "../helpers/scalingo.helper";

const appName = process.argv[2];
const fonjepFile = process.argv[3];
const dateString = process.argv[4];

if (process.argv.length < 5) {
    console.error(
        "Please use command: node drop-and-import-file.js [YOUR_APP_NAME] [LINK_TO_DATA] [DATE_OF_EXPORT (YYYY-DD-MM)]",
    );
    process.exit();
}

if (isNaN(new Date(dateString))) {
    console.error("Date is not valid!");
    process.exit();
}

console.log("Welcome to automation deploy fonjep file !\n");

console.log(`Start extract on ${appName} ...\n`);

asyncAppAction(
    "run",
    `--size 2XL --file ${fonjepFile} --env IMPORT_DATE=${dateString} bash ./packages/api/tools/fonjep/import-file.sh`,
    appName,
).then(() => {
    console.log("Extract end !");

    console.log("Check if data is good, and drop old data table");

    console.log("Have a good day !");

    process.exit();
});
