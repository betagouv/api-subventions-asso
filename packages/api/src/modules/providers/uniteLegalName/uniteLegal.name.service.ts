import { Siren, Siret } from "dto";
import Fuse from "fuse.js";
import { StructureIdentifiersEnum } from "../../../@enums/StructureIdentifiersEnum";
import { AssociationIdentifiers } from "../../../@types";
import uniteLegalNamePort from "../../../dataProviders/db/uniteLegalName/uniteLegalName.port";
import { isStartOfSiret } from "../../../shared/Validators";
import { getIdentifierType } from "../../../shared/helpers/IdentifierHelper";
import { siretToSiren } from "../../../shared/helpers/SirenHelper";
import UniteLegalNameEntity from "../../../entities/UniteLegalNameEntity";
import rnaSirenService from "../../rna-siren/rnaSiren.service";
import AssociationNameAdapter from "../../association-name/adapters/AssociationNameAdapter";

export class UniteLegalNameService {
    async getNameFromIdentifier(identifier: AssociationIdentifiers): Promise<UniteLegalNameEntity | null> {
        let siren;
        if (getIdentifierType(identifier) === StructureIdentifiersEnum.siren) siren = identifier;
        else {
            const rnaSirenEntities = await rnaSirenService.find(identifier);
            if (!rnaSirenEntities || !rnaSirenEntities.length) return null;
            siren = rnaSirenEntities[0].siren;
        }
        return uniteLegalNamePort.findOneBySiren(siren);
    }

    async searchBySirenSiretName(value: Siren | Siret | string) {
        if (isStartOfSiret(value)) value = siretToSiren(value); // Check if value is a start of siret
        const associations = await uniteLegalNamePort.search(value);
        const groupedNameByStructures = associations.reduce((acc, entity) => {
            if (!acc[entity.siren]) acc[entity.siren] = [];
            acc[entity.siren].push(entity);
            return acc;
        }, {} as Record<Siren, UniteLegalNameEntity[]>);

        const fuseSearch = (names: UniteLegalNameEntity[]) => {
            const fuse = new Fuse(names, {
                includeScore: true,
                findAllMatches: true,
                keys: ["searchKey"],
            });
            return fuse.search(value).sort((a, b) => (a.score || 1) - (b.score || 1));
        };

        const rnaSirenPromises = Object.values(groupedNameByStructures).map(async namesBySiren => {
            let bestMatch = namesBySiren[0];
            if (namesBySiren.length > 1) {
                const scoredMatchNamesBySiren = fuseSearch(namesBySiren);
                if (scoredMatchNamesBySiren.length) bestMatch = scoredMatchNamesBySiren[0].item;
            }

            const rnaSirenEntities = await rnaSirenService.find(bestMatch.siren);

            if (!rnaSirenEntities) return [AssociationNameAdapter.fromUniteLegalNameEntity(bestMatch)];

            return rnaSirenEntities?.map(entity => {
                // For one siren its possible to have many rna from match
                return AssociationNameAdapter.fromUniteLegalNameEntity(bestMatch, entity.rna);
            });
        });
        return (await Promise.all(rnaSirenPromises)).flat();
    }

    insert(entity: UniteLegalNameEntity) {
        return uniteLegalNamePort.insert(entity);
    }
}

const uniteLegalNameService = new UniteLegalNameService();

export default uniteLegalNameService;
