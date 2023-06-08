import associationPort from "./association.port";
import { isRna, isStartOfSiret } from "@helpers/validatorHelper";
import { siretToSiren } from "@helpers/sirenHelper";
import { flattenProviderValue, getObjectWithMetadata } from "@helpers/providerValueHelper";
import { updateSearchHistory } from "@services/storage.service";
import { toEstablishmentComponent } from "@resources/establishments/establishment.adapter";
import documentService from "@resources/documents/documents.service";

class AssociationService {
    incExtractData(identifier) {
        associationPort.incExtractData(identifier);
    }

    async getAssociation(identifier) {
        const result = await associationPort.getByIdentifier(identifier);
        if (!result) return;
        const association = flattenProviderValue(result);
        updateSearchHistory({
            rna: association.rna,
            siren: association.siren,
            name: association.denomination_rna || association.denomination_siren,
            objectSocial: association.objet_social || "",
        });
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
        let results = await this._searchByText(lookup);
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

    _searchByText(lookup) {
        return associationPort.search(lookup);
    }
}

const associationService = new AssociationService();

export default associationService;
