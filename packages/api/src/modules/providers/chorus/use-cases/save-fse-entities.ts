import chorusFseAdapter, {
    ChorusFseAdapter,
} from "../../../../adapters/outputs/db/providers/chorus/chorus-fse.adapter";
import ChorusFseEntity from "../entities/ChorusFseEntity";

export class SaveChorusFseEntities {
    constructor(private chorusFseAdapter: ChorusFseAdapter) {}

    async execute(entities: ChorusFseEntity[]) {
        return this.chorusFseAdapter.upsertMany(entities);
    }
}

const saveChorusFseEntities = new SaveChorusFseEntities(chorusFseAdapter);
export default saveChorusFseEntities;
