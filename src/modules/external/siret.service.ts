import axios from 'axios';
import { waitPromise } from '../../shared/helpers/WaitHelper';
import { SiretDataInterface } from './interfaces/SiretDataInterface';

export class SiretService {
    private BASE_URL = "https://entreprise.data.gouv.fr/api/sirene/v3/etablissements/";

    public async findBySiret(siret: string, wait = false): Promise<SiretDataInterface | null> {
        // The API have an limit ! 7 request by seconds so we wait 150ms before send request in case of big import
        if (wait) {
            await waitPromise(1000 / 7);
        }

        try {
            const res = await axios.get<SiretDataInterface>(`${this.BASE_URL}/${siret}`);
            return res.data;
        } catch {
            return null;
        }
    }
}

const siretService = new SiretService();

export default siretService;