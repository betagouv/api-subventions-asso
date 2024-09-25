export type ProducerLogEntity = {
    providerId: string;
    lastIntegrationDate: Date; // when we last imported data
    firstIntegrationDate: Date; // when we first imported data
    lastCoverDate: Date; // last date any file had cover
};
