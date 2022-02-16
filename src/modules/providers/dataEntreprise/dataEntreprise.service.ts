import axios from "axios";
import { Rna } from "../../../@types/Rna";
import { Siren } from "../../../@types/Siren";
import { Siret } from "../../../@types/Siret";
import { waitPromise } from "../../../shared/helpers/WaitHelper";
import Association from "../../associations/interfaces/Association";
import AssociationsProvider from "../../associations/interfaces/AssociationsProvider";
import Etablissement from "../../etablissements/interfaces/Etablissement";
import EtablissementProvider from "../../etablissements/interfaces/EtablissementProvider";
import AssociationDtoAdapter from "./adapters/AssociationDtoAdapter";
import EntrepriseDtoAdapter from "./adapters/EntrepriseDtoAdapter";
import EtablissementDtoAdapter from "./adapters/EtablisementDtoAdapter";
import AssociationDto from "./dto/AssociationDto";
import EntrepriseDto from "./dto/EntrepriseDto";
import EtablisementDto from "./dto/EtablissementDto";

export class DataEntrepriseService implements AssociationsProvider, EtablissementProvider {
    private BASE_URL = "https://entreprise.data.gouv.fr";
    private RNA_ROUTE = "api/rna/v1/id"
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
        const data = await this.sendRequest<{etablissement: EtablisementDto}>(`${this.SIRETTE_ROUTE}/${siret}`, wait);
        
        if (!data) return null;

        return EtablissementDtoAdapter.toEtablissement(data.etablissement);
    }

    public async findAssociationBySiren(siren: Siren, wait = false) {
        const data = await this.sendRequest<EntrepriseDto>(`${this.SIRENE_ROUTE}/${siren}`, wait);

        if (!data) return null;

        return EntrepriseDtoAdapter.toAssociation(data);
    }

    public async findAssociationByRna(rna: Rna, wait = false) {
        const data = await this.sendRequest<AssociationDto>(`${this.RNA_ROUTE}/${rna}`, wait);

        if (!data) return null;

        return AssociationDtoAdapter.toAssociation(data);
    }

    /**
     * |-------------------------|
     * |    Associations Part    |
     * |-------------------------|
     */
    
    isAssociationsProvider = true;

    async getAssociationsBySiren(siren: Siren, rna?: Rna): Promise<Association[] | null> {
        const assos = []
        const asso = await this.findAssociationBySiren(siren);

        if (asso) assos.push(asso);
        if (!rna && asso && asso.rna && asso.rna.length && asso.rna[0].value) {
            rna = asso.rna[0].value;
        }
        
        if (rna) {
            const data = await this.findAssociationByRna(rna);
            if (data) assos.push(data);
        }

        return assos.length 
            ? assos
            : null;
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