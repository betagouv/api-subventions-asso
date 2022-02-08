/* eslint-disable @typescript-eslint/no-var-requires */
const child_process = require("child_process");

child_process.execSync("git switch -");
child_process.execSync("git stash pop");

console.log("Welcome to your branch !");
