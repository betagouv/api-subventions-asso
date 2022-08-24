import { ProviderValues, Rna, Siren, Siret, Association, Etablissement } from "@api-subventions-asso/dto";
import axios from "axios";
import { ProviderEnum } from '../../../@enums/ProviderEnum';
import { AssociationIdentifiers } from "../../../@types";
import { API_ASSO_URL, API_ASSO_TOKEN } from "../../../configurations/apis.conf";
import CacheData from "../../../shared/Cache";
import EventManager from "../../../shared/EventManager";
import { asyncForEach } from "../../../shared/helpers/ArrayHelper";
import { siretToSiren } from "../../../shared/helpers/SirenHelper";
import { CACHE_TIMES } from "../../../shared/helpers/TimeHelper";
import AssociationsProvider from "../../associations/@types/AssociationsProvider";
import { Document } from "@api-subventions-asso/dto/search/Document";
import DocumentProvider from "../../documents/@types/DocumentsProvider";
import EtablissementProvider from "../../etablissements/@types/EtablissementProvider";
import ApiAssoDtoAdapter from "./adapters/ApiAssoDtoAdapter";
import StructureDto, { StructureRnaDocumentDto } from "./dto/StructureDto";
import { isDateNewer } from "../../../shared/helpers/DateHelper";

export class ApiAssoService implements AssociationsProvider, EtablissementProvider, DocumentProvider {
    public provider = {
        name: "API ASSO",
        type: ProviderEnum.api,
        description: "L'API Asso est une API portée par la DJEPVA et la DNUM des ministères sociaux qui expose des données sur les associations issues du RNA, de l'INSEE (SIREN/SIRET) et du Compte Asso."
    };
    private dataSirenCache = new CacheData<{ associations: Association[], etablissements: Etablissement[], documents: Document[] }>(CACHE_TIMES.ONE_DAY);
    private dataRnaCache = new CacheData<{ associations: Association[], etablissements: Etablissement[], documents: Document[] }>(CACHE_TIMES.ONE_DAY);
    private requestCache = new CacheData<unknown>(CACHE_TIMES.ONE_DAY);

