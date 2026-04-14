import { EstablishmentIdName, CompanyIdName } from "dto";
import { EstablishmentIdType, CompanyIdType } from "../../../../identifier-objects/@types/IdentifierType";
import AssociationIdentifier from "../../../../identifier-objects/AssociationIdentifier";
import EstablishmentIdentifier from "../../../../identifier-objects/EstablishmentIdentifier";
import Siret from "../../../../identifier-objects/Siret";
import { IdentifierError } from "../../../association-identifier/IdentifierError";
import HeliosEntity from "../domain/helios.entity";
import Siren from "../../../../identifier-objects/Siren";
import { SireneStockUniteLegalePort } from "../../../../adapters/outputs/db/sirene/stock-unite-legale/sirene-stock-unite-legale.port";

export default class ExtractHeliosBeneficaryInfosUseCase {
    constructor(private sirenePort: SireneStockUniteLegalePort) {}

    async execute(entity: HeliosEntity) {
        let beneficiaryEstablishmentId: EstablishmentIdType,
            beneficiaryEstablishmentIdType: EstablishmentIdName,
            beneficiaryCompanyId: CompanyIdType,
            beneficiaryCompanyIdType: CompanyIdName;

        let typeOfImmatriculation: CompanyIdType | EstablishmentIdType | null =
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
            beneficiaryCompanyId = typeOfImmatriculation;
            beneficiaryCompanyIdType = beneficiaryCompanyId.name;

            if (beneficiaryCompanyId.name === Siren.getName()) {
                const nic = (await this.sirenePort.findOneBySiren(beneficiaryCompanyId as Siren))?.nicSiegeUniteLegale;
                if (nic && Siret.isNic(nic)) {
                    beneficiaryEstablishmentId = new Siret(beneficiaryCompanyId + nic);
                    beneficiaryEstablishmentIdType = beneficiaryEstablishmentId.name;
                } else
                    throw new Error(
                        `Could not find a NIC from Sirene to build SIRET for the SIREN number : ${beneficiaryCompanyId.value}`,
                    );
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
