import { getMD5 } from "../../../shared/helpers/StringHelper";
import miscScdlGrantRepository from "./repositories/miscScdlGrant.repository";
import miscScdlProducersRepository from "./repositories/miscScdlProducer.repository";
import MiscScdlProducerEntity from "./entities/MiscScdlProducerEntity";
import { ScdlStorableGrant } from "./@types/ScdlStorableGrant";
import { ScdlGrantDbo } from "./dbo/ScdlGrantDbo";

export class ScdlService {
    getProducer(producerId: string) {
        return miscScdlProducersRepository.findByProducerId(producerId);
    }

    createProducer(entity: MiscScdlProducerEntity) {
        return miscScdlProducersRepository.create(entity);
    }

    private _buildGrantUniqueId(grant: ScdlStorableGrant, producerId: string) {
        return getMD5(`${producerId}-${JSON.stringify(grant.__data__)}`);
    }

    createManyGrants(grants: ScdlStorableGrant[], producerId: string) {
        if (!producerId || typeof producerId !== "string")
            throw new Error("Could not save SCDL grants without a producer ID");

        const dboArray = grants.map(grant => {
            return {
                ...grant,
                producerId,
                _id: this._buildGrantUniqueId(grant, producerId),
            } as ScdlGrantDbo;
        });

        return miscScdlGrantRepository.createMany(dboArray);
    }

    updateProducer(producerId, setObject) {
        return miscScdlProducersRepository.update(producerId, setObject);
    }
}

const scdlService = new ScdlService();
export default scdlService;
