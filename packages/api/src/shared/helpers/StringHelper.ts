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

export function removeWhitespace(str: string) {
    if (typeof str !== "string") return str;
    return str.replace(/\s+/g, "");
}

export function sanitizeHeader(value: string): string {
    return value
        .normalize("NFD") // Remove accents + other special characters
        .replace(/[\u0300-\u036f]/g, "") // Remove accents
        .replace(/&/g, " et ") // Replace & with " et "
        .replace(/°/g, "o") // Replace ° with "o"
        .replace(/[^a-zA-Z0-9]+/g, " ") // Replace non-alphanumeric characters with a space
        .trim();
}

export function headerToCamelCase(value: string): string {
    const words = sanitizeHeader(value).split(/\s+/).filter(Boolean); // Split value in words and filter out empty words
    if (!words.length) return "";

    return words
        .map((word, index) => {
            const lower = word.toLowerCase();
            if (index === 0) return lower;
            return lower.charAt(0).toUpperCase() + lower.slice(1);
        })
        .join("");
}
