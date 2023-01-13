import { Rna, Siren } from "@api-subventions-asso/dto";
import { StructureIdentifiersEnum } from "../../@enums/StructureIdentifiersEnum";
import { StructureIdentifiers } from "../../@types";
import EventManager from "../../shared/EventManager";
import { getIdentifierType } from "../../shared/helpers/IdentifierHelper";
import { siretToSiren } from "../../shared/helpers/SirenHelper";
import IAssociationName from "./@types/IAssociationName";
import AssociationNameEntity from "./entities/AssociationNameEntity";
import associationNameRepository from "./repositories/associationName.repository";

export class AssociationNameService {
    constructor() {
        EventManager.add("association-name.matching");

        EventManager.on("association-name.matching", {}, async (cbStop, data) => {
            await this.add(data as IAssociationName);
            cbStop(); // HOTFIX permet d'attendre que le add soit fait avant d'envoyer un add
        });
    }

    async getGroupedIdentifiers(
        identifier: StructureIdentifiers
    ): Promise<{ rna: undefined | Rna; siren: undefined | Siren }> {
        const typeIdentifier = getIdentifierType(identifier);

        if (typeIdentifier === StructureIdentifiersEnum.rna) {
            const associationNames = await associationNameRepository.findByRna(identifier);
            return {
                rna: identifier,
                siren: associationNames.find(entity => entity.siren)?.siren || undefined
            };
        } else if (
            typeIdentifier === StructureIdentifiersEnum.siren ||
            typeIdentifier === StructureIdentifiersEnum.siret
        ) {
            const siren = siretToSiren(identifier);
            const associationNames = await associationNameRepository.findBySiren(siren);

            return {
                siren,
                rna: associationNames.find(entity => entity.rna)?.rna || undefined
            };
        }

        throw new Error("identifier type is not supported");
    }

    private _getMostRecentEntity(entities: AssociationNameEntity[]) {
        return entities.sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime())?.[0];
    }

    async getNameFromIdentifier(identifier: Rna | Siren): Promise<string | undefined> {
        return this._getMostRecentEntity(await associationNameRepository.findAllByIdentifier(identifier))?.name;
    }

    async getAllStartingWith(value: string) {
        const associations = await associationNameRepository.findAllStartingWith(value);
        const rnaAndSirenMaps = {
            rnaMap: new Map<Rna, AssociationNameEntity[]>(),
            sirenMap: new Map<Siren, AssociationNameEntity[]>()
        };

        function getAssociationArray(association, maps) {
            return maps.rnaMap.get(association.rna) || maps.sirenMap.get(association.siren || "") || [];
        }

        function isIdInMap(id, map) {
            return map.has(id);
        }

        function toRnaAndSirenMaps(acc: typeof rnaAndSirenMaps, association: AssociationNameEntity) {
            const associationArray = getAssociationArray(association, acc);

            associationArray.push(association);

            if (association.rna && !isIdInMap(association.rna, acc.rnaMap)) {
                // Same reference (associationArray) for both map value
                acc.rnaMap.set(association.rna, associationArray);
            }

            if (association.siren && !isIdInMap(association.siren, acc.sirenMap)) {
                // Same reference (associationArray) for both map value
                acc.sirenMap.set(association.siren, associationArray);
            }

            return acc;
        }

        /**
         * Group associationName by rna and by siren
         * Rna and Siren can both be null, so we need two Map to group every associationName for the same association
         */
        associations.reduce(toRnaAndSirenMaps, rnaAndSirenMaps); // associationName[] -> { rnaMap, sirenMap }

        const flattenMapsValues = [...rnaAndSirenMaps.rnaMap.values(), ...rnaAndSirenMaps.sirenMap.values()];

        // Above reduce creates duplicates. Removes then by creating a Set
        const uniqueMapsValues = new Set(flattenMapsValues);

        return [...uniqueMapsValues].map(this._getMostRecentEntity);
    }

    async add(entity: AssociationNameEntity) {
        if (await associationNameRepository.findOneByEntity(entity)) return; // TODO: UPDATE DATE ?

        return await associationNameRepository.create(entity);
    }

    async upsert(entity: AssociationNameEntity) {
        return await associationNameRepository.upsert(entity);
    }
}

const associationNameService = new AssociationNameService();

export default associationNameService;
