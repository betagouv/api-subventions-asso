import { ObjectId } from "mongodb";

import OsirisActionsNumberColumn from "../@types/file/OsirisActionsNumberColumn";
import OsirisAmountsColumn from "../@types/file/OsirisAmountsColumn";
import OsirisAssociationColumn from "../@types/file/OsirisAssociationColumn";
import OsirisCommentsColumn from "../@types/file/OsirisCommentsColumn";
import OsirisEvaluationColumn from "../@types/file/OsirisEvaluationColumn";
import OsirisFileColumn from "../@types/file/OsirisFileColumn";
import OsirisLegalRepresentativeColumn from "../@types/file/OsirisLegalRepresentativeColumn";
import OsirisMailingAddressColumn from "../@types/file/OsirisMailingAddressColumn";
import OsirisPaymentsColumn from "../@types/file/OsirisPaymentsColumn";

export default class OsirisFileEntity {
    constructor(
        public readonly file: OsirisFileColumn,
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