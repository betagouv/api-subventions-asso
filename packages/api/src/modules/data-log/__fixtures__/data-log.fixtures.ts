import { USER_DBO } from "../../user/__fixtures__/user.fixture";
import { DataLogSource } from "../entities/dataLogEntity";

export const USER_FILE_DATA_LOG_DBOS = [
    {
        providerId: "PROVIDER_ID",
        integrationDate: new Date("2026-04-04"), // when we imported data
        editionDate: new Date("2026-04-01"), // date of file production or up to which date the file covers
        providerName: "PROVIDER_NAME",
        source: DataLogSource.FILE,
        fileName: "FILE_NAME",
        userId: USER_DBO._id,
        fromAdmin: false,
    },
];
