import { DocumentDto } from "dto";

import { ProviderEnum } from "../../../@enums/ProviderEnum";
import DocumentProvider from "../../documents/@types/DocumentsProvider";
import ProviderValueMapper from "../../../shared/mappers/provider-value.mapper";
import CacheData from "../../../shared/Cache";
import { CACHE_TIMES } from "../../../shared/helpers/TimeHelper";
import ProviderCore from "../ProviderCore";
import AssociationIdentifier from "../../../identifierObjects/AssociationIdentifier";
import EstablishmentIdentifier from "../../../identifierObjects/EstablishmentIdentifier";
import Siren from "../../../identifierObjects/Siren";
import Siret from "../../../identifierObjects/Siret";
import { StructureIdentifier } from "../../../identifierObjects/@types/StructureIdentifier";

interface AvisSituationCache {
    etablissements: {
        nic: string;
        etablissementSiege: boolean;
    }[];
}

export class AvisSituationInseeService extends ProviderCore implements DocumentProvider {
    static API_URL = "https://api-avis-situation-sirene.insee.fr/identification";
    static DOC_PATH = "/document/avis_situation_api";

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

    private async getInseeEstablishmentsBySiren(siren: Siren): Promise<AvisSituationCache | false> {
        const requestValue = this.requestCache.get(siren.value);
        if (requestValue !== null) return requestValue;

        try {
            const result = await this.http.get<{
                etablissements: {
                    nic: string;
                    etablissementSiege: boolean;
                }[];
            }>(`${AvisSituationInseeService.API_URL}/siren/${siren.value}`);

            if (result.status == 200) {
                this.requestCache.add(siren.value, result.data);
                return result.data;
            }
            this.requestCache.add(siren.value, false);
            return false;
        } catch {
            return false;
        }
    }

    isDocumentProvider = true;

    async findSiretSiege(siren: Siren): Promise<Siret> {
        const data = await this.getInseeEstablishmentsBySiren(siren);
        if (!data) throw new Error("No data found in Insee API");

        const nic = data.etablissements.find(e => e.etablissementSiege)?.nic;
        if (!nic) throw new Error("No siege found in Insee API");

        return siren.toSiret(nic);
    }

    async getDocuments(identifier: StructureIdentifier): Promise<DocumentDto[]> {
        if (identifier instanceof AssociationIdentifier && !identifier.siren) {
            return [];
        }

        let siret: Siret;

        if (identifier instanceof EstablishmentIdentifier && identifier.siret) {
            siret = identifier.siret;
        } else if (identifier instanceof AssociationIdentifier && identifier.siren) {
            try {
                siret = await this.findSiretSiege(identifier.siren);
            } catch {
                return [];
            }
        } else {
            return [];
        }

        return [
            {
                type: ProviderValueMapper.toProviderValue("Avis Situation Insee", this.meta.name, new Date()),
                url: ProviderValueMapper.toProviderValue(
                    `${AvisSituationInseeService.DOC_PATH}/?url=${encodeURIComponent(
                        `${AvisSituationInseeService.API_URL}/pdf/${siret.value}`,
                    )}`,
                    this.meta.name,
                    new Date(),
                ),
                nom: ProviderValueMapper.toProviderValue(
                    `Avis Situation Insee (${siret.value})`,
                    this.meta.name,
                    new Date(),
                ),
                __meta__: {
                    siret: siret.value,
                },
            },
        ];
    }
}

const avisSituationInseeService = new AvisSituationInseeService();

export default avisSituationInseeService;
