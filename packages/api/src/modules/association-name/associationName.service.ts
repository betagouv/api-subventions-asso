import { Siren } from "dto";
import Fuse from "fuse.js";
import uniteLegalNameService from "../providers/uniteLegalName/uniteLegal.name.service";
import UniteLegalNameEntity from "../../entities/UniteLegalNameEntity";
import { AssociationIdentifiers } from "../../@types";
import rnaSirenService from "../rna-siren/rnaSiren.service";
import { isRna } from "../../shared/Validators";
import AssociationNameEntity from "./entities/AssociationNameEntity";
import AssociationNameAdapter from "./adapters/AssociationNameAdapter";

export class AssociationNameService {
    async getNameFromIdentifier(identifier: AssociationIdentifiers): Promise<string | undefined> {
        const result = await uniteLegalNameService.getNameFromIdentifier(identifier);

        if (!result) return;

        return result.name;
    }

    async find(value: AssociationIdentifiers | string): Promise<AssociationNameEntity[]> {
        const lowerCaseValue = value.toLowerCase().trim();
        let uniteLegalNameEntities: UniteLegalNameEntity[];
        if (isRna(value)) {
            // For one rna its possible to have many siren from match
            const rnaSirenEntities = (await rnaSirenService.find(value)) || [];
            const sirens = rnaSirenEntities.map(entity => entity.siren);
            uniteLegalNameEntities = (
                await Promise.all(sirens.map(siren => uniteLegalNameService.searchBySirenSiretName(siren)))
            ).flat();
        } else {
            uniteLegalNameEntities = await uniteLegalNameService.searchBySirenSiretName(lowerCaseValue);
        }

        const groupedNameByStructures = uniteLegalNameEntities.reduce((acc, entity) => {
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
            return fuse.search(lowerCaseValue).sort((a, b) => (a.score || 1) - (b.score || 1));
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
        const listEntities = await Promise.all(rnaSirenPromises);
        return listEntities.flat();
    }
}

const associationNameService = new AssociationNameService();

export default associationNameService;
