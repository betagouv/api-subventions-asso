import { SubventiaRequestEntity } from "../entities/SubventiaLineEntity";

const entity = new SubventiaRequestEntity(
    {
        siret: "00000000012345",
        name: "Test name subventia",
    },
    {
        initule: "Intitule",
        description: "DESCRIPTION",
        exerciceBudgetaire: 2022,
        budgetGlobal: 10000,
        montantSollicite: 500,
        financeurs: "BatMan",
        status: "En cours d'instruction",
    },
    {},
);

export default entity;
