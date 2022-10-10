import axios from "axios";
import { isRna, isStartOfSiret } from "../../helpers/validatorHelper";
import { siretToSiren } from "../../helpers/sirenHelper";
import { flatenProviderValue } from "../../helpers/dataHelper";

export class HomeService {
    async getAssoData(id) {
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

    async search(searchedText) {
        const path = `/search/associations/${searchedText}`;
        return axios
            .get(path)
            .then(result => {
                if (!result.data.success) throw new Error(result.data.message);
                return result.data.result;
            })
            .catch(async e => {
                if (isRna(searchedText) || isStartOfSiret(searchedText)) {
                    return [await this.getAssoData(searchedText)];
                }
                throw e;
            });
    }
}

const homeService = new HomeService();

export default homeService;
