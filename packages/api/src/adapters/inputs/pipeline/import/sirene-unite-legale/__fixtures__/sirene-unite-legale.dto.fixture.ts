import DEFAULT_ASSOCIATION from "../../../../../../../tests/__fixtures__/association.fixture";
import SireneUniteLegaleDto from "../SireneUniteLegaleDto";

const baseDto: SireneUniteLegaleDto = {
    siren: DEFAULT_ASSOCIATION.siren,
    statutDiffusionUniteLegale: "0",
    unitePurgeeUniteLegale: null,
    dateCreationUniteLegale: new Date("1989-02-01T00:00:00.000Z"),
    sigleUniteLegale: "sigle",
    sexeUniteLegale: null,
    prenom1UniteLegale: null,
    prenom2UniteLegale: null,
    prenom3UniteLegale: null,
    prenom4UniteLegale: null,
    prenomUsuelUniteLegale: null,
    pseudonymeUniteLegale: null,
    identifiantAssociationUniteLegale: DEFAULT_ASSOCIATION.rna,
    trancheEffectifsUniteLegale: null,
    anneeEffectifsUniteLegale: 2021n,
    dateDernierTraitementUniteLegale: new Date("2023-01-01T14:26:06.000Z"),
    nombrePeriodesUniteLegale: 5n,
    categorieEntreprise: "PME",
    anneeCategorieEntreprise: 2022n,
    dateDebut: new Date("2022-01-01T00:00:00.000Z"),
    etatAdministratifUniteLegale: "A",
    nomUniteLegale: null,
    nomUsageUniteLegale: null,
    denominationUniteLegale: "asso coeur",
    denominationUsuelle1UniteLegale: null,
    denominationUsuelle2UniteLegale: null,
    denominationUsuelle3UniteLegale: null,
    categorieJuridiqueUniteLegale: 9220n,
    activitePrincipaleUniteLegale: "94.99Z",
    nomenclatureActivitePrincipaleUniteLegale: "NAFRev2",
    nicSiegeUniteLegale: "00001",
    economieSocialeSolidaireUniteLegale: "O",
    societeMissionUniteLegale: null,
    caractereEmployeurUniteLegale: null,
    activitePrincipaleNAF25UniteLegale: "94.99Y",
};

export const SIRENE_UNITE_LEGALE_DTOS: SireneUniteLegaleDto[] = [
    baseDto,
    { ...baseDto, siren: "123456789" },
    {
        ...baseDto,
        siren: "123456989",
        categorieJuridiqueUniteLegale: 9320n, // not an association
    },
    { ...baseDto, siren: "098765432", unitePurgeeUniteLegale: true }, // purged
];
