import { ObjectId } from "mongodb";
import { amountsVsProgrammeRegionDbo } from "../entitiyAndDbo/amountsVsProgrammeRegion.dbo";
import amountsVsProgrammeRegionEntity from "../entitiyAndDbo/amountsVsProgrammeRegion.entity";

export const NOT_AGGREGATED_ENTITIES : amountsVsProgrammeRegionEntity[] = [
    {
    exerciceBudgetaire : 2023,
    programme : "1 - Programme Exemple",
    mission : "Mission Exemple",
    amount : 1000,
    regionAttachementComptable : "Bretagne"

    },
    {
    exerciceBudgetaire : 2023,
    programme : "1 - Programme Exemple",
    mission : "Mission Exemple",
    amount : 7000,
    regionAttachementComptable : "Bretagne"

    },
    {
        exerciceBudgetaire : 2023,
        programme : "1",
        mission : "Mission Exemple",
        amount : 1000,
        regionAttachementComptable: "Normandie"
    }
];

export const AMOUNTS_VS_PROGRAMME_REGION_ENTITIES : amountsVsProgrammeRegionEntity[] = [
    {
        exerciceBudgetaire : 2023,
        programme : "1 - Programme Exemple",
        mission : "Mission Exemple",
        amount : 8000,
        regionAttachementComptable : "Bretagne"
    },
    {
        exerciceBudgetaire : 2023,
        programme : "1",
        mission : "Mission Exemple",
        amount : 1000,
        regionAttachementComptable: "Normandie"
    }
];

export const AMOUNTS_VS_PROGRAMME_REGION_DBOS : amountsVsProgrammeRegionDbo[] = [
    {
        _id : new ObjectId(),
        exerciceBudgetaire : 2023,
        programme : "1 - Programme Exemple",
        mission : "Mission Exemple",
        amount : 8000,
        regionAttachementComptable : "Bretagne"
    },
    {
        _id : new ObjectId(),
        exerciceBudgetaire : 2023,
        programme : "1",
        mission : "Mission Exemple",
        amount : 1000,
        regionAttachementComptable: "Normandie"
    }
];