import { WithId } from 'mongodb';
import db from "../../../shared/MongoConnection";
import IAssociationName from '../@types/IAssociationName';
import AssociationNameEntity  from "../entities/AssociationNameEntity";

export class AssociationNameRepository {
    private readonly collection = db.collection<AssociationNameEntity>("association-name");

    private  toEntity(document: WithId<AssociationNameEntity> | IAssociationName) {
        return new AssociationNameEntity(document.rna, document.siren, document.name, document.provider, document.lastUpdate);
    }

    async findAllStartingWith(value: string) {
        return  (await this.collection.find({ $or: [ {siren: { $regex: `^${value}` }}, {rna: { $regex: `^${value}` }}, {name: { $regex: `^${value}` }}] }).toArray()).map(document => this.toEntity(document));
    }

    async create(entity: AssociationNameEntity) {
        return await this.collection.insertOne(Object.assign({}, entity)); // Clone entity to avoid mutating the entity;
    }

    async insertMany(entities: AssociationNameEntity[]) {
        return this.collection.insertMany(entities, {ordered: false});
    }
}

const associationName = new AssociationNameRepository();

export default associationName;