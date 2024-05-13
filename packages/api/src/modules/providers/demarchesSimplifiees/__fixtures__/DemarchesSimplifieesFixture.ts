import DemarchesSimplifieesDataEntity from "../entities/DemarchesSimplifieesDataEntity";

export const DATA_ENTITIES = [
    {
        siret: "11111111100001",
        demarcheId: 1111,
        demande: {
            state: "STATE_DEMANDE_1",
            dateDepot: "2024-01-12",
            demarche: {
                title: "TITLE_DEMARCHE_DEMANDE_1",
            },
        },
    },
    {
        siret: "22222222200002",
        demarcheId: 2222,
        demande: {
            state: "STATE_DEMANDE_2",
            dateDepot: "2024-02-25",
            demarche: {
                title: "TITLE_DEMARCHE_DEMANDE_2",
            },
        },
    },
] as DemarchesSimplifieesDataEntity[];

export const SCHEMAS = { [DATA_ENTITIES[0].demarcheId]: {}, [DATA_ENTITIES[1].demarcheId]: {} };
