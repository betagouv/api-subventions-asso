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

export function isPhoneNumber(str) {
    // https://stackoverflow.com/a/38484020
    // uncomment below to restrict to French phone numbers
    // const regex = /^(?:(?:\+|00)33|0)[\s-.]*[1-9](?:[\s.-]*\d{2}){4}$/;
    const regex = /^\+?[0-9 .-]+$/;
    return regex.test(str);
}

export function removeWhiteSpace(string) {
    return [...string].filter(char => char !== " ").join("");
}
