import EventManager from '../../shared/EventManager';
import IAssociationName from './@types/IAssociationName';
import AssociationNameEntity from './entities/AssociationNameEntity';
import associationNameRepository from './repositories/associationName.repository';

export class AssociationNameService {
    constructor() {
        EventManager.add('association-name.matching');

        EventManager.on('association-name.matching', {}, (cbStop, data) => {
            this.add((data as IAssociationName));
        });
    }

    async getAllStartingWith(value: string) {
        return await associationNameRepository.findAllStartingWith(value)
    }

    async add(entity: AssociationNameEntity) {
        if (await associationNameRepository.findOneByEnity(entity)) return; // TODO: UPDATE DATE ?

        return await associationNameRepository.create(entity);
    }
}

const assocationNameService = new AssociationNameService();

export default assocationNameService