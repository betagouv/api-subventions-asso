import axios from "axios";
import { isRna, isStartOfSiret } from "../../helpers/validatorHelper";
import { siretToSiren } from "../../helpers/sirenHelper";
import { flatenProviderValue } from "../../helpers/dataHelper";
import InteruptSearchError from "./error/InteruptSearchError";

export class HomeService {

    constructor() {
        this.searchCache = new Map();
    }

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
        if (this.currentSearchPromise && this.currentSearchPromise.text === searchedText) {
            return this.currentSearchPromise.promise;
        } else if (this.currentSearchPromise) {
            this.currentSearchPromise.reject(new InteruptSearchError());
        }

        let promise;
        // eslint-disable-next-line no-async-promise-executor
        promise = new Promise(async (resolve, reject) => {
            this.currentSearchPromise = {
                text: searchedText,
                promise,
                reject,
            }

            const {result, error} = await this._search(searchedText);

            if (!this.currentSearchPromise || this.currentSearchPromise.text != searchedText) return;
            if (!result) reject(error);
            else resolve(result);
            this.currentSearchPromise = null;
        })
        return promise;
    }

    async _search(searchedText) {
        if (this.searchCache.has(searchedText)) return { result: this.searchCache.get(searchedText), error: null };

        let result = null;
        let error = null;

        try {
            result = await this._searchByAssociationKey(searchedText);
        } catch (catchedError) {
            if (isRna(searchedText) || isStartOfSiret(searchedText)) {
                // If no data found in association name collection we search by rna or siren, because association name is not exostive.
                result = [await this._searchByRnaOrSiren(""+searchedText)];
            }
            error = catchedError;
        }

        if (result) {
            this.searchCache.set(searchedText, result);
            result = result.slice(0, 20);
        }

        return { result, error };
    }
}

const homeService = new HomeService();

export default homeService;
