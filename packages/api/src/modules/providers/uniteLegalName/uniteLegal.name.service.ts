import { Siren, Siret } from "dto";
import { StructureIdentifiersEnum } from "../../../@enums/StructureIdentifiersEnum";
import { AssociationIdentifiers } from "../../../@types";
import rnaSirenPort from "../../../dataProviders/db/rnaSiren/rnaSiren.port";
import uniteLegalNamePort from "../../../dataProviders/db/uniteLegalName/uniteLegalName.port";
import { isStartOfSiret } from "../../../shared/Validators";
import { getIdentifierType } from "../../../shared/helpers/IdentifierHelper";
import { siretToSiren } from "../../../shared/helpers/SirenHelper";
import UniteLegalNameEntity from "../../../entities/UniteLegalNameEntity";

export class UniteLegalNameService {
    async getNameFromIdentifier(identifier: AssociationIdentifiers): Promise<UniteLegalNameEntity | null> {
        let siren;
        if (getIdentifierType(identifier) === StructureIdentifiersEnum.siren) siren = identifier;
        else {
            const rnaSiren = await rnaSirenPort.find(identifier);
            if (!rnaSiren || !rnaSiren.length) return null;
            siren = rnaSiren[0].siren;
        }
        return uniteLegalNamePort.findOneBySiren(siren);
    }

    async searchBySirenSiretName(value: Siren | Siret | string) {
        if (isStartOfSiret(value)) value = siretToSiren(value); // Check if value is a start of siret
        const associations = await uniteLegalNamePort.search(value);
        return associations;
    }

    insert(entity: UniteLegalNameEntity) {
        return uniteLegalNamePort.insert(entity);
    }
}

const uniteLegalNameService = new UniteLegalNameService();

export default uniteLegalNameService;
