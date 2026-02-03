export enum DataLogSource {
    FILE = "FILE",
    API = "API",
}

export type DataLogEntity = {
    source: DataLogSource;
    providerId: string;
    integrationDate: Date; // when we imported data
    editionDate?: Date; // date of file production or up to which date the file covers
    fileName?: string;
    userId?: string;
    providerName?: string;
    isAdmin?: boolean;
};

export type FileDataLogEntity = DataLogEntity & { source: DataLogSource.FILE; fileName: string };
export type ApiDataLogEntity = Omit<DataLogEntity, "fileName" | "userId"> & { source: DataLogSource.API };
