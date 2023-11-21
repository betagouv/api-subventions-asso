import { Siren } from "dto";
import Fuse from "fuse.js";
import uniteLegalNamesService from "../providers/uniteLegalNames/uniteLegalNames.service";
import UniteLegalNameEntity from "../../entities/UniteLegalNameEntity";
import { AssociationIdentifiers } from "../../@types";
import rnaSirenService from "../rna-siren/rnaSiren.service";
import { isRna } from "../../shared/Validators";
import AssociationNameEntity from "./entities/AssociationNameEntity";
import AssociationNameAdapter from "./adapters/AssociationNameAdapter";

export class AssociationNameService {
    async getNameFromIdentifier(identifier: AssociationIdentifiers): Promise<string | undefined> {
        const result = await uniteLegalNamesService.getNameFromIdentifier(identifier);

        if (!result) return;

        return result.name;
    }

    async getAllByValye(value: string): Promise<AssociationNameEntity[]> {
        const lowerCaseValue = value.toLowerCase().trim();
        let uniteLegalNameEntities: UniteLegalNameEntity[];
        if (isRna(value)) {
            // For one rna its possible to have many siren from match
            const rnaSirenEntities = (await rnaSirenService.find(value)) || [];
            const sirens = rnaSirenEntities.map(entity => entity.siren);
            uniteLegalNameEntities = (
                await Promise.all(sirens.map(siren => uniteLegalNamesService.findBy(siren)))
            ).flat();
        } else {
            uniteLegalNameEntities = await uniteLegalNamesService.findBy(lowerCaseValue);
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
                keys: ["searchingKey"],
            });
            return fuse.search(lowerCaseValue).sort((a, b) => (a.score || 1) - (b.score || 1));
        };

        const promises = Object.values(groupedNameByStructures).map(async namesBySiren => {
            let bestMatch = namesBySiren[0];
            if (namesBySiren.length > 1) {
                const scoredMatchNamesBySiren = fuseSearch(namesBySiren);
                if (scoredMatchNamesBySiren.length) bestMatch = scoredMatchNamesBySiren[0].item;
            }

            const rnaSirenEntities = await rnaSirenService.find(bestMatch.siren);

            if (!rnaSirenEntities) return [AssociationNameAdapter.toAssociationNameEntity(bestMatch)];

            return rnaSirenEntities?.map(entity => {
                // For one siren its possible to have many rna from match
                return AssociationNameAdapter.toAssociationNameEntity(bestMatch, entity.rna);
            });
        });
        const listEnitities = await Promise.all(promises);
        return listEnitities.flat();
    }
}

const associationNameService = new AssociationNameService();

export default associationNameService;
