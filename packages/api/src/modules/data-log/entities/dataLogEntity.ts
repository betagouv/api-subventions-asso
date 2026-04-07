export enum DataLogSource {
    FILE = "FILE",
    API = "API",
}

type DataLogCommon = {
    source: DataLogSource;
    providerId: string;
    integrationDate: Date; // when we imported data
    editionDate?: Date; // date of file production or up to which date the file covers
    providerName?: string;
};

export type DataLogEntity = ApiDataLogEntity | FileDataLogEntity;

export type FileDataLogEntity = DataLogCommon & {
    source: DataLogSource.FILE;
    fileName: string;
    userId?: string;
    fromAdmin?: boolean;
};

export type UserFileDataLogEntity = FileDataLogEntity & { userId: string };

export type ApiDataLogEntity = DataLogCommon & { source: DataLogSource.API };
