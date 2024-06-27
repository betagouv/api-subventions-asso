import { getMD5 } from "../../../shared/helpers/StringHelper";
import miscScdlGrantRepository from "./repositories/miscScdlGrant.repository";
import miscScdlProducersRepository from "./repositories/miscScdlProducer.repository";
import MiscScdlProducerEntity from "./entities/MiscScdlProducerEntity";
import { ScdlStorableGrant } from "./@types/ScdlStorableGrant";
import { ScdlGrantDbo } from "./dbo/ScdlGrantDbo";

export class ScdlService {
    producerNames: string[] = [];

    async init() {
        this.producerNames = (await this.getProducers()).map(producer => producer.name);
    }

    getProducer(slug: string) {
        return miscScdlProducersRepository.findBySlug(slug);
    }

    getProducers() {
        return miscScdlProducersRepository.findAll();
    }

    createProducer(entity: MiscScdlProducerEntity) {
        return miscScdlProducersRepository.create(entity);
    }

    private _buildGrantUniqueId(grant: ScdlStorableGrant, producerSlug: string) {
        return getMD5(`${producerSlug}-${JSON.stringify(grant.__data__)}`);
    }

    async createManyGrants(grants: ScdlStorableGrant[], producerSlug: string) {
        if (!producerSlug || typeof producerSlug !== "string")
            throw new Error("Could not save SCDL grants without a producer slug");

        const producer = await this.getProducer(producerSlug);

        if (!producer) throw new Error("Provider does not exists");

        // should not happen but who knows
        if (!producer.name) throw new Error("Could not retrieve producer name");

        const dboArray = grants.map(grant => {
            return {
                ...grant,
                producerSlug: producer.slug,
                allocatorName: producer.name,
                allocatorSiret: producer.siret,
                _id: this._buildGrantUniqueId(grant, producerSlug),
            } as ScdlGrantDbo;
        });

        return miscScdlGrantRepository.createMany(dboArray);
    }

    updateProducer(slug, setObject) {
        return miscScdlProducersRepository.update(slug, setObject);
    }
}

const scdlService = new ScdlService();
export default scdlService;
