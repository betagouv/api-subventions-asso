import { ObjectId } from "mongodb";
import { SireneStockUniteLegaleEntity } from "../../../../entities/SireneStockUniteLegaleEntity";
import Siren from "../../../../identifierObjects/Siren";
import { SireneUniteLegaleDbo } from "../stockUniteLegale/@types/SireneUniteLegaleDbo";
import SireneUniteLegaleDto from "../stockUniteLegale/@types/SireneUniteLegaleDto";

const baseDto = {
    siren: "123411189",
    statutDiffusionUniteLegale: "0",
    unitePurgeeUniteLegale: "",
    dateCreationUniteLegale: "1989-02-01",
    sigleUniteLegale: "sigle",
    sexeUniteLegale: "",
    prenom1UniteLegale: "",
    prenom2UniteLegale: "",
    prenom3UniteLegale: "",
    prenom4UniteLegale: "",
    prenomUsuelUniteLegale: "",
    pseudonymeUniteLegale: "",
    identifiantAssociationUniteLegale: "W123456789",
    trancheEffectifsUniteLegale: "",
    anneeEffectifsUniteLegale: "",
    dateDernierTraitementUniteLegale: "2023-01-01T14:26:06",
    nombrePeriodesUniteLegale: "5",
    categorieEntreprise: "PME",
    anneeCategorieEntreprise: "2022",
    dateDebut: "2022-01-01",
    etatAdministratifUniteLegale: "A",
    nomUniteLegale: "",
    nomUsageUniteLegale: "",
    denominationUniteLegale: "asso coeur",
    denominationUsuelle1UniteLegale: "",
    denominationUsuelle2UniteLegale: "",
    denominationUsuelle3UniteLegale: "",
    categorieJuridiqueUniteLegale: "9220",
    activitePrincipaleUniteLegale: "94.99Z",
    nomenclatureActivitePrincipaleUniteLegale: "NAFRev2",
    nicSiegeUniteLegale: "00001",
    economieSocialeSolidaireUniteLegale: "O",
    societeMissionUniteLegale: "",
    caractereEmployeurUniteLegale: "",
};

export const DTOS: SireneUniteLegaleDto[] = [
    baseDto,
    { ...baseDto, siren: "123456789" },
    {
        ...baseDto,
        siren: "123456989",
        categorieJuridiqueUniteLegale: "9320", // not an association
    },
    { ...baseDto, siren: "098765432", unitePurgeeUniteLegale: "true" }, // purged
];

export const ENTITIES: SireneStockUniteLegaleEntity[] = [
    { ...DTOS[0], siren: new Siren(DTOS[0].siren) },
    { ...DTOS[1], siren: new Siren(DTOS[1].siren) },
];

export const UNITE_LEGAL_ENTREPRISE_ENTITIES = [{ siren: new Siren(DTOS[2].siren) }];

export const DBOS: SireneUniteLegaleDbo[] = [
    { ...DTOS[0], _id: new ObjectId() },
    { ...DTOS[1], _id: new ObjectId() },
];
