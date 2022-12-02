export const valueOrHyphen = value => value || "-";

export const numberToEuro = value => {
    if (isNaN(value)) return;
    value = typeof value === "string" ? parseFloat(value) : value;
    // maximumFractionDigits: check if value have digits if not digits no display N,00
    return value.toLocaleString("fr-FR", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: value % 1 ? 2 : 0
    });
};

export const formatPhoneNumber = phoneNumber => {
    if (!phoneNumber) return phoneNumber;
    const normalizedNumber = phoneNumber.replace(/\D/g, "");
    return normalizedNumber.match(/.{1,2}/g)?.join(" ");
};
