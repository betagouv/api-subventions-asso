import { FormatDateError, ObsoleteDateError, OutOfRangeDateError } from "core";
import { isDateNewer, isValidDate } from "./DateHelper";

export function printProgress(progress: number, total: number, entities = "entities") {
    printAtSameLine(`${progress} ${entities} save of ${total}`);
}

export function printAtSameLine(text: string) {
    if (process && process.stdout && process.stdout.clearLine) {
        // If false we are on github actions
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(text);
    } else {
        // Reactivate this to have more logs in CI
        // console.log(text);
    }
}

/**
 * Validate date format (must be YYYY-DD-MM) and do some range check
 *
 * @param dateStr (string) : date string to be validate
 * @returns (boolean)
 */
export function validateDate(dateStr: string) {
    // supposed to be YYYY-MM-DD format
    if (!isValidDate(new Date(dateStr))) throw new FormatDateError();
    if (Number(dateStr.split("-")[0]) < 2018) throw new ObsoleteDateError();
    if (isDateNewer(new Date(dateStr), new Date())) throw new OutOfRangeDateError();
    return true;
}
