import { Rna, Siren } from "dto";
import { DuplicateIndexError } from "../../shared/errors/dbError/DuplicateIndexError";
import { AssociationIdentifiers } from "../../@types";
import rnaSirenPort from "../../dataProviders/db/rnaSiren/rnaSiren.port";
import apiAssoService from "../providers/apiAsso/apiAsso.service";
import RnaSirenEntity from "../../entities/RnaSirenEntity";

export class RnaSirenService {
    async find(identifier: AssociationIdentifiers): Promise<RnaSirenEntity[] | null> {
        const entities = await rnaSirenPort.find(identifier);
        if (!entities) {
            // If not rna siren matching search in API ASSO
            const { rna, siren } = await apiAssoService.findRnaSirenByIdentifiers(identifier);

            if (!rna || !siren) return null;
            const result = await this.insert(rna, siren);
            return result ? [result] : null;
        }

        return entities;
    }

    async insert(rna: Rna, siren: Siren) {
        try {
            const entity = new RnaSirenEntity(rna, siren);
            await rnaSirenPort.insert(entity);
            return entity;
        } catch (e: unknown) {
            if (e instanceof DuplicateIndexError) return;
            throw e;
        }
    }
}

const rnaSirenService = new RnaSirenService();

export default rnaSirenService;
