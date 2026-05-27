import { RnaSirenService } from "../../../rna-siren/rna-siren.service";
import { AssociationsHelper } from "../../../associations/associations.helper";
import OsirisRequestEntity from "../entities/OsirisRequestEntity";
import Rna from "../../../../identifier-objects/Rna";
import Siret from "../../../../identifier-objects/Siret";
import AssociationIdentifier from "../../../../identifier-objects/AssociationIdentifier";
import { InvalidOsirisRequestError, VALID_REQUEST_ERROR_CODE } from "../osiris.errors";
import rnaSirenService from "../../../rna-siren/rna-siren.service";
import associationHelper from "../../../associations/associations.helper";
import RnaSirenEntity from "../../../../entities/RnaSirenEntity";

export default class CompleteOsirisRequestUseCase {
    constructor(
        private rnaSirenService: RnaSirenService,
        private associationHelper: AssociationsHelper,
    ) {}

    /**
     * Complete optional fields on the entity:
     * 1. If RNA is missing/invalid : try to recover it from rnaSirenService
     * 2. If RNA is missing again : check with isIdentifierFromAsso if SIRET match an association
     * 3. If SIRET does not match an association : reject the request
     */
    async execute(request: OsirisRequestEntity): Promise<void> {
        const siret = request.association?.siret as string;
        if (!Siret.isSiret(siret)) return;

        const siren = new Siret(siret).toSiren();

        // If RNA is missing/invalid : try to recover it from rnaSirenService
        if (!Rna.isRna(request.association?.rna)) {
            let rnaSirenEntities: RnaSirenEntity[] = [];

            try {
                rnaSirenEntities = (await this.rnaSirenService.find(siren)) as RnaSirenEntity[];
            } catch (error) {
                throw new InvalidOsirisRequestError({
                    message: `API Asso unavailable - SIRET: ${siret}`,
                    data: { siret, error: error instanceof Error ? error.message : String(error) },
                    code: VALID_REQUEST_ERROR_CODE.API_ASSO_UNAVAILABLE,
                });
            }

            // If RNA is found : set it on the entity
            if (rnaSirenEntities?.length) {
                request.association = request.association || {};
                request.association.rna = rnaSirenEntities[0].rna.value;
            }
        }

        // If RNA is missing again : check via isIdentifierFromAsso that the SIRET match an association
        if (!Rna.isRna(request.association?.rna)) {
            let isAsso: boolean;

            try {
                isAsso = await this.associationHelper.isIdentifierFromAsso(AssociationIdentifier.fromSiren(siren));
            } catch (error) {
                throw new InvalidOsirisRequestError({
                    message: `API Asso unavailable - SIRET: ${siret}`,
                    data: { siret, error: error instanceof Error ? error.message : String(error) },
                    code: VALID_REQUEST_ERROR_CODE.API_ASSO_UNAVAILABLE,
                });
            }

            // If SIRET does not match an association : reject the request
            if (!isAsso) {
                throw new InvalidOsirisRequestError({
                    message: `SIRET does not belong to an association: ${siret}`,
                    data: { siret, rna: request.association?.rna },
                    code: VALID_REQUEST_ERROR_CODE.NOT_AN_ASSOCIATION,
                });
            }

            request.association = request.association || {};
            request.association.rna = undefined;
        }
    }
}

const completeOsirisRequestUseCase = new CompleteOsirisRequestUseCase(rnaSirenService, associationHelper);
export { completeOsirisRequestUseCase };
