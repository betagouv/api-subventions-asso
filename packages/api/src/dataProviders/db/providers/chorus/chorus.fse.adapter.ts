import { WithId } from "mongodb";
import ChorusFseEntity from "../../../../modules/providers/chorus/entities/ChorusFseEntity";
import MongoAdapter from "../../MongoAdapter";
import EstablishmentIdentifier from "../../../../identifierObjects/EstablishmentIdentifier";
import Siret from "../../../../identifierObjects/Siret";
import Ridet from "../../../../identifierObjects/Ridet";
import Tahitiet from "../../../../identifierObjects/Tahitiet";
import { ChorusFsePort } from "./chorus.fse.port";

type ChorusFseDbo = Omit<ChorusFseEntity, "identifier"> & { identifier: string };

export class ChorusFseAdapter extends MongoAdapter<ChorusFseDbo> implements ChorusFsePort {
    readonly collectionName = "chorus-fse";

    private toDbo(entity: ChorusFseEntity): ChorusFseDbo {
        return { ...entity, identifier: entity.identifier.toString() };
    }

    private toEntity(dbo: WithId<ChorusFseDbo>): ChorusFseEntity {
        const { _id, ...dboWithoutId } = dbo;
        return {
            ...dboWithoutId,
            identifier: EstablishmentIdentifier.buildIdentifierFromString(dbo.identifier) as Siret | Ridet | Tahitiet,
        };
    }

    public async createIndexes() {
        // use TS to avoid typo in index names
        const societyCode: keyof ChorusFseEntity = "societyCode";
        const budgetaryYear: keyof ChorusFseEntity = "budgetaryYear";
        const paymentRequestPostNum: keyof ChorusFseEntity = "paymentRequestPostNum";
        const paymentRequestNum: keyof ChorusFseEntity = "paymentRequestNum";

        // numeroDemandePaiement, exercice, codeSociete, numPosteDP

        await this.collection.createIndex(
            {
                [budgetaryYear]: 1,
                [societyCode]: 1,
                [paymentRequestPostNum]: 1,
                [paymentRequestNum]: 1,
            },
            { unique: true },
        );
    }

    public getIterableFindAll() {
        return this.collection.find({}).map(dbo => this.toEntity(dbo)) as AsyncIterable<ChorusFseEntity>;
    }

    public async upsertMany(entities: ChorusFseEntity[]) {
        if (!entities.length) return Promise.resolve();
        const bulk = entities.map(entity => {
            const { budgetaryYear, societyCode, paymentRequestPostNum, paymentRequestNum } = entity;
            return {
                updateOne: {
                    filter: {
                        budgetaryYear,
                        societyCode,
                        paymentRequestPostNum,
                        paymentRequestNum,
                    } as Partial<ChorusFseEntity>,
                    update: { $set: this.toDbo(entity) },
                    upsert: true,
                },
            };
        });
        await this.collection.bulkWrite(bulk, { ordered: false });
    }

    public async findByExercise(exercise: number): Promise<ChorusFseEntity[]> {
        console.log("findByEx: ", exercise);
        const dbos = await this.collection.find({ budgetaryYear: exercise }).toArray();
        return dbos.map(this.toEntity);
    }
}

const chorusFseAdapter = new ChorusFseAdapter();
export default chorusFseAdapter;
