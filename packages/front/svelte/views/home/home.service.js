import axios from "axios";
import { isRna, isStartOfSiret } from "../../helpers/validatorHelper";
import { siretToSiren } from "../../helpers/sirenHelper";
import { flatenProviderValue } from "../../helpers/dataHelper";

export class HomeService {
    async _searchByRnaOrSiren(id) {
        if (isStartOfSiret(id)) id = siretToSiren(id);

        const path = `/association/${id}`;
        return axios.get(path).then(result => {
            const asso = flatenProviderValue(result.data.association);
            return {
                rna: asso.rna,
                siren: asso.siren,
                name: asso.denomination_rna || asso.denomination_siren
            };
        });
    }

    async _searchByAssociationKey(associationKey) {
        const path = `/search/associations/${associationKey}`;
        return axios.get(path).then(result => {
            if (!result.data.success) throw new Error(result.data.message);
            return result.data.result;
        });
    }

    async search(searchedText) {
        try {
            return await this._searchByAssociationKey(searchedText);
        } catch (error) {
            if (isRna(searchedText) || isStartOfSiret(searchedText)) {
                // If no data found in association name collection we search by rna or siren, because association name is not exostive.
                return [await this._searchByRnaOrSiren(searchedText)];
            }
            throw error;
        }
    }
}

const homeService = new HomeService();

export default homeService;
