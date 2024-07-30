export type DataLogEntity = {
    providerId: string;
    integrationDate: Date; // when we imported data
    editionDate: Date; // up to which date the file covers
    fileName?: string;
};
