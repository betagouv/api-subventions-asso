import { AssociationIdentifier, EstablishmentIdentifier } from "../../../identifier-objects";

export default class GetIdentifierFromStringUseCase {
    /**
     *  Order matters as it give priority to SIREN over RIDET
     *  RIDET and SIREN share a common format.
     *  SIREN contains 9 numbers
     *  RIDET contains 9 to 10 numbers
     *  Since 2010, RIDET are supposed to be 10 numbers long.
     *  Takes any 9 numbers long string as a SIREN
     */
    execute(str: string) {
        return (
            AssociationIdentifier.buildIdentifierFromString(str) ??
            EstablishmentIdentifier.buildIdentifierFromString(str) ??
            null
        );
    }
}
