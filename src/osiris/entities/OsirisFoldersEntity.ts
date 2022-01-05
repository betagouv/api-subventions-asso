import { ObjectId } from "mongodb";

import OsirisActionsNumberColumn from "../@types/OsirisActionsNumberColumn";
import OsirisAmountsColumn from "../@types/OsirisAmountsColumn";
import OsirisAssociationColumn from "../@types/OsirisAssociationColumn";
import OsirisCommentsColumn from "../@types/OsirisCommentsColumn";
import OsirisEvaluationColumn from "../@types/OsirisEvaluationColumn";
import OsirisFolderColumn from "../@types/OsirisFolderColumn";
import OsirisLegalRepresentativeColumn from "../@types/OsirisLegalRepresentativeColumn";
import OsirisMailingAddressColumn from "../@types/OsirisMailingAddressColumn";
import OsirisPaymentsColumn from "../@types/OsirisPaymentsColumn";

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