import { EstablishmentIdentifier, Siret } from "../../../../identifier-objects";
import { BRANCHE_ACCEPTED } from "../../../../shared/ChorusBrancheAccepted";
import { asyncFilter } from "../../../../shared/helpers/ArrayHelper";
import checkIdentifierIsFromAsso, {
    CheckIdentifierIsFromAssoUseCase,
} from "../../../associations/use-cases/check-identifier-is-from-asso.use-case";
import ChorusEntity from "../entities/ChorusEntity";

export class FilterChorusEntities {
    constructor(private checkIsAsso: CheckIdentifierIsFromAssoUseCase) {}

    execute(entities: ChorusEntity[]) {
        return asyncFilter(entities, async entity => {
            if (!BRANCHE_ACCEPTED[entity.codeBranche]) return false;
            try {
                if (entity.siret === "#" && entity.ridetOrTahitiet === "#") return false;
                if (entity.siret === "#") {
                    return await this.checkIsAsso.execute(
                        EstablishmentIdentifier.buildIdentifierFromString(entity.ridetOrTahitiet)!,
                    );
                } else {
                    return await this.checkIsAsso.execute(new Siret(entity.siret));
                }
            } catch (e) {
                // filter entities with wrong identifiers format
                // @TODO: make entity validates identifiers
                console.log(e);
                return Promise.resolve(false);
            }
        });
    }
}

const filtreAssoChorusEntities = new FilterChorusEntities(checkIdentifierIsFromAsso);
export default filtreAssoChorusEntities;
