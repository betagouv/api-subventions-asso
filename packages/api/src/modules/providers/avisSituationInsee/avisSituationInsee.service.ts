import { Siren, Siret, Rna, Document } from "dto";

import { ProviderEnum } from "../../../@enums/ProviderEnum";
import DocumentProvider from "../../documents/@types/DocumentsProvider";
import ProviderValueAdapter from "../../../shared/adapters/ProviderValueAdapter";
import CacheData from "../../../shared/Cache";
import { CACHE_TIMES } from "../../../shared/helpers/TimeHelper";
import { siretToNIC, siretToSiren } from "../../../shared/helpers/SirenHelper";
import ProviderCore from "../ProviderCore";
import rnaSirenService from "../../rna-siren/rnaSiren.service";

interface AvisSituationCache {
    etablissements: {
        nic: string;
        etablissementSiege: boolean;
    }[];
}

export class AvisSituationInseeService extends ProviderCore implements DocumentProvider {
    static API_URL = "https://api-avis-situation-sirene.insee.fr/identification";

    private requestCache = new CacheData<AvisSituationCache | false>(CACHE_TIMES.ONE_DAY);

    constructor() {
        super({
            name: "Avis de Situation Insee",
            type: ProviderEnum.api,
            id: "avis_situation_api",
            description:
                "Ce service permet d'obtenir, pour chaque entreprise et établissement, association ou organisme public inscrit au répertoire Sirene, une « fiche d'identité » comportant les informations mises à jour dans le répertoire SIRENE la veille de la consultation.",
        });
    }

    private async getInseeEtablissementsBySiren(siren: Siren): Promise<AvisSituationCache | false> {
        if (this.requestCache.has(siren)) return this.requestCache.get(siren)[0];

        try {
            const result = await this.http.get<{
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
                    `/document/avis_situation_api/?url=${encodeURIComponent(
                        `${AvisSituationInseeService.API_URL}/pdf/${siren}${nic}`,
                    )}`,
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
        return [
            {
                type: ProviderValueAdapter.toProviderValue("Avis Situation Insee", this.provider.name, new Date()),
                url: ProviderValueAdapter.toProviderValue(
                    `/document/avis_situation_api/?url=${encodeURIComponent(
                        `${AvisSituationInseeService.API_URL}/pdf/${siret}`,
                    )}`,
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
        const rnaSirenEntities = await rnaSirenService.find(rna);

        if (!rnaSirenEntities || !rnaSirenEntities.length) return null;

        return this.getDocumentsBySiren(rnaSirenEntities[0].siren);
    }
}

const avisSituationInseeService = new AvisSituationInseeService();

export default avisSituationInseeService;
