import axios from 'axios';
import { SiretDataInterface } from './interfaces/SiretDataInterface';

export class SiretService {
    private BASE_URL = "https://entreprise.data.gouv.fr/api/sirene/v3/etablissements/";


    public async findBySiret(siret: string): Promise<SiretDataInterface | null> {
        try {
            const res = await axios.get<SiretDataInterface>(`${this.BASE_URL}/${siret}`);
            return res.data
        } catch {
            return null;
        }
    }
}

const siretService = new SiretService();

export default siretService;