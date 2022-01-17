import axios from 'axios';
import { waitPromise } from '../../shared/helpers/WaitHelper';
import RnaInterface from './interfaces/RnaInterface';
import { SiretDataInterface } from './interfaces/SiretDataInterface';

export class EntrepriseApiService {
    private BASE_URL = "https://entreprise.data.gouv.fr";
    private RNA_ROUTE = "api/rna/v1"
    private SIRETTE_ROUTE = "api/sirene/v3/etablissements";
    private LIMITATION_NB_REQUEST_SEC = 7;

    public findSiretDataBySiret(siret: string, wait = false): Promise<SiretDataInterface | null> {
        return this.sendRequest<SiretDataInterface>(`${this.SIRETTE_ROUTE}/${siret}`, wait);
    }

    public findRnaDataBySiret(siret: string, wait = false): Promise<RnaInterface | null> {
        return this.sendRequest<RnaInterface>(`${this.RNA_ROUTE}/siret/${siret}`, wait);
    }

    public findRnaDataByRna(rna: string, wait = false): Promise<RnaInterface | null> {
        return this.sendRequest<RnaInterface>(`${this.RNA_ROUTE}/id/${rna}`, wait);
    }

    private async sendRequest<T>(route: string, wait: boolean): Promise<T | null> {
        if (wait) {
            await waitPromise(1000 / this.LIMITATION_NB_REQUEST_SEC);
        }

        try {
            const res = await axios.get<T>(`${this.BASE_URL}/${route}`);
            return res.data;
        } catch {
            return null;
        }
    }
}

const entrepriseApiService = new EntrepriseApiService();

export default entrepriseApiService;