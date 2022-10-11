export function capitalizeFirstLetter(str) {
    return str ? str[0].toUpperCase() + str.slice(1).toLowerCase() : str;
}

export function truncate(str, n) {
    return str.length > n ? str.slice(0, n - 1) + "..." : str;
}
