import type AssociationEntity from "./entities/AssociationEntity";
import associationPort from "./association.port";
import { toSearchHistory } from "./association.adapter";
import { isRna, isStartOfSiret } from "$lib/helpers/identifierHelper";
import { siretToSiren } from "$lib/helpers/sirenHelper";
import { flattenProviderValue, getObjectWithMetadata } from "$lib/helpers/providerValueHelper";
import { updateSearchHistory } from "$lib/services/searchHistory.service";
import { toEstablishmentComponent } from "$lib/resources/establishments/establishment.adapter";
import documentService from "$lib/services/documents.service";

class AssociationService {
    incExtractData(identifier) {
        associationPort.incExtractData(identifier);
    }

    async getAssociation(identifier) {
        const result = await associationPort.getByIdentifier(identifier);
        if (!result) return;

        // TODO(#2079): use an adapter
        const association = flattenProviderValue(result) as AssociationEntity;

        updateSearchHistory(toSearchHistory(association));

        return association;
    }

    async getEstablishments(identifier) {
        const result = await associationPort.getEstablishments(identifier);
        const establishments = result.map(etablissement => toEstablishmentComponent(etablissement));
        return establishments;
    }

    async getDocuments(identifier) {
        const result = await associationPort.getDocuments(identifier);
        const documents = result.map(document => getObjectWithMetadata(document));
        return documentService.formatAndSortDocuments(documents);
    }

    async search(lookup) {
        const results = await this._searchByText(lookup);
        if (results?.length) return results;

        // If no data found in association name collection we search by rna or siren, because association name is not exhaustive.
        if (isRna(lookup) || isStartOfSiret(lookup)) {
            return await this._searchByIdentifier(lookup.toString());
        }

        return [];
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

    _searchByText(lookup: string) {
        return associationPort.search(lookup);
    }
}

const associationService = new AssociationService();

export default associationService;
