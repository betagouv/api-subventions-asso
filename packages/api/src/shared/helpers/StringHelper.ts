import crypto from "crypto";
import xss from "xss";

export function capitalizeFirstLetter(string: string): string {
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

export function formatIntToTwoDigits(int: number) {
    return ("0" + int).slice(-2);
}

export function formatIntToThreeDigits(int: number) {
    return ("00" + int).slice(-3);
}

export function stringIsFloat(string: string): boolean {
    return /^[\d,.]+$/.test(string) && !isNaN(parseFloat(string));
}

export function stringIsInt(string: string): boolean {
    return /^\d+$/.test(string) && !isNaN(parseInt(string, 10));
}

export function sanitizeToPlainText(unsafe: string): string {
    return xss(unsafe, {
        whiteList: {}, // empty, means filter out all tags
        stripIgnoreTag: true, // filter out all HTML not in the whitelist
        stripIgnoreTagBody: ["script"], // the script tag is a special case, we need
        // to filter out its content
    });
}

export function getMD5(str: string) {
    return crypto.createHash("md5").update(str).digest("hex");
}

export function isStringParam(str) {
    return !!str && typeof str === "string";
}
