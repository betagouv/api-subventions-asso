export default interface OsirisActionAffiliatingFederationColumn {
    readonly federation: string;
    readonly licensees: number;
    readonly licenseesMen: string;
    readonly licenseesWomen: string;
}

export const OsirisActionAffiliatingFederationColumnKeys = {
    federation: 37,
    licensees: 38,
    licenseesMen: 39,
    licenseesWomen: 40,
}