/* eslint-disable @typescript-eslint/no-var-requires */
const child_process = require("child_process");

const appName = process.argv[2];
const linkUniteLegal = process.argv[3];
const nessesaryMongoPlan = "mongo-business-2048";


if (process.argv.length < 4) {
    console.error("Please use command: node deploy-unite_legal.js [YOUR_APP_NAME] [LINK_TO_DATA_ON_DATAGOUV]");
    return;
}

function scalingoAppAction(action, value) {
    return child_process.execSync(`scalingo --app ${appName} ${action} ${value}`);
}

function scalingAsyncAppAction(action, value) {
    const child = child_process.spawn(`scalingo`, ['--app', appName, action, ...value.split(" ")], { env: process.env});

    return new Promise(resolve => {
        console.log("RUN", `scalingo --app ${appName} ${action} ${value}`);

        child.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });
        
        child.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
        
        child.on('close', () => {
            resolve()
        });
    })
}

console.log("Welcome to automation deploy unite legal !\n");

console.log("Get mongodb id and mongo plan\n");

const addonsInfo = scalingoAppAction("addons", "").toString();
console.log(addonsInfo);

const mongoId = addonsInfo.split("\n")[3].split("|")[2].trim();
const oldPlan = addonsInfo.split("\n")[3].split("|")[3].trim();

console.log(`Mongodb id found : ${mongoId}`);
console.log(`Current plan : ${oldPlan}`);

console.log(`Upgrade Plan of mongodb ${oldPlan} to ${nessesaryMongoPlan} ...`);

console.log(scalingoAppAction("addons-upgrade", `${mongoId} ${nessesaryMongoPlan}`).toString());

console.log(`Upgrade Plan of mongodb ${oldPlan} to ${nessesaryMongoPlan} DONE !`);

console.log(`Start deploy ${appName} ...\n`);


scalingAsyncAppAction("run" ,`--size 2XL --env TMP_LAST_FILE_DATGOUV=${linkUniteLegal} bash ./tools/betagouv/download_parser_unite_legal.sh`).then(() => {
    console.log("Extract end !");

    console.log("Downgrad mongodb plan ...")

    console.log(scalingoAppAction("addons-upgrade", `${mongoId} ${oldPlan}`).toString());

    console.log("Downgrad mongodb plan DONE !")

    console.log(`You can read logs in https://dashboard.scalingo.com/apps/osc-fr1/${appName}/activity/`);

    console.log("PLEASE CHECK IF PLAN OF MONGODB AS BEEN DOWNGRADED");
    
    console.log("Have a good day !");

    process.exit();
});
