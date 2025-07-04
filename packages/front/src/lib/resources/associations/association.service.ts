import type { AssociationIdentifierDto, PaginatedAssociationNameDto } from "dto";
import type AssociationEntity from "./entities/AssociationEntity";
import associationPort from "./association.port";
import { toSearchHistory } from "./association.adapter";
import { isRna, isStartOfSiret, siretToSiren } from "$lib/helpers/identifierHelper";
import { flattenProviderValue, getObjectWithMetadata } from "$lib/helpers/providerValueHelper";
import { updateSearchHistory } from "$lib/services/searchHistory.service";
import { toEstablishmentComponent } from "$lib/resources/establishments/establishment.adapter";
import documentHelper from "$lib/helpers/document.helper";
import { isAssociation } from "$lib/resources/associations/association.helper";

class AssociationService {
    incExtractData(identifier) {
        associationPort.incExtractData(identifier);
    }

    async getAssociation(identifier) {
        const result = await associationPort.getByIdentifier(identifier);
        if (!result) return;

        // TODO(#2079): use an adapter
        const association = flattenProviderValue(result) as AssociationEntity;
        if (isAssociation(association)) updateSearchHistory(toSearchHistory(association));

        return association;
    }

    async getEstablishments(identifier) {
        const result = await associationPort.getEstablishments(identifier);
        return result.map(etablissement => toEstablishmentComponent(etablissement));
    }

    async getDocuments(identifier) {
        const result = await associationPort.getDocuments(identifier);
        const documents = result.map(document => getObjectWithMetadata(document));
        return documentHelper.formatAndSortDocuments(documents);
    }

    getGrantExtract(identifier: AssociationIdentifierDto) {
        return associationPort.getGrantExtract(identifier);
    }

    async search(lookup, page = 1): Promise<PaginatedAssociationNameDto> {
        const results = await this._searchByText(lookup, page);
        if (results?.total) return results;

        // If no data found in association name collection we search by rna or siren, because association name is not exhaustive.
        if (isRna(lookup) || isStartOfSiret(lookup)) {
            const potentielDuplicates = await this._searchByIdentifier(lookup.toString());
            // we make up pagination because it is unlikely to have multiple pages of duplicates
            return { nbPages: 1, page: 1, results: potentielDuplicates, total: potentielDuplicates.length };
        }

        return { nbPages: 1, page: 1, results: [], total: 0 };
    }

    async _searchByIdentifier(identifier) {
        if (isStartOfSiret(identifier)) identifier = siretToSiren(identifier);

        let fullResult;
        try {
            fullResult = await this.getAssociation(identifier);
        } catch (e) {
            // @ts-expect-error: httpCode
            if (e?.httpCode === 404) return [];
            throw e;
        }

        return [
            {
                rna: fullResult.rna,
                siren: fullResult.siren,
                name: fullResult.denomination_rna || fullResult.denomination_siren,
            },
        ];
    }

    _searchByText(lookup: string, page = 1) {
        return associationPort.search(lookup, page);
    }
}

const associationService = new AssociationService();

export default associationService;
