import { Rna, Siren } from "dto";
import { UpdateResult, WithId } from "mongodb";
import { siretToSiren } from "../../../shared/helpers/SirenHelper";
import db from "../../../shared/MongoConnection";
import { isStartOfSiret } from "../../../shared/Validators";
import IAssociationName from "../@types/IAssociationName";
import AssociationNameEntity from "../entities/AssociationNameEntity";
import ExecutionSyncStack from "../../../shared/ExecutionSyncStack";

export class AssociationNameRepository {
    private readonly collection = db.collection<AssociationNameEntity>("association-name");
    private upsertStack: ExecutionSyncStack<AssociationNameEntity, UpdateResult>;

    constructor() {
        this.upsertStack = new ExecutionSyncStack(entity => {
            return this.collection.updateOne(
                {
                    rna: entity.rna,
                    siren: entity.siren,
                    name: entity.name,
                },
                {
                    $setOnInsert: entity,
                },
                { upsert: true },
            );
        });
    }

    private toEntity(document: WithId<AssociationNameEntity> | IAssociationName) {
        return new AssociationNameEntity(
            document.rna,
            document.name,
            document.provider,
            document.lastUpdate,
            document.siren,
        );
    }

    async findAllStartingWith(value: string) {
        if (isStartOfSiret(value)) value = siretToSiren(value); // Check if value is a start of siret
        const valueNoSpace = value.replace(/\s/g, "");
        return (
            await this.collection
                .find({
                    $or: [
                        { siren: { $regex: valueNoSpace, $options: "i" } },
                        {
                            rna: {
                                $regex: valueNoSpace,
                                $options: "i",
                            },
                        },
                        { name: { $regex: value, $options: "i" } },
                    ],
                })
                .toArray()
        ).map(document => this.toEntity(document));
    }

    async findOneByEntity(entity: AssociationNameEntity) {
        const result = await this.collection.findOne({
            rna: entity.rna,
            siren: entity.siren,
            name: entity.name,
        });
        if (result) return this.toEntity(result);
        return null;
    }

    async findAllByIdentifier(identifier: Siren | Rna) {
        return (await this.collection.find({ $or: [{ rna: identifier }, { siren: identifier }] }).toArray()).map(
            document => this.toEntity(document),
        );
    }

    async create(entity: AssociationNameEntity) {
        return this.collection.insertOne(Object.assign({}, entity)); // Clone entity to avoid mutating the entity;
    }

    async upsert(entity: AssociationNameEntity): Promise<UpdateResult> {
        // Use stack because, sometimes to upsert on same entity as executed at the same time, please read : https://jira.mongodb.org/browse/SERVER-14322
        return this.upsertStack.addOperation(entity);
    }

    async insertMany(entities: AssociationNameEntity[]) {
        return this.collection.insertMany(entities, { ordered: false });
    }

    async findByRna(rna: Rna) {
        return this.collection.find({ rna }).toArray();
    }
    async findBySiren(siren: Siren) {
        return this.collection.find({ siren }).toArray();
    }
}

const associationNameRepository = new AssociationNameRepository();

export default associationNameRepository;
