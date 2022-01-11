import axios from 'axios';
import RnaInterface from './interfaces/RnaInterface';

export class RnaService {
    private BASE_URL = "https://entreprise.data.gouv.fr/api/rna/v1";

    public async findByRna(rna: string) {
        try {
            const res = await axios.get<RnaInterface>(`${this.BASE_URL}/id/${rna}`);
            return res.data
        } catch (e) {
            return null;
        }
    }

    public async findBySiret(siret: string) {
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