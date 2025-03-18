import { ObjectId } from "mongodb";
import { AmountsVsProgramRegionDbo } from "../entitiyAndDbo/amountsVsProgramRegion.dbo";
import AmountsVsProgramRegionEntity from "../entitiyAndDbo/amountsVsProgramRegion.entity";

export const NOT_AGGREGATED_ENTITIES: AmountsVsProgramRegionEntity[] = [
    {
        exerciceBudgetaire: 2023,
        programme: "1 - Programme Exemple",
        mission: "Mission Exemple",
        montant: 1000,
        regionAttachementComptable: "Bretagne",
    },
    {
        exerciceBudgetaire: 2023,
        programme: "1 - Programme Exemple",
        mission: "Mission Exemple",
        montant: 7000,
        regionAttachementComptable: "Bretagne",
    },
    {
        exerciceBudgetaire: 2023,
        programme: "1",
        mission: "Mission Exemple",
        montant: 1000,
        regionAttachementComptable: "Normandie",
    },
    {
        exerciceBudgetaire: 2025,
        programme: "1 - Programme Exemple",
        mission: "Mission Exemple",
        montant: 1000,
        regionAttachementComptable: "Bretagne",
    },
    {
        exerciceBudgetaire: 2023,
        programme: "programNumber",
        mission: "Mission Exemple",
        montant: 1000,
        regionAttachementComptable: "Bretagne",
    },
    {
        exerciceBudgetaire: 2023,
        programme: "1 - Programme Exemple",
        mission: "Mission Exemple",
        montant: 1000,
        regionAttachementComptable: "Occitanie",
    },
];

export const AMOUNTS_VS_PROGRAM_REGION_ENTITIES: AmountsVsProgramRegionEntity[] = [
    {
        exerciceBudgetaire: 2023,
        programme: "1 - Programme Exemple",
        mission: "Mission Exemple",
        montant: 8000,
        regionAttachementComptable: "Bretagne",
    },
    {
        exerciceBudgetaire: 2023,
        programme: "1",
        mission: "Mission Exemple",
        montant: 1000,
        regionAttachementComptable: "Normandie",
    },
    {
        exerciceBudgetaire: 2025,
        programme: "1 - Programme Exemple",
        mission: "Mission Exemple",
        montant: 1000,
        regionAttachementComptable: "Bretagne",
    },
    {
        exerciceBudgetaire: 2023,
        programme: "programNumber",
        mission: "Mission Exemple",
        montant: 1000,
        regionAttachementComptable: "Bretagne",
    },
    {
        exerciceBudgetaire: 2023,
        programme: "1 - Programme Exemple",
        mission: "Mission Exemple",
        montant: 1000,
        regionAttachementComptable: "Occitanie",
    },
];

export const AMOUNTS_VS_PROGRAM_REGION_DBOS: AmountsVsProgramRegionDbo[] = [
    {
        _id: new ObjectId(),
        exerciceBudgetaire: 2023,
        programme: "1 - Programme Exemple",
        mission: "Mission Exemple",
        montant: 8000,
        regionAttachementComptable: "Bretagne",
    },
    {
        _id: new ObjectId(),
        exerciceBudgetaire: 2023,
        programme: "1",
        mission: "Mission Exemple",
        montant: 1000,
        regionAttachementComptable: "Normandie",
    },
];
