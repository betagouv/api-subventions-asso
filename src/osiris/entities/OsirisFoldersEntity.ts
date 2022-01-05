import { ObjectId } from "mongodb";

import OsirisActionsNumberColumn from "../@types/folder/OsirisActionsNumberColumn";
import OsirisAmountsColumn from "../@types/folder/OsirisAmountsColumn";
import OsirisAssociationColumn from "../@types/folder/OsirisAssociationColumn";
import OsirisCommentsColumn from "../@types/folder/OsirisCommentsColumn";
import OsirisEvaluationColumn from "../@types/folder/OsirisEvaluationColumn";
import OsirisFolderColumn from "../@types/folder/OsirisFolderColumn";
import OsirisLegalRepresentativeColumn from "../@types/folder/OsirisLegalRepresentativeColumn";
import OsirisMailingAddressColumn from "../@types/folder/OsirisMailingAddressColumn";
import OsirisPaymentsColumn from "../@types/folder/OsirisPaymentsColumn";

export default class OsirisFolderEntity {
    constructor(
        public readonly folder: OsirisFolderColumn,
        public readonly association: OsirisAssociationColumn,
        public readonly mailingAddress: OsirisMailingAddressColumn,
        public readonly legalRepresentative: OsirisLegalRepresentativeColumn,
        public readonly actionsNumber: OsirisActionsNumberColumn,
        public readonly amounts: OsirisAmountsColumn,
        public readonly payments: OsirisPaymentsColumn,
        public readonly evaluation: OsirisEvaluationColumn,
        public readonly comments: OsirisCommentsColumn,
        public _id?: ObjectId
    ) {}
}