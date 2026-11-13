import ChorusFseEntity from "../../../../../modules/providers/chorus/entities/ChorusFseEntity";
import MongoAdapter from "../../MongoAdapter";
import { toEntity } from "./chorus-fse.mapper";
import { ChorusFsePort } from "./chorus-fse.port";
import { ChorusFseDbo } from "./chorus.dbo";

export class ChorusFseAdapter extends MongoAdapter<ChorusFseDbo> implements ChorusFsePort {
    readonly collectionName = "chorus-fse";

    public async createIndexes() {
        // use TS to avoid typo in index names
        const codeSociete: keyof ChorusFseDbo = "codeSociete";
        const exercice: keyof ChorusFseDbo = "exercice";
        const numPosteDP: keyof ChorusFseDbo = "numPosteDP";
        const numeroDemandePaiement: keyof ChorusFseDbo = "numeroDemandePaiement";

        await this.collection.createIndex(
            {
                [exercice]: 1,
                [codeSociete]: 1,
                [numPosteDP]: 1,
                [numeroDemandePaiement]: 1,
            },
            { unique: true },
        );
    }

    // only for integ tests
    public findAll() {
        return this.collection
            .find({})
            .map(dbo => toEntity(dbo))
            .toArray();
    }

    public getIterableFindAll() {
        return this.collection.find({}).map(dbo => toEntity(dbo)) as AsyncIterable<ChorusFseEntity>;
    }

    public async upsertMany(dbos: ChorusFseDbo[]) {
        if (!dbos.length) return Promise.resolve();
        const bulk = dbos.map(dbo => {
            const { exercice, codeSociete, numPosteDP, numeroDemandePaiement } = dbo;
            return {
                updateOne: {
                    filter: {
                        exercice,
                        codeSociete,
                        numPosteDP,
                        numeroDemandePaiement,
                    } as Partial<ChorusFseDbo>,
                    update: { $set: dbo },
                    upsert: true,
                },
            };
        });
        await this.collection.bulkWrite(bulk, { ordered: false });
    }

    public async findByExercise(exercise: number): Promise<ChorusFseEntity[]> {
        const dbos = await this.collection.find({ exercice: exercise }).toArray();
        return dbos.map(toEntity);
    }
}

const chorusFseAdapter = new ChorusFseAdapter();
export default chorusFseAdapter;
