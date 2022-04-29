import { ProviderValues, Rna, Siren, Siret } from "api-subventions-asso-dto";
import axios from "axios";
import { AssociationIdentifiers } from "../../../@types";
import { API_ASSO_URL } from "../../../configurations/apis.conf";
import CacheData from "../../../shared/Cache";
import EventManager from "../../../shared/EventManager";
import { siretToSiren } from "../../../shared/helpers/SirenHelper";
import { CACHE_TIMES } from "../../../shared/helpers/TimeHelper";
import Association from "../../associations/@types/Association";
import AssociationsProvider from "../../associations/@types/AssociationsProvider";
import Etablissement from "../../etablissements/@types/Etablissement";
import EtablissementProvider from "../../etablissements/@types/EtablissementProvider";
import ApiAssoDtoAdapter from "./adapters/ApiAssoDtoAdapter";
import StructureDto from "./dto/StructureDto";



export class ApiAssoService implements AssociationsProvider, EtablissementProvider {
    public providerName = "API ASSO";
    private dataSirenCache = new CacheData<{ associations: Association[], etablissements: Etablissement[]}>(CACHE_TIMES.ONE_DAY);
    private dataRnaCache = new CacheData<{ associations: Association[], etablissements: Etablissement[]}>(CACHE_TIMES.ONE_DAY);
    private requestCache = new CacheData<unknown>(CACHE_TIMES.ONE_DAY);

    private async sendRequest<T>(route: string): Promise<T | null> {
        if (this.requestCache.has(route)) return this.requestCache.get(route)[0] as T;

        try {
            const res = await axios.get<T>(`${API_ASSO_URL}/${route}`, {
                headers: {
                    'Accept': "application/json"
                }
            });

            if (res.status === 200) {
                this.requestCache.add(route, res.data);
                return res.data;
            }
            return null;
        } catch {
            return null;
        }
    }

    private async getAssociationsAndEtablissements(identifier: AssociationIdentifiers): Promise<{associations: Association[], etablissements: Etablissement[]} | null> {
        if (this.dataSirenCache.has(identifier)) return this.dataSirenCache.get(identifier)[0];
        if (this.dataRnaCache.has(identifier)) return this.dataRnaCache.get(identifier)[0];

        let etablissements: Etablissement[] = [];

        const structure = await this.sendRequest<StructureDto>(`/structure/${identifier}`);
        if (!structure) return null;

        
        if (structure.etablissement) {
            etablissements = structure.etablissement.map(e => ApiAssoDtoAdapter.toEtablissement(e, structure.rib, structure.representant_legal, structure.identite.date_modif_siren));
        }
        
        const result =  {
            associations: ApiAssoDtoAdapter.toAssociation(structure),
            etablissements
        };
        
        if (structure.identite.id_rna && structure.identite.id_siren) {
            EventManager.call('rna-siren.matching', [{ rna: structure.identite.id_rna, siren: structure.identite.id_siren}])
            result.associations.forEach(association => {
                EventManager.call('association-name.matching', [{
                    rna: structure.identite.id_rna,
                    siren: structure.identite.id_siren,
                    name: association.denomination[0].value,
                    provider: association.denomination[0].provider,
                    lastUpdate: (association.date_modification as ProviderValues<Date>)[0].value
                }]);
            })
        }

        if (structure.identite.id_siren) this.dataSirenCache.add(structure.identite.id_siren, result);
        if (structure.identite.id_rna) this.dataRnaCache.add(structure.identite.id_rna, result);

        return result;
    }

    /**
     * |-------------------------|
     * |    Associations Part    |
     * |-------------------------|
     */

    isAssociationsProvider = true

    async getAssociationsBySiren(siren: Siren): Promise<Association[] | null> {
        const result = await this.getAssociationsAndEtablissements(siren);

        if (!result) return null;

        return result.associations;
    }

    async getAssociationsBySiret(siret: Siret): Promise<Association[] | null> {
        return this.getAssociationsBySiren(siretToSiren(siret));
    }
    
    async getAssociationsByRna(rna: Rna): Promise<Association[] | null> {
        const result = await this.getAssociationsAndEtablissements(rna);

        if (!result) return null;

        return result.associations;
    }

    /**
     * |-------------------------|
     * |   Etablissement Part    |
     * |-------------------------|
     */
    
    isEtablissementProvider = true;

    async getEtablissementsBySiret(siret: Siret): Promise<Etablissement[] | null> {
        const siren = siretToSiren(siret);
    
        const result = await this.getEtablissementsBySiren(siren);

        if (!result) return null;

        return result.filter(e => e.siret[0].value === siret);
    }

    async getEtablissementsBySiren(siren: Siren): Promise<Etablissement[] | null> {
        const result = await this.getAssociationsAndEtablissements(siren);

        if (!result) return null;

        return result.etablissements;
    }
}

const apiAssoService = new ApiAssoService();

export default apiAssoService;