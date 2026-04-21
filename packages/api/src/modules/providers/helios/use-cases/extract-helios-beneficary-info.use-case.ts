import { EstablishmentIdName, CompanyIdName } from "dto";
import {
    EstablishmentIdType,
    CompanyIdType,
    AssociationIdType,
} from "../../../../identifier-objects/@types/IdentifierType";
import AssociationIdentifier from "../../../../identifier-objects/AssociationIdentifier";
import EstablishmentIdentifier from "../../../../identifier-objects/EstablishmentIdentifier";
import { IdentifierError } from "../../../association-identifier/IdentifierError";
import HeliosEntity from "../domain/helios.entity";
import Siren from "../../../../identifier-objects/Siren";
import Rna from "../../../../identifier-objects/Rna";
import FindSiretFromAssociationIdentifierUseCase from "../../../associations/use-cases/find-siret-from-association-identifier.use-case";

export default class ExtractHeliosBeneficaryInfosUseCase {
    constructor(private findSiretFromAssociationIdentifier: FindSiretFromAssociationIdentifierUseCase) {}

    async execute(entity: HeliosEntity) {
        let beneficiaryEstablishmentId: EstablishmentIdType,
            beneficiaryEstablishmentIdType: EstablishmentIdName,
            beneficiaryCompanyId: CompanyIdType,
            beneficiaryCompanyIdType: CompanyIdName;

        let typeOfImmatriculation: CompanyIdType | EstablishmentIdType | AssociationIdType | null =
            EstablishmentIdentifier.buildIdentifierFromString(entity.immatriculation);

        if (typeOfImmatriculation) {
            beneficiaryEstablishmentId = typeOfImmatriculation;
            beneficiaryEstablishmentIdType = typeOfImmatriculation.name;
            beneficiaryCompanyId = EstablishmentIdentifier.getAssociationIdentifier(beneficiaryEstablishmentId);
            beneficiaryCompanyIdType = beneficiaryCompanyId.name;
        } else {
            typeOfImmatriculation = AssociationIdentifier.buildIdentifierFromString(entity.immatriculation);

            if (!typeOfImmatriculation) {
                throw new IdentifierError(entity.immatriculation);
            }

            if (typeOfImmatriculation instanceof Rna || typeOfImmatriculation instanceof Siren) {
                const siret = await this.findSiretFromAssociationIdentifier.execute(typeOfImmatriculation);
                if (siret) {
                    beneficiaryEstablishmentId = siret;
                    beneficiaryEstablishmentIdType = beneficiaryEstablishmentId.name;
                    beneficiaryCompanyId = siret.toSiren();
                    beneficiaryCompanyIdType = beneficiaryCompanyId.name;
                } else {
                    throw new Error(
                        `Could not find a SIRET from ${typeOfImmatriculation.name} : ${typeOfImmatriculation.toString()}`,
                    );
                }
            } else throw new Error(`RID and TAHITI are not yet supported in flats`);
        }

        return {
            beneficiaryEstablishmentId,
            beneficiaryEstablishmentIdType,
            beneficiaryCompanyId,
            beneficiaryCompanyIdType,
        };
    }
}
