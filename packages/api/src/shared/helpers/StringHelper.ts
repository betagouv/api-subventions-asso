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
    return /[d,.]+/.test(string) && !isNaN(parseFloat(string));
}

export function stringIsInt(string: string): boolean {
    return /d+/.test(string) && !isNaN(parseInt(string, 10));
}
