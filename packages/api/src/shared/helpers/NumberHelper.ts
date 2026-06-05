/**
 * Used to add two nullable values
 *
 * @param previous value to be increased
 * @param next value to add
 * @returns aggregation of values, previous value or next value
 */
export function addWithNull(toBeIncreased: number | null, toAdd: number | null) {
    if (toBeIncreased && toAdd) return toBeIncreased + toAdd;
    if (toBeIncreased) return toBeIncreased;
    return toAdd;
}

export function santitizeFloat(value) {
    if (!value || typeof value === "number") return value;

    return parseFloat(value.replaceAll("\r", "").replaceAll(" ", "").replaceAll(",", "."));
}

export function parseAmount(raw) {
    if (!raw) return raw;
    if (typeof raw === "number") return raw;

    if (typeof raw === "string") {
        const sanitizedRaw = raw.replaceAll(" ", ""); // 1 000,50 => 1000,50

        // Both separators present
        if (sanitizedRaw.includes(",") && sanitizedRaw.includes(".")) {
            const commaPos = sanitizedRaw.indexOf(",");
            const dotPos = sanitizedRaw.indexOf(".");
            if (commaPos < dotPos) {
                return parseFloat(sanitizedRaw.replace(/,/g, "")); // 1,000.50 => 1000.50
            } else {
                return parseFloat(sanitizedRaw.replace(/\./g, "")); // 1.000,50 => 1000.50
            }
        }

        if (sanitizedRaw.includes(",")) {
            const parts = sanitizedRaw.split(",");
            const lastPart = parts[parts.length - 1];
            // If comma used for thousands
            if (lastPart.length === 3)
                return parseFloat(sanitizedRaw.replace(/,/g, "")); // 1,000 → 1000
            else return parseFloat(sanitizedRaw.replace(",", ".")); // 1000,50 => 1000.50
        }

        return parseFloat(sanitizedRaw);
    }

    return raw;
}
