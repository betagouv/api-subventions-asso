import { ObjectId } from "mongodb";
import { SireneUniteLegaleEntity } from "../../../../entities/SireneUniteLegaleEntity";
import Siren from "../../../../identifier-objects/Siren";
import { SireneUniteLegaleDbo } from "../@types/SireneUniteLegaleDbo";
import SireneUniteLegaleDto from "../@types/SireneUniteLegaleDto";
import DEFAULT_ASSOCIATION from "../../../../../tests/__fixtures__/association.fixture";

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
    identifiantAssociationUniteLegale: "W123456789",
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

export const DTOS: SireneUniteLegaleDto[] = [
    baseDto,
    { ...baseDto, siren: "123456789" },
    {
        ...baseDto,
        siren: "123456989",
        categorieJuridiqueUniteLegale: 9320n, // not an association
    },
    { ...baseDto, siren: "098765432", unitePurgeeUniteLegale: true }, // purged
];

export const ENTITIES: SireneUniteLegaleEntity[] = [
    {
        ...DTOS[0],
        siren: new Siren(DTOS[0].siren),
        anneeEffectifsUniteLegale: 2021,
        nombrePeriodesUniteLegale: 5,
        anneeCategorieEntreprise: 2022,
        categorieJuridiqueUniteLegale: "9220",
    },
    {
        ...DTOS[1],
        siren: new Siren(DTOS[1].siren),
        anneeEffectifsUniteLegale: 2021,
        nombrePeriodesUniteLegale: 5,
        anneeCategorieEntreprise: 2022,
        categorieJuridiqueUniteLegale: "9220",
    },
];

export const UNITE_LEGAL_ENTREPRISE_ENTITIES = [{ siren: new Siren(DTOS[2].siren) }];

export const DBOS: SireneUniteLegaleDbo[] = [
    { ...ENTITIES[0], siren: ENTITIES[0].siren.value, _id: new ObjectId() },
    { ...ENTITIES[1], siren: ENTITIES[1].siren.value, _id: new ObjectId() },
];
