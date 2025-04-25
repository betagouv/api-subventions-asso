import child_process from "child_process";

export function asyncAppAction(action, value, appName) {
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
