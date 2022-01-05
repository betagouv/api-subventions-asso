export default interface OsirisMailingAddressColumn {
    readonly adress: string;
    readonly addressComplement: string;
    readonly postalCode: string;
    readonly municipality: string;
    readonly email: string;
    readonly phone: string;
}

export const OsirisMailingAddressColumnKeys = {
    adress: 27,
    addressComplement: 28,
    postalCode: 29,
    municipality: 30,
    email: 31,
    phone: 32,
}