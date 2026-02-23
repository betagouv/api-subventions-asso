import { ObjectId } from "mongodb";
import StateBudgetProgramEntity from "../../../entities/StateBudgetProgramEntity";
import StateBudgetProgramDbo from "./StateBudgetProgramDbo";

/**
 * Mapper class for converting between StateBudgetProgramEntity and StateBudgetProgramDbo.
 */
export default class StateBudgetProgramMapper {
    /**
     * Converts a StateBudgetProgramEntity to a StateBudgetProgramDbo.
     * @param entity The StateBudgetProgramEntity to convert.
     * @returns The converted StateBudgetProgramDbo.
     */
    static toDbo(entity: StateBudgetProgramEntity): StateBudgetProgramDbo {
        return {
            _id: new ObjectId(),
            mission: entity.mission,
            code_ministere: entity.code_ministere,
            code_programme: entity.code_programme,
            label_programme: entity.label_programme,
        };
    }

    /**
     * Converts a StateBudgetProgramDbo to a StateBudgetProgramEntity.
     * @param dbo The StateBudgetProgramDbo to convert.
     * @returns The converted StateBudgetProgramEntity.
     */
    static toEntity(dbo: StateBudgetProgramDbo): StateBudgetProgramEntity {
        return new StateBudgetProgramEntity(dbo.mission, dbo.label_programme, dbo.code_ministere, dbo.code_programme);
    }
}
