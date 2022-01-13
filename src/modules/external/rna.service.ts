import axios from 'axios';
import { waitPromise } from '../../shared/helpers/WaitHelper';
import RnaInterface from './interfaces/RnaInterface';

export class RnaService {
    private BASE_URL = "https://entreprise.data.gouv.fr/api/rna/v1";

    public async findByRna(rna: string, wait = false) {
        // The API have an limit ! 7 request by seconds so we wait 150ms before send request in case of big import
        if (wait) {
            await waitPromise(1000 / 7); // TODO USE CONST
        }

        try {
            const res = await axios.get<RnaInterface>(`${this.BASE_URL}/id/${rna}`);
            return res.data
        } catch (e) {
            return null;
        }
    }

    public async findBySiret(siret: string, wait = false) {
        // The API have an limit ! 7 request by seconds so we wait 150ms before send request in case of big import
        if (wait) {
            await waitPromise(1000 / 7);
        }
        
        try {
            const res = await axios.get<RnaInterface>(`${this.BASE_URL}/siret/${siret}`);
            return res.data
        } catch {
            return null;
        }
    }
}

const rnaService = new RnaService();

export default rnaService;