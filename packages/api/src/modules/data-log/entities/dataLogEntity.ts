export type DataLogEntity = {
    providerId: string;
    integrationDate: Date; // when we imported data
    editionDate?: Date; // date of file production or up to which date the file covers
    fileName?: string;
};
