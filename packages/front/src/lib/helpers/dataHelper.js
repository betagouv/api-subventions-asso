export const valueOrHyphen = value => value || "-";

export const valueOrNotFound = value => value || "Non trouvé";

export const numberToEuro = value => {
    value = typeof value === "string" ? parseFloat(value) : value;
    if (value === null || isNaN(value)) return value; // null values passes the test
    const nbDigits = value % 1 ? 2 : 0;
    // maximumFractionDigits: check if value have digits if not digits no display N,00
    return value.toLocaleString("fr-FR", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: nbDigits,
        minimumFractionDigits: nbDigits,
    });
};

export const formatPhoneNumber = phoneNumber => {
    if (!phoneNumber) return phoneNumber;
    const normalizedNumber = phoneNumber.replace(/\D/g, "");
    return normalizedNumber.match(/.{1,2}/g)?.join(" ");
};
