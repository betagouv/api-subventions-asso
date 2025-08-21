import fs from "fs";
import jschardet from "jschardet";

import { FormatDateError } from "../errors/cliErrors/FormatDateError";
import { ObsoleteDateError } from "../errors/cliErrors/ObsoleteDateError";
import { OutOfRangeDateError } from "../errors/cliErrors/OutOfRangeDateError";
import { isDateNewer, isValidDate } from "./DateHelper";

export function printProgress(progress: number, total: number, entities = "entities") {
    printAtSameLine(`${progress} ${entities} save of ${total}`);
}

export function printAtSameLine(text: string) {
    if (process && process.stdout && process.stdout.clearLine) {
        // If false we are on github actions
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
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

/**
 * Detect file encoding and convert it to UTF-8
 *
 * To update this method it requires two things :
 * - add the nomenclature returned by jschardet for the new encoding format
 * - find the corresponding nomenclature for readFileSync encoding option
 *
 * For example, for "windows-1252" returned by jschardet we found that the equivalent in readFileSync was "binary"
 * There is no enumeration or list to build a complete mapping...
 *
 * @param filePath
 * @returns Buffer of well encoded file
 */
export function detectAndEncode(filePath: string) {
    let buffer = fs.readFileSync(filePath);

    const encoding = jschardet.detect(buffer).encoding;
    if (encoding === "UTF-8") return buffer; // we want UTF-8
    if (encoding === "windows-1252") buffer = Buffer.from(fs.readFileSync(filePath, "binary"));
    return buffer;
}
