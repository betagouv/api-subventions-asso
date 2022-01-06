import axios from 'axios';

export default class SiretProvider {
    private static BASE_URL = "https://entreprise.data.gouv.fr/api/sirene/v3/etablissements/";


    public static async findBySiret(siret: string) {
        try {
            const res = await axios.get(`${SiretProvider.BASE_URL}/${siret}`);
            return res.data
        } catch {
            return {};
        }
    }
}