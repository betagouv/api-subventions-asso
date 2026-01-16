import { DuplicateIndexError } from "../../shared/errors/dbError/DuplicateIndexError";
import rnaSirenPort from "../../dataProviders/db/rnaSiren/rnaSiren.port";
import apiAssoService from "../providers/apiAsso/apiAsso.service";
import RnaSirenEntity from "../../entities/RnaSirenEntity";
import Rna from "../../identifierObjects/Rna";
import Siren from "../../identifierObjects/Siren";
import associationIdentifierService from "../association-identifier/association-identifier.service";

export class RnaSirenService {
    async findFromUnknownIdentifier(str: string) {
        const identifier = associationIdentifierService.identifierStringToEntity(str);
        return this.find(identifier);
    }

    async find(identifier: Rna | Siren, offline = false): Promise<RnaSirenEntity[] | null> {
        const entities = await rnaSirenPort.find(identifier);

        if (entities || offline) return entities;

        const newEntity = await this.findFromApiAsso(identifier);
        if (newEntity) return [newEntity];
        return null;
    }

    async findFromApiAsso(identifier: Rna | Siren): Promise<RnaSirenEntity | null> {
        const rnaSiren = await apiAssoService.findRnaSiren(identifier);

        if (!rnaSiren) return null;

        const entity = new RnaSirenEntity(rnaSiren.rna, rnaSiren.siren);

        await this.insert(entity);

        return entity;
    }

    async insert(entity: RnaSirenEntity) {
        try {
            await rnaSirenPort.insert(entity);
        } catch (e: unknown) {
            if (e instanceof DuplicateIndexError) return;
            throw e;
        }
    }

    async insertMany(duos: { rna: Rna; siren: Siren }[]) {
        const entities = duos.map(({ rna, siren }) => new RnaSirenEntity(rna, siren));

        try {
            return rnaSirenPort.insertMany(entities);
        } catch (e: unknown) {
            if (e instanceof DuplicateIndexError) return;
            throw e;
        }
    }
}

const rnaSirenService = new RnaSirenService();

export default rnaSirenService;
