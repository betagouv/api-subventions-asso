export default interface OsirisAssociationColumn {
    readonly rna: string;
    readonly siret: string;
    readonly sirepa: string;
    readonly name: string;
    readonly acronym: string;
    readonly active: string;
    readonly headquarters: string;
    readonly structureType: string;
    readonly structureSportsType: string;
    readonly postalCode: string;
    readonly inseeCode: string;
    readonly territorialActionZone: string;
    readonly iban: string;
    readonly bic: string;
}

export const OsirisAssociationColumnKeys = {
    rna: 13,
    siret: 14,
    sirepa: 15,
    name: 16,
    acronym: 17,
    active: 18,
    headquarters: 19,
    structureType: 20,
    structureSportsType: 21,
    postalCode: 22,
    inseeCode: 23,
    territorialActionZone: 24,
    iban: 25,
    bic: 26,
}