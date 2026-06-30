import chorusAdapter, { ChorusAdapter } from "../../../../adapters/outputs/db/providers/chorus/chorus.adapter";
import ChorusEntity from "../entities/ChorusEntity";

export class SaveChorusEntities {
    private BATCH_SIZE = 10000;
    constructor(private chorusAdapter: ChorusAdapter) {}

    async execute(entities: ChorusEntity[]) {
        const batches: ChorusEntity[][] = [];

        for (let i = 0; i < entities.length; i += this.BATCH_SIZE) {
            batches.push(entities.slice(i, i + this.BATCH_SIZE));
        }

        // this is sequential, if process is too slow we could try to make multiple calls simultaneously
        for (const batch of batches) {
            await this.chorusAdapter.upsertMany(batch);
        }
    }
}

const saveChorusEntities = new SaveChorusEntities(chorusAdapter);
export default saveChorusEntities;
