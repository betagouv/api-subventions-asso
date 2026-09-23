export default interface SireneUniteLegaleDto {
    siren: string;
    statutDiffusionUniteLegale: string | null;
    unitePurgeeUniteLegale: boolean | null;
    dateCreationUniteLegale: Date | null;
    sigleUniteLegale: string | null;
    sexeUniteLegale: string | null;
    prenom1UniteLegale: string | null;
    prenom2UniteLegale: string | null;
    prenom3UniteLegale: string | null;
    prenom4UniteLegale: string | null;
    prenomUsuelUniteLegale: string | null;
    pseudonymeUniteLegale: string | null;
    identifiantAssociationUniteLegale: string | null; // always define (checked on 2026/09/17)
    trancheEffectifsUniteLegale: string | null;
    anneeEffectifsUniteLegale: bigint | null; // bigint to number
    dateDernierTraitementUniteLegale: Date;
    nombrePeriodesUniteLegale: bigint | null; // bigint to number
    categorieEntreprise: string | null;
    anneeCategorieEntreprise: bigint | null; // bigint to number
    dateDebut: Date | null;
    etatAdministratifUniteLegale: string | null;
    nomUniteLegale: string | null;
    nomUsageUniteLegale: string | null;
    denominationUniteLegale: string | null;
    denominationUsuelle1UniteLegale: string | null;
    denominationUsuelle2UniteLegale: string | null;
    denominationUsuelle3UniteLegale: string | null;
    categorieJuridiqueUniteLegale: bigint | null; // bigint to string
    activitePrincipaleUniteLegale: string | null;
    nomenclatureActivitePrincipaleUniteLegale: string | null;
    nicSiegeUniteLegale: string; // always define (checked on 2026/09/18)
    economieSocialeSolidaireUniteLegale: string | null;
    societeMissionUniteLegale: string | null;
    caractereEmployeurUniteLegale: string | null;
    activitePrincipaleNAF25UniteLegale: string | null;
}
