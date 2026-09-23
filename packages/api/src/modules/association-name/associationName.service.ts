import { NotAssociationError } from "core";
import AssociationSearchService from "../providers/association-search/association-search.service";
import rnaSirenService from "../rna-siren/rna-siren.service";
import Rna from "../../identifier-objects/Rna";
import Siren from "../../identifier-objects/Siren";
import rechercheEntreprisesService from "../../adapters/outputs/api/recherche-entreprises/recherche-entreprises.service";
import AssociationSearchEntity from "../../entities/AssociationSearchEntity";

export class AssociationNameService {
    async find(value: string, postalCode?: string): Promise<Partial<AssociationSearchEntity>[]> {
        let associationNames: Partial<AssociationSearchEntity>[];
        let gotCompany = false;
        const searchEntreprisesCatch = (value: string) => {
            if (postalCode) return Promise.resolve([]);

            return rechercheEntreprisesService.getSearchResult(value).catch(() => {
                gotCompany = true;
                return [];
            });
        };

        if (Rna.isRna(value) || Siren.isSiren(value)) {
            let identifier: Rna | Siren;

            // from here we manipulate identifiers as object
            if (Rna.isRna(value)) {
                identifier = new Rna(value);
            } else {
                identifier = new Siren(value);
            }
            // For one rna it's possible to have many siren from match
            // For one siren it's possible to have many rna from match
            const rnaSirenEntities = (await rnaSirenService.find(identifier)) || [];

            // from here in loops we manipulate each found identifier as string
            const identifiers: string[] = rnaSirenEntities.length
                ? rnaSirenEntities.map(entity => entity[identifier.name].value) // See issue https://github.com/betagouv/api-subventions-asso/issues/2517
                : [value];

            const promiseResults = [
                ...(await Promise.all(
                    identifiers.map(identifierStr =>
                        AssociationSearchService.searchBySirenSiretName(identifierStr, postalCode),
                    ),
                )),
                ...(await Promise.all(identifiers.map(identifierStr => searchEntreprisesCatch(identifierStr)))),
            ];

            associationNames = promiseResults.flat();
        } else {
            // Siret Or Name

            const promiseResults = [
                ...(await AssociationSearchService.searchBySirenSiretName(value.toLowerCase().trim(), postalCode)),
                ...(await searchEntreprisesCatch(value)),
            ];

            associationNames = promiseResults.flat();
        }
        const mergedAssociationName = associationNames.reduce(
            (acc, associationName) => {
                const id = `${associationName.rna?.value} - ${associationName.siren!.value}`;
                const oldValue = acc[id] || {};
                acc[id] = Object.assign(associationName, oldValue);
                return acc;
            },
            {} as Record<string, AssociationSearchEntity>,
        );
        const res = Object.values(mergedAssociationName);
        if (!res.length && gotCompany) throw new NotAssociationError();
        return res;
    }
}

const associationNameService = new AssociationNameService();

export default associationNameService;
