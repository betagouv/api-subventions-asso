import { Rna, Siren } from '@api-subventions-asso/dto';
import EventManager from '../../shared/EventManager';
import IAssociationName from './@types/IAssociationName';
import AssociationNameEntity from './entities/AssociationNameEntity';
import associationNameRepository from './repositories/associationName.repository';

export class AssociationNameService {
    constructor() {
        EventManager.add('association-name.matching');

        EventManager.on('association-name.matching', {}, async (cbStop, data) => {
            await this.add((data as IAssociationName));
            cbStop(); // HOTFIX premet d'attendre que le add soit fait avant d'envoyer un add
        });
    }

    async getAllStartingWith(value: string) {
        const associations = await associationNameRepository.findAllStartingWith(value);
        const rnaAndSirenMaps = { rnaMap: new Map<Rna, AssociationNameEntity[]>(), sirenMap: new Map<Siren, AssociationNameEntity[]>()};
        
        function getAssociationArray(association, maps) {
            return maps.rnaMap.get(association.rna) || maps.sirenMap.get(association.siren || '') || [];
        }

        function isIdInMap(id, map) {
            return map.has(id);
        }

        function getMostRecentEntity(entities: AssociationNameEntity[]) {
            return entities.sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime())[0]
        }

        function toRnaAndSirenMaps(acc: typeof rnaAndSirenMaps , association: AssociationNameEntity) {
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
         * Rna and Siren can both be null so we need two Map to group every associationName for the same association
         */
        associations.reduce(toRnaAndSirenMaps, rnaAndSirenMaps);

        const flattenMapsValues = [...rnaAndSirenMaps.rnaMap.values(), ...rnaAndSirenMaps.sirenMap.values()]

        // Above reduce creates duplicates. Removes then by creating a Set
        const uniqueMapsValues = new Set(flattenMapsValues);

        return [...uniqueMapsValues].map(getMostRecentEntity);
    }

    async add(entity: AssociationNameEntity) {
        if (await associationNameRepository.findOneByEntity(entity)) return; // TODO: UPDATE DATE ?

        return await associationNameRepository.create(entity);
    }
}

const assocationNameService = new AssociationNameService();

export default assocationNameService