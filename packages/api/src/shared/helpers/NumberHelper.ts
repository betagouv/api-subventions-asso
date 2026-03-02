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
