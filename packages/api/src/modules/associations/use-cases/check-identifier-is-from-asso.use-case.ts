import { AnyIdentifierIdType } from "../../../identifier-objects/@types/IdentifierType";
import { Rid, Ridet, Rna, Siren, Siret, Tahiti, Tahitiet } from "../../../identifier-objects";
import CheckSirenIsFromAssoUseCase from "./check-siren-is-from-asso.use-case";

export default class CheckIdentifierIsFromAssoUseCase {
    constructor(private checkSirenFromAsso: CheckSirenIsFromAssoUseCase) {}

    async execute(identifier: AnyIdentifierIdType) {
        if (identifier instanceof Rna) return true;

        // we have no way of asserting those identifier types belong to an association
        const notHandled = [Ridet, Tahitiet, Rid, Tahiti].find(constructor => identifier instanceof constructor);
        if (notHandled) return true;

        const siren = identifier instanceof Siren ? identifier : (identifier as Siret).toSiren();
        return this.checkSirenFromAsso.execute(siren);
    }
}
