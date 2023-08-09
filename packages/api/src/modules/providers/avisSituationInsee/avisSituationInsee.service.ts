import axios from "axios";
import { Siren, Siret, Rna } from "@api-subventions-asso/dto";

import { Document } from "@api-subventions-asso/dto/search/Document";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import DocumentProvider from "../../documents/@types/DocumentsProvider";
import ProviderValueAdapter from "../../../shared/adapters/ProviderValueAdapter";
import rnaSirenService from "../../_open-data/rna-siren/rnaSiren.service";
import CacheData from "../../../shared/Cache";
import { CACHE_TIMES } from "../../../shared/helpers/TimeHelper";
import { siretToNIC, siretToSiren } from "../../../shared/helpers/SirenHelper";

export class AvisSituationInseeService implements DocumentProvider {
    provider = {
        name: "Avis de Situation Insee",
        type: ProviderEnum.api,
        description:
            "Ce service permet d'obtenir, pour chaque entreprise et établissement, association ou organisme public inscrit au répertoire Sirene, une « fiche d'identité » comportant les informations mises à jour dans le répertoire SIRENE la veille de la consultation.",
    };

    static API_URL = "https://api-avis-situation-sirene.insee.fr/identification";

    private requestCache = new CacheData<
        | {
              etablissements: {
                  nic: string;
                  etablissementSiege: boolean;
              }[];
          }
        | false
    >(CACHE_TIMES.ONE_DAY);

    private async getInseeEtablissementsBySiren(siren: Siren): Promise<
        | {
              etablissements: {
                  nic: string;
                  etablissementSiege: boolean;
              }[];
          }
        | false
    > {
        if (this.requestCache.has(siren)) return this.requestCache.get(siren)[0];

        try {
            const result = await axios.get<{
                etablissements: {
                    nic: string;
                    etablissementSiege: boolean;
                }[];
            }>(`${AvisSituationInseeService.API_URL}/siren/${siren}`);

            if (result.status == 200) {
                this.requestCache.add(siren, result.data);
                return result.data;
            }
            this.requestCache.add(siren, false);
            return false;
        } catch (e) {
            return false;
        }
    }

    isDocumentProvider = true;

    async getDocumentsBySiren(siren: Siren): Promise<Document[] | null> {
        const data = await this.getInseeEtablissementsBySiren(siren);

        if (!data) return null;

        const nic = data.etablissements.find(e => e.etablissementSiege)?.nic;

        if (!nic) return null;

        return [
            {
                type: ProviderValueAdapter.toProviderValue("Avis Situation Insee", this.provider.name, new Date()),
                url: ProviderValueAdapter.toProviderValue(
                    `${AvisSituationInseeService.API_URL}/pdf/${siren}${nic}`,
                    this.provider.name,
                    new Date(),
                ),
                nom: ProviderValueAdapter.toProviderValue(
                    `Avis Situation Insee (${siren}${nic})`,
                    this.provider.name,
                    new Date(),
                ),
                __meta__: {
                    siret: siren + nic,
                },
            },
        ];
    }
    async getDocumentsBySiret(siret: Siret): Promise<Document[] | null> {
        const data = await this.getInseeEtablissementsBySiren(siretToSiren(siret));
        const codeNic = siretToNIC(siret);

        if (!data || !data.etablissements.find(e => e.nic === codeNic)) return null;

        return [
            {
                type: ProviderValueAdapter.toProviderValue("Avis Situation Insee", this.provider.name, new Date()),
                url: ProviderValueAdapter.toProviderValue(
                    `${AvisSituationInseeService.API_URL}/pdf/${siret}`,
                    this.provider.name,
                    new Date(),
                ),
                nom: ProviderValueAdapter.toProviderValue(
                    `Avis Situation Insee (${siret})`,
                    this.provider.name,
                    new Date(),
                ),
                __meta__: {
                    siret,
                },
            },
        ];
    }

    async getDocumentsByRna(rna: Rna): Promise<Document[] | null> {
        const siren = await rnaSirenService.getSiren(rna);

        if (!siren) return null;

        return this.getDocumentsBySiren(siren);
    }
}

const avisSituationInseeService = new AvisSituationInseeService();

export default avisSituationInseeService;
