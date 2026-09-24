import Fuse from "fuse.js";
import associationSearchAdapter from "../../../adapters/outputs/db/association-search/association-search.adapter";
import AssociationSearchEntity from "../../../entities/AssociationSearchEntity";
import rnaSirenService from "../../rna-siren/rna-siren.service";
import Siret from "../../../identifier-objects/Siret";
import Siren from "../../../identifier-objects/Siren";
import { removeAccents } from "../../../shared/helpers/StringHelper";

export class AssociationSearchService {
    //@TODO: make value either a string (name) or a Siren
    async searchBySirenSiretName(value: string, postalCode?: string): Promise<AssociationSearchEntity[]> {
        if (Siret.isStartOfSiret(value)) value = Siren.fromPartialSiretStr(value).value;
        // value is always siren or name
        // if siret it is transformed into siren
        // if rna uniteLegaleName will never return a thing as it search on siren + name
        if (Siren.isSiren(value)) {
            const association = await associationSearchAdapter.findByIdentifier(new Siren(value), postalCode);
            if (association) return [association];
            return [];
        } else {
            // by text
            const associations = await associationSearchAdapter.findByText(value, postalCode);
            const groupedNameByStructures = associations.reduce(
                (acc, entity) => {
                    const sirenStr = entity.siren.value;
                    if (!acc[sirenStr]) acc[sirenStr] = [];
                    acc[sirenStr].push(entity);
                    return acc;
                },
                {} as Record<string, AssociationSearchEntity[]>,
            );

            const fuseSearch = (names: AssociationSearchEntity[]) => {
                const fuse = new Fuse(names, {
                    includeScore: true,
                    findAllMatches: true,
                    keys: ["searchKey"],
                    // simulate the previous and removed searchKey field
                    // this should be replaced with the new search process splitting search by identifier and text
                    getFn: entity => `${entity.siren} - ${removeAccents(entity.name.toLocaleLowerCase())}`,
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
                if (!rnaSirenEntities) return [bestMatch];

                return rnaSirenEntities?.map(entity => {
                    // For one siren its possible to have many rna from match
                    return new AssociationSearchEntity({
                        siren: bestMatch.siren.value,
                        rna: entity.rna.value,
                        mainEstablishmentSiret: bestMatch.mainEstablishmentSiret.value,
                        name: bestMatch.name,
                        address: bestMatch.address ?? undefined,
                        nbEstabs: bestMatch.nbEstabs ?? undefined,
                    });
                });
            });
            return (await Promise.all(rnaSirenPromises)).flat();
        }
    }

    // domain should not know about dbo format but this file should be delete after the full association-search refactor
    upsertMany(entities: AssociationSearchEntity[]) {
        return associationSearchAdapter.upsertMany(
            entities.map(entity => ({
                ...entity,
                siren: entity.siren.value,
                rna: entity.rna.value,
                mainEstablishmentSiret: entity.mainEstablishmentSiret.value,
            })),
        );
    }
}

const associationSearchService = new AssociationSearchService();

export default associationSearchService;
