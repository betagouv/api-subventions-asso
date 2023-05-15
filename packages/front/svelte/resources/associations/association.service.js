import associationPort from "./association.port";
import { isRna, isStartOfSiret } from "@helpers/validatorHelper";
import { siretToSiren } from "@helpers/sirenHelper";
import { flatenProviderValue } from "@helpers/providerValueHelper";

class AssociationService {
    incExtractData(identifier) {
        associationPort.incExtractData(identifier);
    }

    async getAssociation(identifier) {
        const association = await associationPort.getByRnaOrSiren(identifier);
        if (!association) return;
        return flatenProviderValue(association);
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

    async search(lookup) {
        let results = await this._searchByText(lookup);
        if (results?.length) return results;

        // If no data found in association name collection we search by rna or siren, because association name is not exhaustive.
        if (isRna(lookup) || isStartOfSiret(lookup)) {
            return await this._searchByIdentifier(lookup.toString());
        }

        return [];
    }
}

const associationService = new AssociationService();

export default associationService;
