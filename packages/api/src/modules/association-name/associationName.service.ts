import { Rna, Siren } from "@api-subventions-asso/dto";
import { StructureIdentifiersEnum } from "../../@enums/StructureIdentifiersEnum";
import { StructureIdentifiers } from "../../@types";
import EventManager from "../../shared/EventManager";
import { getIdentifierType } from "../../shared/helpers/IdentifierHelper";
import { siretToSiren } from "../../shared/helpers/SirenHelper";
import ApiAssoDtoAdapter from "../providers/apiAsso/adapters/ApiAssoDtoAdapter";
import dataEntrepriseService from "../providers/dataEntreprise/dataEntreprise.service";
import dataGouvService from "../providers/datagouv/datagouv.service";
import leCompteAssoService from "../providers/leCompteAsso/leCompteAsso.service";
import osirisService from "../providers/osiris/osiris.service";
import IAssociationName from "./@types/IAssociationName";
import AssociationNameEntity from "./entities/AssociationNameEntity";
import associationNameRepository from "./repositories/associationName.repository";

export class AssociationNameService {
    static PROVIDER_SCORES = {
        [dataGouvService.provider.name]: 1,
        [ApiAssoDtoAdapter.providerNameRna]: 1,
        [ApiAssoDtoAdapter.providerNameSiren]: 1,
        [dataEntrepriseService.provider.name]: 0.5,
        [osirisService.provider.name]: 0.3,
        [leCompteAssoService.provider.name]: 0.2
    };

    constructor() {
        EventManager.add("association-name.matching");

        EventManager.on("association-name.matching", {}, async (cbStop, data) => {
            await this.upsert(data as IAssociationName);
            cbStop();
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

    private _mergeEntities(entities: AssociationNameEntity[]): AssociationNameEntity {
        const bestEntity = entities.sort(
            (a, b) => {
                const result = AssociationNameService.PROVIDER_SCORES[b.provider] - AssociationNameService.PROVIDER_SCORES[a.provider];

                if (result != 0) return result;

                // if result is 0 so providers have the same scores so select by date
                return new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime();
            }
        )[0];

        return {
            name: bestEntity.name,
            provider: bestEntity.provider,
            lastUpdate: bestEntity.lastUpdate,
            rna: bestEntity.rna || entities.find(e => e.rna)?.rna || null,
            siren: bestEntity.siren || entities.find(e => e.siren)?.siren || null
        };
    }

    async getNameFromIdentifier(identifier: Rna | Siren): Promise<string | undefined> {
        return this._mergeEntities(await associationNameRepository.findAllByIdentifier(identifier))?.name;
    }

    async getAllStartingWith(value: string) {
        const associations = await associationNameRepository.findAllStartingWith(value);
        const rnaAndSirenMaps = {
            rnaMap: new Map<Rna, AssociationNameEntity[]>(),
            sirenMap: new Map<Siren, AssociationNameEntity[]>()
        };

        function getAssociationArray(association, maps) {
            return maps.rnaMap.get(association.rna) || maps.sirenMap.get(association.siren) || [];
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

            if (
                association.rna &&
                association.siren &&
                acc.rnaMap.get(association.rna) != acc.sirenMap.get(association.siren)
            ) {
                const mergedArray = [
                    ...new Set([
                        ...(acc.rnaMap.get(association.rna) || []),
                        ...(acc.sirenMap.get(association.siren) || [])
                    ])
                ];
                acc.sirenMap.set(association.siren, mergedArray);
                acc.rnaMap.set(association.rna, mergedArray);
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

        return [...uniqueMapsValues].map(this._mergeEntities);
    }

    /***
     * @deprecated risks DB write concurrency. use upsert instead
     * */
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
