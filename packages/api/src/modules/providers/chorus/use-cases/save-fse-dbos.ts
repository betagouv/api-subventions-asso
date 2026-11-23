import chorusFseAdapter, {
    ChorusFseAdapter,
} from "../../../../adapters/outputs/db/providers/chorus/chorus-fse.adapter";
import { ChorusFseDbo } from "../../../../adapters/outputs/db/providers/chorus/chorus.dbo";

export class SaveChorusFseDbos {
    constructor(private chorusFseAdapter: ChorusFseAdapter) {}

    async execute(dbos: ChorusFseDbo[]) {
        return this.chorusFseAdapter.upsertMany(dbos);
    }
}

const saveChorusFseDbos = new SaveChorusFseDbos(chorusFseAdapter);
export default saveChorusFseDbos;
