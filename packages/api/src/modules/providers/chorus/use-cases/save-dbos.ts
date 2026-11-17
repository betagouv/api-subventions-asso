import chorusAdapter, { ChorusAdapter } from "../../../../adapters/outputs/db/providers/chorus/chorus.adapter";
import ChorusDbo from "../../../../adapters/outputs/db/providers/chorus/chorus.dbo";

export class SaveChorusDbos {
    private BATCH_SIZE = 10000;
    constructor(private chorusAdapter: ChorusAdapter) {}

    async execute(entities: ChorusDbo[]) {
        const batches: ChorusDbo[][] = [];

        for (let i = 0; i < entities.length; i += this.BATCH_SIZE) {
            batches.push(entities.slice(i, i + this.BATCH_SIZE));
        }

        // this is sequential, if process is too slow we could try to make multiple calls simultaneously
        for (const batch of batches) {
            await this.chorusAdapter.upsertMany(batch);
        }
    }
}

const saveChorusDbos = new SaveChorusDbos(chorusAdapter);
export default saveChorusDbos;
