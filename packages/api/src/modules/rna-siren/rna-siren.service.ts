import { DuplicateIndexError } from "../../shared/errors/dbError/DuplicateIndexError";
import rnaSirenAdapter from "../../adapters/outputs/db/rna-siren/rna-siren.adapter";
import apiAssoService from "../providers/apiAsso/apiAsso.service";
import RnaSirenEntity from "../../entities/RnaSirenEntity";
import Rna from "../../identifier-objects/Rna";
import Siren from "../../identifier-objects/Siren";
import associationIdentifierService from "../association-identifier/association-identifier.service";
import AssociationIdentifier from "../../identifier-objects/AssociationIdentifier";
import Siret from "../../identifier-objects/Siret";
import { FullAssociationIdentifier } from "../../identifier-objects/@types/StructureIdentifier";

export class RnaSirenService {
    async findFromUnknownIdentifier(str: string) {
        const identifier = associationIdentifierService.identifierStringToEntity(str);
        return this.find(identifier);
    }

    async find(identifier: Rna | Siren, offline = false): Promise<RnaSirenEntity[] | null> {
        const entities = await rnaSirenAdapter.find(identifier);

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
            await rnaSirenAdapter.insert(entity);
        } catch (e: unknown) {
            if (e instanceof DuplicateIndexError) return;
            throw e;
        }
    }

    // @TODO: only accept AssociationIdentifier and merge with insertManyAssociationIdentifier
    async insertMany(duos: RnaSirenEntity[]) {
        const entities = duos.map(({ rna, siren }) => new RnaSirenEntity(rna, siren));

        try {
            return rnaSirenAdapter.insertMany(entities);
        } catch (e: unknown) {
            if (e instanceof DuplicateIndexError) return;
            throw e;
        }
    }

    async insertManyAssociationIdentifer(identifiers: AssociationIdentifier[]) {
        const entities = identifiers
            .filter(
                (assoIdentifier): assoIdentifier is FullAssociationIdentifier =>
                    !!(assoIdentifier.rna && assoIdentifier.siren),
            )
            .map(assoIdentifier => new RnaSirenEntity(assoIdentifier.rna, assoIdentifier.siren));
        return this.insertMany(entities);
    }

    extractRnaOrSirenFromIdentifier(id: string | Rna | Siren): Rna | Siren {
        if (id instanceof Rna || id instanceof Siren) return id;
        if (Rna.isRna(id)) {
            return new Rna(id);
        }
        if (Siren.isSiren(id)) {
            return new Siren(id);
        }
        return new Siren(Siret.getSiren(id));
    }
}

const rnaSirenService = new RnaSirenService();

export default rnaSirenService;
