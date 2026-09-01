import { AssociationWithProviderValues } from "dto";
import AsyncUseCase from "../../../@types/use-case/AsyncUseCase";
import { AssociationIdentifier } from "../../../identifier-objects";
import getRnaStructureData, { GetRnaStructureData } from "./get-rna-structure-data";
import getSirenStructureData, { GetSirenStructureData } from "./get-siren-structure-data";
import { NotFoundError } from "core";

export class GetAssociation implements AsyncUseCase<AssociationIdentifier, AssociationWithProviderValues> {
    constructor(
        private getRnaStructureData: GetRnaStructureData,
        private getSirenStructureData: GetSirenStructureData,
    ) {}

    async execute(identifier: AssociationIdentifier) {
        const promises: Promise<AssociationWithProviderValues | null>[] = [];
        if (identifier.rna) promises.push(this.getRnaStructureData.execute(identifier.rna));
        if (identifier.siren) promises.push(this.getSirenStructureData.execute(identifier.siren));

        const assos = (await Promise.all(promises)).filter(asso => asso !== null);

        if (assos.length === 0) throw new NotFoundError("Association not found");
        if (assos.length === 1) return assos[0];
        // getRnaStructureData and getSirenStructureData are not supposed to return same fields from AssociationWithProviderValues
        else return Object.assign({ ...assos[0] }, { ...assos[1] });
    }
}

const getAssociation = new GetAssociation(getRnaStructureData, getSirenStructureData);
export default getAssociation;
