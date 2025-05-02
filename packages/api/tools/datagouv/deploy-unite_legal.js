import { asyncAppAction } from "../helpers/scalingo.helper";

const main = () => {
    const appName = process.argv[2];
    const exportDate = process.argv[3];

    if (process.argv.length < 4) {
        console.error("Please use command: node deploy-unite_legal.js [YOUR_APP_NAME] [DATE_OF_EXPORT(YYYY-MM-DD)]");
        return;
    }

    console.log("Welcome to automation deploy unite legal !\n");

    console.log(`Start deploy ${appName} ...\n`);

    asyncAppAction(
        "run",
        `--size 2XL --env EXPORT_DATE=${exportDate} bash ./packages/api/tools/datagouv/download_parser_unite_legal.sh`,
        appName,
    ).then(() => {
        console.log("Extract end !");

        console.log("Have a good day !");

        process.exit();
    });
};

main();