    private async sendRequest<T>(route: string): Promise<T | null> {
        if (this.requestCache.has(route)) return this.requestCache.get(route)[0] as T;

        try {
            const res = await axios.get<T>(`${API_ASSO_URL}/${route}`, {
                headers: {
                    'Accept': "application/json",
                    "X-Gravitee-Api-Key": API_ASSO_TOKEN as string
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

    private async findFullScopeAssociation(identifier: AssociationIdentifiers): Promise<{ associations: Association[], etablissements: Etablissement[], documents: Document[] } | null> {
        if (this.dataSirenCache.has(identifier)) return this.dataSirenCache.get(identifier)[0];
        if (this.dataRnaCache.has(identifier)) return this.dataRnaCache.get(identifier)[0];

        let etablissements: Etablissement[] = [];

        const structure = await this.sendRequest<StructureDto>(`/structure/${identifier}`);
        if (!structure) return null;

        if (structure.etablissement) {
            etablissements = structure.etablissement.map(e => ApiAssoDtoAdapter.toEtablissement(e, structure.rib, structure.representant_legal, structure.identite.date_modif_siren));
        }

        const documents: Document[] = [];

        if (structure.document_rna.length) {
            const acceptedType = ["MD", "LDC", 'PV', "STC"];

            const sortRnaDocuments = (a: StructureRnaDocumentDto, b: StructureRnaDocumentDto) => {
                return parseFloat(`${a.annee}.${a.time}`) - parseFloat(`${b.annee}.${b.time}`);
            }

            const filtredRnaDocument = acceptedType.map(type => (
                structure.document_rna
                    .filter(document => document["sous-type"].toLocaleUpperCase() === type)
                    .sort(sortRnaDocuments)[0]
            )).filter((a) => a);

            documents.push(...filtredRnaDocument.map(document => ApiAssoDtoAdapter.rnaDocumentToDocument(document)));
        }

        if (structure.document_dac.length) {
            const acceptedType = ["RFA", "BPA", "RCA", "RAR", "CAP", "Jeunesse et Education Populaire (JEP)", "Education nationale", "Formation"];
            const currentStats = structure.document_dac.filter(document => document.meta.etat === "courant");

            const filtredDacDocument = acceptedType.map(type => (
                currentStats
                    .filter(document => document.meta.type.toLocaleUpperCase() === type)
                    .sort((a, b) => new Date(a.time_depot).getTime() - new Date(b.time_depot).getTime())[0]
            )).filter((a) => a);

            documents.push(...filtredDacDocument.map(document => ApiAssoDtoAdapter.dacDocumentToDocument(document)));

            const ribs = currentStats
                .filter(document => document.meta.type.toLocaleUpperCase() === "RIB");

            documents.push(...ribs.map(document => ApiAssoDtoAdapter.dacDocumentToDocument(document)));
        }

        const result = {
            associations: ApiAssoDtoAdapter.toAssociation(structure),
            etablissements,
            documents
        };

        if (structure.identite.id_rna && structure.identite.id_siren) {


            EventManager.call('rna-siren.matching', [{ rna: structure.identite.id_rna, siren: structure.identite.id_siren }])
            await asyncForEach(result.associations, async (association) => {
                let denomination;

                if (association.denomination_rna && association.denomination_siren) {
                    if (isDateNewer(structure.identite.date_modif_rna, structure.identite.date_modif_siren)) denomination = association.denomination_rna
                    else denomination = association.denomination_siren;
                } else if (association.denomination_rna || association.denomination_siren) {
                    denomination = association.denomination_rna || association.denomination_siren;
                } else {
                    return;
                }

                await EventManager.call('association-name.matching', [{
                    rna: structure.identite.id_rna,
                    siren: structure.identite.id_siren,
                    name: denomination[0].value,
                    provider: denomination[0].provider,
                    lastUpdate: ((association.date_modification_rna || association.date_modification_siren) as ProviderValues<Date>)[0].value
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
        const result = await this.findFullScopeAssociation(siren);

        if (!result) return null;

        return result.associations;
    }

    async getAssociationsBySiret(siret: Siret): Promise<Association[] | null> {
        return this.getAssociationsBySiren(siretToSiren(siret));
    }

    async getAssociationsByRna(rna: Rna): Promise<Association[] | null> {
        const result = await this.findFullScopeAssociation(rna);

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
        const result = await this.findFullScopeAssociation(siren);

        if (!result) return null;

        return result.etablissements;
    }


    /**
     * |---------------------|
     * |   Documents Part    |
     * |---------------------|
     */

    isDocumentProvider = true;

    async getDocumentsBySiren(siren: Siren) {
        const result = await this.findFullScopeAssociation(siren);

        if (!result) return null;

        const nicSiege = result.associations.find(a => a.nic_siege && a.nic_siege[0]?.value)?.nic_siege;

        if (!nicSiege || !nicSiege.length) return result.documents; // Siege not found so we return all documents

        const siretSiege = siren + nicSiege[0].value;

        return result.documents.filter(document => {
            if (document.type.value != "RIB") return true;

            if (document.__meta__.siret === siretSiege) return true;
            return false;
        });
    }
    async getDocumentsBySiret(siret: Siret) {
        const siren = siretToSiren(siret);

        const result = await this.findFullScopeAssociation(siren);

        if (!result) return null;

        return result.documents.filter(document => {
            if (document.__meta__.siret === siret) return true;
            return false;
        });
    }
    async getDocumentsByRna(rna: Rna) {
        const result = await this.findFullScopeAssociation(rna);

        if (!result) return null;

        const nicSiege = result.associations.find(a => a.nic_siege && a.nic_siege[0]?.value)?.nic_siege;
        const siren = result.associations.find(a => a.siren && a.siren[0]?.value)?.siren;

        if (!nicSiege || !nicSiege.length || !siren || !siren.length) return result.documents; // Siege not found so we return all documents

        const siretSiege = siren[0].value + nicSiege[0].value;

        return result.documents.filter(document => {
            if (document.type.value != "RIB") return true;

            if (document.__meta__.siret === siretSiege) return true;
            return false;
        });
    }
}

const apiAssoService = new ApiAssoService();

export default apiAssoService;