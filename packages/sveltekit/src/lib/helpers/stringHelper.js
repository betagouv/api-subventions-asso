export function trim(str, length) {
    if (str.length <= length) return str;

    if (length < 3) return str.slice(0, length);

    return str.slice(0, length - 3) + "...";
}

export function isHyphen(str) {
    return str === "-";
}

export function capitalizeFirstLetter(str) {
    return str ? str[0].toUpperCase() + str.slice(1).toLowerCase() : str;
}
