export function trim(str, length) {
    if (str.length <= length) return str;

    return str.slice(0, length - 3) + "...";
}

export function isHyphen(str) {
    return str === "-";
}

export function capitalizeFirstLetter(str) {
    return str ? str[0].toUpperCase() + str.slice(1).toLowerCase() : str;
}
