import { WithId } from 'mongodb';
import EventManager from '../../shared/EventManager';
import IAssociationName from './@types/IAssociationName';
import AssociationNameEntity from './entities/AssociationNameEntity';
import associationNameRepository from './repositories/associationName.repository';

export class AssociationNameService {
    constructor() {
        EventManager.add('association-name.matching');

        EventManager.on('association-name.matching', {}, (cbStop, data) => {
            this.add(this.toEntity((data as IAssociationName)));
        });
    }

    async getAllStartingWith(value: string) {
        return (await associationNameRepository.findAllStartingWith(value)).map(this.toEntity)
    }

    async add(entity: AssociationNameEntity) {
        return await associationNameRepository.create(entity);
    }

    public toEntity(document: WithId<AssociationNameEntity> | IAssociationName) {
        return new AssociationNameEntity(document.rna, document.siren, document.name, document.provider, document.lastUpdate);
    }
}

const assocationNameService = new AssociationNameService();

export default assocationNameService