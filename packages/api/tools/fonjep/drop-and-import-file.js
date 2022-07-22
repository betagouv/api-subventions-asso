/* eslint-disable @typescript-eslint/no-var-requires */
const child_process = require("child_process");

const appName = process.argv[2];
const fonjepFile = process.argv[3];
const date = new Date();

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

scalingAsyncAppAction("run" ,`--size 2XL --file ${fonjepFile} --env IMPORT_DATE=${date} bash ./packages/api/tools/fonjep/import-file.sh`).then(() => {
    console.log("Extract end !");

    console.log("Downgrad mongodb plan ...")

    // console.log(scalingoAppAction("addons-upgrade", `${mongoId} ${oldPlan}`).toString());

    console.log("Downgrad mongodb plan DONE !")

    console.log(`You can read logs in https://dashboard.scalingo.com/apps/osc-fr1/${appName}/activity/`);

    console.log("PLEASE CHECK IF PLAN OF MONGODB AS BEEN DOWNGRADED");
    
    console.log("Have a good day !");

    process.exit();
})