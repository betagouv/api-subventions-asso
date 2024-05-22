import { ObjectId } from "mongodb";
import { DataBretagneProgrammeDto } from "../../api/dataBretagne/DataBretagneDto";
import StateBudgetProgramDbo from "./StateBudgetProgramDbo";

export default class StateBudgetProgramAdapter {
    static toDbo(data: DataBretagneProgrammeDto): StateBudgetProgramDbo {
        return {
            _id: new ObjectId(),
            mission: data.label_theme,
            code_ministere: data.code_ministere,
            code_programme: data.code,
            label_programme: data.label,
        };
    }
}
