import axios from 'axios';
import { Rna } from '../../@types/Rna';
import { Siret } from '../../@types/Siret';
import { waitPromise } from '../../shared/helpers/WaitHelper';
import AssociationSirenInfertace from './@types/AssociationSirenInfertace';
import RnaInterface from './@types/RnaInterface';
import { SiretDataInterface } from './@types/SiretDataInterface';

export class EntrepriseApiService {
    private BASE_URL = "https://entreprise.data.gouv.fr";
    private RNA_ROUTE = "api/rna/v1"
    private SIRETTE_ROUTE = "api/sirene/v3/etablissements";
    private SIRENE_ROUTE = "api/sirene/v3/unites_legales";
    private LIMITATION_NB_REQUEST_SEC = 7;

    public findSiretDataBySiret(siret: Siret, wait = false): Promise<SiretDataInterface | null> {
        return this.sendRequest<SiretDataInterface>(`${this.SIRETTE_ROUTE}/${siret}`, wait);
    }

    public findRnaDataBySiret(siret: Siret, wait = false): Promise<RnaInterface | null> {
        return this.sendRequest<RnaInterface>(`${this.RNA_ROUTE}/siret/${siret}`, wait);
    }

    public findRnaDataByRna(rna: Rna, wait = false): Promise<RnaInterface | null> {
        return this.sendRequest<RnaInterface>(`${this.RNA_ROUTE}/id/${rna}`, wait);
    }

    public findAssociationBySiren(siren: string, wait = false) {
        return this.sendRequest<{unite_legale: AssociationSirenInfertace}>(`${this.SIRENE_ROUTE}/${siren}`, wait);
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