import * as ParseHelper from "../../../../shared/helpers/ParserHelper";

import SubventiaLineEntity from "../entities/SubventiaLineEntity";

export default class SubventiaAdapter {
    protected static applicationToEntity(application) {
        return ParseHelper.indexDataByPathObject(
            SubventiaLineEntity.indexedInformationsPath,
            application,
        ) as unknown as SubventiaLineEntity;
    }
}
