import miscScdlGrantRepository from "./repositories/miscScdlGrant.repository";
import miscScdlProducersRepository from "./repositories/miscScdlProducer.repository";
import MiscScdlGrantEntity from "./entities/MiscScdlGrantEntity";
import MiscScdlProducerEntity from "./entities/MiscScdlProducerEntity";

export class ScdlService {
    getProducer(producerId: string) {
        return miscScdlProducersRepository.findByProducerId(producerId);
    }

    createProducer(entity: MiscScdlProducerEntity) {
        return miscScdlProducersRepository.create(entity);
    }

    createManyGrants(entities: MiscScdlGrantEntity[]) {
        return miscScdlGrantRepository.createMany(entities);
    }

    updateProducer(producerId, setObject) {
        return miscScdlProducersRepository.update(producerId, setObject);
    }
}

const scdlService = new ScdlService();
export default scdlService;
