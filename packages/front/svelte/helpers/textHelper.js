export function capitalizeFirstLetter(str) {
    return str ? str[0].toUpperCase() + str.slice(1).toLowerCase() : str
}