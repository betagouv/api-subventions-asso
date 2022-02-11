import axios from "axios";
import { Rna } from "../../../@types/Rna";
import { Siren } from "../../../@types/Siren";
import { Siret } from "../../../@types/Siret";
import { waitPromise } from "../../../shared/helpers/WaitHelper";
import Association from "../../associations/interfaces/Association";
import AssociationsProvider from "../../associations/interfaces/AssociationsProvider";
import Etablissement from "../../etablissements/interfaces/Etablissement";
import EtablissementProvider from "../../etablissements/interfaces/EtablissementProvider";
import EntrepriseDtoAdapter from "./adapters/EntrepriseDtoAdapter";
import EtablissementDtoAdapter from "./adapters/EtablisementDtoAdapter";
import EntrepriseDto from "./interfaces/EntrepriseDto";
import EtablisementDto from "./interfaces/EtablissementDto";

export class DataEntrepriseService implements AssociationsProvider, EtablissementProvider {
    private BASE_URL = "https://entreprise.data.gouv.fr";
    private RNA_ROUTE = "api/rna/v1"
    private SIRETTE_ROUTE = "api/sirene/v3/etablissements";
    private SIRENE_ROUTE = "api/sirene/v3/unites_legales";
    private LIMITATION_NB_REQUEST_SEC = 7;

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

    public async findEtablissementBySiret(siret: Siret, wait = false): Promise<Etablissement | null> {
        const data = await this.sendRequest<EtablisementDto>(`${this.SIRETTE_ROUTE}/${siret}`, wait);

        if (!data) return null;
        return EtablissementDtoAdapter.toEtablissement(data);
    }

    public async findAssociationBySiren(siren: Siren, wait = false) {
        const data = await this.sendRequest<EntrepriseDto>(`${this.SIRENE_ROUTE}/${siren}`, wait);

        if (!data) return null;

        return EntrepriseDtoAdapter.toAssociation(data);
    }

    /**
     * |-------------------------|
     * |    Associations Part    |
     * |-------------------------|
     */
    
    isAssociationsProvider = true;

    async getAssociationsBySiren(siren: Siren): Promise<Association | null> {
        return this.findAssociationBySiren(siren);
    }


    /**
     * |-------------------------|
     * |   Etablisesement Part   |
     * |-------------------------|
     */
    
    isEtablissementProvider = true;

    async getEtablissementsBySiret(siret: Siret): Promise<Etablissement[] | null> {
        const result = await this.findEtablissementBySiret(siret);

        if (!result) return null

        return [result];
    }

}

const dataEntrepriseService = new DataEntrepriseService();

export default dataEntrepriseService;