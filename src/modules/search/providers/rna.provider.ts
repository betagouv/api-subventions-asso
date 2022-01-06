import axios from 'axios';

export default class RnaProvider {
    private static BASE_URL = "https://entreprise.data.gouv.fr/api/rna/v1";

    public static async findByRna(rna: string) {
        try {
            const res = await axios.get(`${RnaProvider.BASE_URL}/id/${rna}`);
            return res.data
        } catch {
            return {};
        }
    }

    public static async findBySiret(siret: string) {
        try {
            const res = await axios.get(`${RnaProvider.BASE_URL}/siret/${siret}`);
            return res.data
        } catch {
            return {};
        }
    }
}