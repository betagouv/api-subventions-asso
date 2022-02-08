/* eslint-disable @typescript-eslint/no-var-requires */
const child_process = require("child_process");

const appName = process.argv[2];

if (process.argv.length < 3) {
    console.error("Please use command: node start-execute-prod.js [YOUR_APP_NAME]");
    return;
}

function scalingoAppAction(action, value) {
    return child_process.execSync(`scalingo --app ${appName} ${action} ${value}`);
}

const data = scalingoAppAction("deployments", "").toString();
const successLine = data.split('\n').find(line => line.includes("success"));

if (!successLine) {
    console.error("Please wait an deploy success before run commande");
    process.exit(1);
}

const parts = successLine.split("|").filter(p => p);

const commitId = parts[parts.length - 2].trim();

child_process.execSync("git add --all");
child_process.execSync("git stash");

child_process.execSync("git checkout " + commitId);

console.log("\nNow your on same version with scalingo container");
console.log("\nBefore start an CLI command please think add MONGO_URL and MONGO_DBNAME env var");