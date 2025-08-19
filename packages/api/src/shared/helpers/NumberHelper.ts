/**
 * Used to add two nullable values
 *
 * @param previous value to be increased
 * @param next value to add
 * @returns aggregation of values, previous value or next value
 */
export function addWithNull(toBeIncreased: number | null, toBeAdd: number | null) {
    if (toBeIncreased && toBeAdd) return toBeIncreased + toBeAdd;
    if (toBeIncreased) return toBeIncreased;
    return toBeAdd;
}
