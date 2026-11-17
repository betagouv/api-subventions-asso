import ChorusEntity from "../../../../../domain/providers/chorus/ChorusEntity";
import ChorusDbo from "./chorus.dbo";

export function dboToEntity(dbo: ChorusDbo) {
    return new ChorusEntity({ ...dbo });
}
