import { IdentifierEnum } from "$lib/enums/IdentifierEnum";
import { isSiren } from "$lib/helpers/identifierHelper";

export default class DuplicateAlertController {
    duplicates: string[];
    duplicateType: IdentifierEnum;
    otherType: IdentifierEnum;

    constructor(duplicates) {
        this.duplicates = duplicates;
        if (isSiren(duplicates[0])) {
            this.duplicateType = IdentifierEnum.siren;
            this.otherType = IdentifierEnum.rna;
        } else {
            this.duplicateType = IdentifierEnum.rna;
            this.otherType = IdentifierEnum.siren;
        }
    }
}
