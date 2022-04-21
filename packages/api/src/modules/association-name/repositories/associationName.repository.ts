
import db from "../../../shared/MongoConnection";
import AssociationNameEntity  from "../entities/AssociationNameEntity";

export class AssociationNameRepository {
    private readonly collection = db.collection<AssociationNameEntity>("association-name");

    async findAllStartingWith(value: string) {
        return this.collection.find({ $or: [ {siren: { $regex: `^${value}` }}, {rna: { $regex: `^${value}` }}, {name: { $regex: `^${value}` }}] }).toArray();
    }

    async create(entity: AssociationNameEntity) {
        return !!(await this.collection.insertOne(entity));
    }

    async insertMany(entities: AssociationNameEntity[]) {
        return this.collection.insertMany(entities, {ordered: false});
    }
}

const associationName = new AssociationNameRepository();

export default associationName;