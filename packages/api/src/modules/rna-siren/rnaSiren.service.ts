import { DuplicateIndexError } from "../../shared/errors/dbError/DuplicateIndexError";
import rnaSirenPort from "../../dataProviders/db/rnaSiren/rnaSiren.port";
import apiAssoService from "../providers/apiAsso/apiAsso.service";
import RnaSirenEntity from "../../entities/RnaSirenEntity";
import Rna from "../../identifierObjects/Rna";
import Siren from "../../identifierObjects/Siren";
import AssociationIdentifier from "../../identifierObjects/AssociationIdentifier";
import Siret from "../../identifierObjects/Siret";

export class RnaSirenService {
    async find(id: string | Rna | Siren, offline = false): Promise<RnaSirenEntity[] | null> {
        const rnaSiren = this.extractRnaOrSirenFromIdentifier(id);

        const entities = rnaSiren ? await rnaSirenPort.find(rnaSiren) : null;

        if (entities || offline) return entities;

        // If not rna siren matching search in API ASSO
        const { rna, siren } = await apiAssoService.findRnaSirenByIdentifiers(AssociationIdentifier.fromId(rnaSiren));

        if (!rna || !siren) return null;
        const result = await this.insert(rna, siren);
        return result ? [result] : null;
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

    async insertMany(duos: { rna: Rna; siren: Siren }[]) {
        const entities = duos.map(({ rna, siren }) => new RnaSirenEntity(rna, siren));

        try {
            return rnaSirenPort.insertMany(entities);
        } catch (e: unknown) {
            if (e instanceof DuplicateIndexError) return;
            throw e;
        }
    }

    extractRnaOrSirenFromIdentifier(id: string | Rna | Siren): Rna | Siren {
        if (id instanceof Rna || id instanceof Siren) return id;
        if (Rna.isRna(id)) {
            return id as unknown as Rna;
        }
        if (Siren.isSiren(id)) {
            return id as unknown as Siren;
        }
        return Siret.getSiren(id) as unknown as Siren;
    }
}

const rnaSirenService = new RnaSirenService();

export default rnaSirenService;
