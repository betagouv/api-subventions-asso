export default class MiscScdlProducerEntity {
    // Data.Gouv data producer ID
    producerId: string;
    // Data.Gouv data producer name
    producerName: string;
    lastUpdate: Date;

    constructor({ producerName, producerId, lastUpdate }) {
        this.producerId = producerId;
        this.producerName = producerName;
        this.lastUpdate = lastUpdate;
    }
}
