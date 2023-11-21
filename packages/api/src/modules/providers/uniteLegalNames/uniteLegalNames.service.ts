import { StructureIdentifiersEnum } from "../../../@enums/StructureIdentifiersEnum";
import { AssociationIdentifiers } from "../../../@types";
import rnaSirenPort from "../../../dataProviders/db/rnaSiren/rnaSiren.port";
import uniteLegalNamesPort from "../../../dataProviders/db/uniteLegalNames/uniteLegalNames.port";
import { isStartOfSiret } from "../../../shared/Validators";
import { getIdentifierType } from "../../../shared/helpers/IdentifierHelper";
import { siretToSiren } from "../../../shared/helpers/SirenHelper";
import UniteLegalNameEntity from "../../../entities/UniteLegalNameEntity";

export class UniteLegalNamesService {
    async getNameFromIdentifier(identifier: AssociationIdentifiers): Promise<UniteLegalNameEntity | null> {
        let siren;
        if (getIdentifierType(identifier) === StructureIdentifiersEnum.siren) siren = identifier;
        else {
            const rnaSiren = await rnaSirenPort.find(identifier);
            if (!rnaSiren || !rnaSiren.length) return null;
            siren = rnaSiren[0].siren;
        }
        return uniteLegalNamesPort.findOneBySiren(siren);
    }

    async findBy(value: string) { // getAllStartingWith
        if (isStartOfSiret(value)) value = siretToSiren(value); // Check if value is a start of siret

        const associations = await uniteLegalNamesPort.search(value);
        return associations
    }

    insert(entity: UniteLegalNameEntity) {
        return uniteLegalNamesPort.insert(entity);
    }
}

const uniteLegalNamesService = new UniteLegalNamesService();

export default uniteLegalNamesService;