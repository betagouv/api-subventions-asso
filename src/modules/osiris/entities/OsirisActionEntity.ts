import { ObjectId } from "mongodb";
import OsirisActionFileColumn from "../@types/action/OsirisActionFileColumn";
import OsirisActionBeneficiaryAssociationColumn from "../@types/action/OsirisActionBeneficiaryAssociationColumn";
import OsirisActionSpecificationsColumn from "../@types/action/OsirisActionSpecificationsColumn";
import OsirisActionAffiliatingFederationColumn from "../@types/action/OsirisActionAffiliatingFederationColumn";
import OsirisActionBeneficiariesColumn from "../@types/action/OsirisActionBeneficiariesColumn";
import OsirisActionTerritoriesColumn from "../@types/action/OsirisActionTerritoriesColumn";
import OsirisActionResourcesColumn from "../@types/action/OsirisActionResourcesColumn";
import OsirisActionAmountsColumn from "../@types/action/OsirisActionAmountsColumn";
import OsirisActionCoFinanciersColumn from "../@types/action/OsirisActionCoFinanciersColumn";
import OsirisActionOtherColumn from "../@types/action/OsirisActionOtherColumn";
import OsirisActionCustomColumn from "../@types/action/OsirisActionCustomColumn";
import OsirisActionResourcesEvaluationColumn from "../@types/action/OsirisActionResourcesEvaluationColumn";
import OsirisActionEvaluationColumn from "../@types/action/OsirisActionEvaluationColumn";

export default class OsirisActionEntity {
    constructor(
        public readonly folder: OsirisActionFileColumn,
        public readonly beneficiaryAssociation: OsirisActionBeneficiaryAssociationColumn,
        public readonly specifications: OsirisActionSpecificationsColumn,
        public readonly affiliatingFederation: OsirisActionAffiliatingFederationColumn,
        public readonly beneficiaries: OsirisActionBeneficiariesColumn,
        public readonly territories: OsirisActionTerritoriesColumn,
        public readonly resources: OsirisActionResourcesColumn,
        public readonly resourcesEvaluation: OsirisActionResourcesEvaluationColumn,
        public readonly amount: OsirisActionAmountsColumn,
        public readonly coFinanciers: OsirisActionCoFinanciersColumn,
        public readonly other: OsirisActionOtherColumn,
        public readonly evaluation: OsirisActionEvaluationColumn,
        public readonly custom: OsirisActionCustomColumn,
        public _id?: ObjectId
    ) {}
}