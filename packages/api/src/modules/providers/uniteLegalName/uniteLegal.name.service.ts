import Fuse from "fuse.js";
import uniteLegalNameAdapter from "../../../adapters/outputs/db/unite-legale-name/unite-legale-name.adapter";
import UniteLegaleNameEntity from "../../../entities/UniteLegaleNameEntity";
import rnaSirenService from "../../rna-siren/rna-siren.service";
import AssociationNameMapper from "../../association-name/mappers/association-name.mapper";
import AssociationIdentifier from "../../../identifierObjects/AssociationIdentifier";
import Siret from "../../../identifierObjects/Siret";
import Siren from "../../../identifierObjects/Siren";

export class UniteLegalNameService {
    async getNameFromIdentifier(identifier: AssociationIdentifier): Promise<UniteLegaleNameEntity | null> {
        if (!identifier.siren) return null;
        return uniteLegalNameAdapter.findOneBySiren(identifier.siren);
    }

    async searchBySirenSiretName(value: string) {
        if (Siret.isStartOfSiret(value)) value = Siren.fromPartialSiretStr(value).value;
        const associations = await uniteLegalNameAdapter.search(value);
        const groupedNameByStructures = associations.reduce(
            (acc, entity) => {
                const sirenStr = entity.siren.value;
                if (!acc[sirenStr]) acc[sirenStr] = [];
                acc[sirenStr].push(entity);
                return acc;
            },
            {} as Record<string, UniteLegaleNameEntity[]>,
        );

        const fuseSearch = (names: UniteLegaleNameEntity[]) => {
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

            const rnaSirenEntities = await rnaSirenService.find(bestMatch.siren, true); // hotfix calls api asso way too much
            if (!rnaSirenEntities) return [AssociationNameMapper.fromUniteLegaleNameEntity(bestMatch)];

            return rnaSirenEntities?.map(entity => {
                // For one siren its possible to have many rna from match
                return AssociationNameMapper.fromUniteLegaleNameEntity(bestMatch, entity.rna);
            });
        });
        return (await Promise.all(rnaSirenPromises)).flat();
    }

    upsert(entity: UniteLegaleNameEntity) {
        return uniteLegalNameAdapter.upsert(entity);
    }

    upsertMany(entities: UniteLegaleNameEntity[]) {
        return uniteLegalNameAdapter.upsertMany(entities);
    }
}

const uniteLegalNameService = new UniteLegalNameService();

export default uniteLegalNameService;
