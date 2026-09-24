import { MultipleAssociationsError, NotAssociationError } from "core";
import AssociationIdentifier from "../../identifier-objects/AssociationIdentifier";
import Rna from "../../identifier-objects/Rna";
import Siren from "../../identifier-objects/Siren";
import Siret from "../../identifier-objects/Siret";
import { IdentifierError } from "./IdentifierError";
import rnaSirenService from "../rna-siren/rna-siren.service";
import { AssociationIdType } from "../../identifier-objects/@types/IdentifierType";
import sireneUniteLegaleAdapter from "../../adapters/outputs/db/sirene/sirene-unite-legale.adapter";
import rnaAdapter from "../../adapters/outputs/db/rna/rna.adapter";

export class AssociationIdentifierService {
    async getAssociationIdentifiers(id: string): Promise<AssociationIdentifier[]> {
        const associationIdentifier = this.identifierStringToEntity(id);

        const rnaSirenEntities = await rnaSirenService.find(associationIdentifier);
        if (!rnaSirenEntities || rnaSirenEntities?.length === 0) {
            const results: AssociationIdentifier[] = [];
            if (associationIdentifier instanceof Rna) {
                const sireneResult = await sireneUniteLegaleAdapter.findOneByRna(associationIdentifier);
                if (
                    sireneResult &&
                    associationIdentifier.value === sireneResult.identifiantAssociationUniteLegale.value
                )
                    results.push(
                        AssociationIdentifier.fromSirenAndRna(
                            sireneResult.siren,
                            sireneResult.identifiantAssociationUniteLegale,
                        ),
                    );
                const rnaResult = await rnaAdapter.getByRna(associationIdentifier);
                if (rnaResult && rnaResult.siret)
                    results.push(
                        AssociationIdentifier.fromSirenAndRna(
                            new Siren(Siret.getSiren(rnaResult.siret.value)),
                            rnaResult.id,
                        ),
                    );
            } else {
                const sireneResult = await sireneUniteLegaleAdapter.findOneBySiren(associationIdentifier);
                if (sireneResult?.identifiantAssociationUniteLegale)
                    results.push(
                        AssociationIdentifier.fromSirenAndRna(
                            sireneResult.siren,
                            sireneResult.identifiantAssociationUniteLegale,
                        ),
                    );
            }

            const filteredResults = this.filterDuplicates(results);
            rnaSirenService.insertManyAssociationIdentifer(filteredResults);

            return filteredResults;
        }

        return rnaSirenEntities.map(rnaSirenEntity =>
            AssociationIdentifier.fromSirenAndRna(rnaSirenEntity.siren, rnaSirenEntity.rna),
        );
    }

    private filterDuplicates(identifiers: AssociationIdentifier[]) {
        return identifiers.reduce((acc, associationIdentifier) => {
            if (acc.length > 0) {
                if (acc.find(ai => ai.rna !== associationIdentifier.rna && ai.siren !== associationIdentifier.siren)) {
                    acc.push(associationIdentifier);
                }
            } else acc.push(associationIdentifier);
            return acc;
        }, [] as AssociationIdentifier[]);
    }

    async getOneAssociationIdentifier(id: string): Promise<AssociationIdentifier> {
        const identifiers = await this.getAssociationIdentifiers(id);

        if (identifiers.length > 1) {
            throw new MultipleAssociationsError();
        } else if (identifiers.length === 0) {
            throw new NotAssociationError();
        }

        return identifiers[0];
    }

    identifierStringToEntity(id: string): AssociationIdType {
        if (Rna.isRna(id)) {
            return new Rna(id);
        } else if (Siren.isSiren(id)) {
            return new Siren(id);
        } else if (Siret.isSiret(id)) {
            return new Siret(id).toSiren();
        }

        throw new IdentifierError(id);
    }
}

const associationIdentifierService = new AssociationIdentifierService();
export default associationIdentifierService;
