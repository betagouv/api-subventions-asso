import MiscScdlGrantEntity from "./entities/MiscScdlGrantEntity";
import MiscScdlProducerEntity from "./entities/MiscScdlProducerEntity";
import miscScdlGrantRepository from "./repositories/miscScdlGrant.repository";
import miscScdlProducersRepository from "./repositories/miscScdlProducer.repository";

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
}

const scdlService = new ScdlService();
export default scdlService;
