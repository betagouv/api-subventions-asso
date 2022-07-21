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
        return await associationNameRepository.findAllStartingWith(value);
    }

    async add(entity: AssociationNameEntity) {
        if (await associationNameRepository.findOneByEntity(entity)) return; // TODO: UPDATE DATE ?

        return await associationNameRepository.create(entity);
    }
}

const assocationNameService = new AssociationNameService();

export default assocationNameService