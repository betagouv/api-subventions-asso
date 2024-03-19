import { getMD5 } from "../../../shared/helpers/StringHelper";
import miscScdlGrantRepository from "./repositories/miscScdlGrant.repository";
import miscScdlProducersRepository from "./repositories/miscScdlProducer.repository";
import MiscScdlProducerEntity from "./entities/MiscScdlProducerEntity";
import { ScdlStorableGrant } from "./@types/ScdlStorableGrant";
import { ScdlGrantDbo } from "./dbo/ScdlGrantDbo";

export class ScdlService {
    getProducer(id: string) {
        return miscScdlProducersRepository.findById(id);
    }

    createProducer(entity: MiscScdlProducerEntity) {
        return miscScdlProducersRepository.create(entity);
    }

    private _buildGrantUniqueId(grant: ScdlStorableGrant, id: string) {
        return getMD5(`${id}-${JSON.stringify(grant.__data__)}`);
    }

    async createManyGrants(grants: ScdlStorableGrant[], id: string) {
        if (!id || typeof id !== "string") throw new Error("Could not save SCDL grants without a producer ID");

        const producer = await this.getProducer(id);

        if (!producer) throw new Error("Provider does not exists");

        // should not happen but who knows
        if (!producer.name) throw new Error("Could not retrieve producer name");

        const dboArray = grants.map(grant => {
            return {
                ...grant,
                producerId: producer.id,
                allocatorName: producer.name,
                allocatorSiret: producer.siret,
                _id: this._buildGrantUniqueId(grant, id),
            } as ScdlGrantDbo;
        });

        return miscScdlGrantRepository.createMany(dboArray);
    }

    updateProducer(id, setObject) {
        return miscScdlProducersRepository.update(id, setObject);
    }
}

const scdlService = new ScdlService();
export default scdlService;
