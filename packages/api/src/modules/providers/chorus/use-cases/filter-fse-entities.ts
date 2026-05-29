import { BRANCHE_ACCEPTED } from "../../../../shared/ChorusBrancheAccepted";
import { asyncFilter } from "../../../../shared/helpers/ArrayHelper";
import checkIdentifierIsFromAsso, {
    CheckIdentifierIsFromAssoUseCase,
} from "../../../associations/use-cases/check-identifier-is-from-asso.use-case";
import ChorusFseEntity from "../entities/ChorusFseEntity";

export class FilterChorusFseEntities {
    constructor(private checkIsAsso: CheckIdentifierIsFromAssoUseCase) {}

    execute(entities: ChorusFseEntity[]) {
        return asyncFilter(entities, async entity => {
            if (!BRANCHE_ACCEPTED[entity.branchCode]) return false;
            return this.checkIsAsso.execute(entity.identifier);
        });
    }
}

const filtreAssoChorusFseEntities = new FilterChorusFseEntities(checkIdentifierIsFromAsso);
export default filtreAssoChorusFseEntities;
