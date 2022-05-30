export default class CliLogger {
    private logStack: unknown[] = [];

    /**
     * Use this function if you want log as save in log file but not show in console
     * @param {unknown[]} args
     */
    log(...agrs: unknown[]) {
        this.logStack.push(...agrs);
    }

    /**
     * Use this function if you want log show in console pending run and save in log file
     * @param {unknown[]} args
     */
    logIC(...args: unknown[]) {
        console.info(...args);
        this.log(...args);
    }

    getLogs(): string {
        return this.logStack.join(" ");
    }
}