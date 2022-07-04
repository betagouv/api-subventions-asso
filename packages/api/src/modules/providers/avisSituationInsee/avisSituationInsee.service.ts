import axios from "axios";
import { Siren, Siret, Rna } from "@api-subventions-asso/dto";

import * as IdentifierHelper from '../../../shared/helpers/IdentifierHelper';
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import { StructureIdentifiers } from "../../../@types";
import Document from "../../documents/@types/Document";
import DocumentProvider from "../../documents/@types/DocumentsProvider";
import ProviderValueAdapter from "../../../shared/adapters/ProviderValueAdapter";
import rnaSirenService from "../../open-data/rna-siren/rnaSiren.service";
import CacheData from "../../../shared/Cache";
import { CACHE_TIMES } from "../../../shared/helpers/TimeHelper";

export class AvisSituationInseeService implements DocumentProvider {
    provider = {
        name: "Avis de Situation Insee",
        type: ProviderEnum.api,
        description: "Ce service permet d'obtenir, pour chaque entreprise et établissement, association ou organisme public inscrit au répertoire Sirene, une « fiche d'identité » comportant les informations mises à jour dans le répertoire SIRENE la veille de la consultation."
    }

    static API_URL = "https://api.avis-situation-sirene.insee.fr/identification"

    private requestCache = new CacheData<{
        etablissements: {
            nic: string,
            etablissementSiege: boolean
        }[]
    } | false>(CACHE_TIMES.ONE_DAY);


    private async getInseeEtablissements(identifier: StructureIdentifiers) : Promise<{
        etablissements: {
            nic: string,
            etablissementSiege: boolean
        }[]
    } | false> {
        const type = IdentifierHelper.getIdentifierType(identifier)?.toLocaleLowerCase();

        if (!type) return false;

        if (this.requestCache.has(identifier)) return this.requestCache.get(identifier)[0];

        try {
            const result = await axios.get<{
                etablissements: {
                    nic: string,
                    etablissementSiege: boolean
                }[]
            }>(`${AvisSituationInseeService.API_URL}/${type}/${identifier}`);

            if (result.status == 200) {
                this.requestCache.add(identifier, result.data);
                return result.data;
            }
            this.requestCache.add(identifier, false);
            return false;
        } catch {
            return false;
        }
    }

    isDocumentProvider = true;

    async getDocumentsBySiren(siren: Siren): Promise<Document[] | null> {
        const data = await this.getInseeEtablissements(siren);

        if (!data) return null;

        const nic = data.etablissements.find((e) => e.etablissementSiege)?.nic;

        if (!nic) return null;

        return [
            {
                type: ProviderValueAdapter.toProviderValue('Avis Situation Insee', this.provider.name, new Date()),
                url: ProviderValueAdapter.toProviderValue(`${AvisSituationInseeService.API_URL}/pdf/${siren}${nic}`, this.provider.name, new Date()),
                nom: ProviderValueAdapter.toProviderValue(`Avis Situation Insee (${siren}${nic})`, this.provider.name, new Date()),
                __meta__: {
                    siret: siren+nic
                }
            }
        ]

    }
    async getDocumentsBySiret(siret: Siret): Promise<Document[] | null> {
        const data = await this.getInseeEtablissements(siret);

        if (!data) return null;
        return [
            {
                type: ProviderValueAdapter.toProviderValue('Avis Situation Insee', this.provider.name, new Date()),
                url: ProviderValueAdapter.toProviderValue(`${AvisSituationInseeService.API_URL}/pdf/${siret}`, this.provider.name, new Date()),
                nom: ProviderValueAdapter.toProviderValue(`Avis Situation Insee (${siret})`, this.provider.name, new Date()),
                __meta__: {
                    siret
                }
            }
        ]
    }
    
    async getDocumentsByRna(rna: Rna): Promise<Document[] | null> {
        const siren = await rnaSirenService.getSiren(rna);
        
        if (!siren) return null;

        return this.getDocumentsBySiren(siren);
    }
}

const avisSituationInseeService = new AvisSituationInseeService();

export default avisSituationInseeService;