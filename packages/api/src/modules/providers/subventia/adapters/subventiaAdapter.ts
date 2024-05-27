import * as ParseHelper from "../../../../shared/helpers/ParserHelper";

import SubventiaLineEntity from "../entities/SubventiaLineEntity";

/* Question :
 0) Est-ce que les valeurs associés à un status sont uniformisé entre les differentes sources de données ?

*/

export default class SubventiaAdapter {
    static applicationToEntity(application) {
        return ParseHelper.indexDataByPathObject(SubventiaLineEntity.indexedInformationsPath, application);
    }
}
