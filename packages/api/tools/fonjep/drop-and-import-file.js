// eslint-disable-next-line @typescript-eslint/no-var-requires
const scalingoHelper = require("../helpers/scalingo.helper");

const appName = process.argv[2];
const fonjepFile = process.argv[3];
const dateString = process.argv[4];

if (process.argv.length < 5) {
    console.error("Please use command: node drop-and-import-file.js [YOUR_APP_NAME] [LINK_TO_DATA] [DATE_OF_EXPORT (DD/MM/YYYY)]");
    process.exit();
}

const [day, month, year] = dateString.split("/");
const date = new Date(year, month + 1, day);

const filePath = fonjepFile.split("/");

console.log("Welcome to automation deploy fonjep file !\n");

console.log(`Start extract on ${appName} ...\n`);


scalingoHelper.asyncAppAction("run" ,`--size 2XL --file ${fonjepFile} --env IMPORT_DATE=${date} --env FILE_NAME=${filePath[filePath.length -1]} bash ./packages/api/tools/fonjep/import-file.sh`, appName).then(() => {
    console.log("Extract end !");

    console.log("Check if data is good, and drop old data table");

    console.log("Have a good day !");

    process.exit();
})