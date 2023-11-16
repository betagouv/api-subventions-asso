import { Rna, Siren, Siret, Association, Etablissement, Document } from "dto";
import axios from "axios";
import * as Sentry from "@sentry/node";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import { AssociationIdentifiers, DefaultObject, StructureIdentifiers } from "../../../@types";
import { API_ASSO_URL, API_ASSO_TOKEN } from "../../../configurations/apis.conf";
import CacheData from "../../../shared/Cache";
import { siretToSiren } from "../../../shared/helpers/SirenHelper";
import { CACHE_TIMES } from "../../../shared/helpers/TimeHelper";
import AssociationsProvider from "../../associations/@types/AssociationsProvider";
import DocumentProvider from "../../documents/@types/DocumentsProvider";
import EtablissementProvider from "../../etablissements/@types/EtablissementProvider";
import { isDateNewer } from "../../../shared/helpers/DateHelper";
import associationNameService from "../../association-name/associationName.service";
import ApiAssoDtoAdapter from "./adapters/ApiAssoDtoAdapter";
import StructureDto, {
    StructureDacDocumentDto,
    StructureDocumentDto,
    StructureRnaDocumentDto,
} from "./dto/StructureDto";
import { RnaStructureDto } from "./dto/RnaStructureDto";
import { SirenStructureDto } from "./dto/SirenStructureDto";

export class ApiAssoService implements AssociationsProvider, EtablissementProvider, DocumentProvider {
    public provider = {
        name: "API ASSO",
        type: ProviderEnum.api,
        description:
            "L'API Asso est une API portée par la DJEPVA et la DNUM des ministères sociaux qui expose des données sur les associations issues du RNA, de l'INSEE (SIREN/SIRET) et du Compte Asso.",
    };
    private requestCache = new CacheData<unknown>(CACHE_TIMES.ONE_DAY);

    constructor() {
        associationNameService.setProviderScore(ApiAssoDtoAdapter.providerNameRna, 1);
        associationNameService.setProviderScore(ApiAssoDtoAdapter.providerNameSiren, 1);
    }

    private async sendRequest<T>(route: string): Promise<T | null> {
        if (this.requestCache.has(route)) return this.requestCache.get(route)[0] as T;

        try {
            const res = await axios.get<T>(`${API_ASSO_URL}/${route}`, {
                headers: {
                    Accept: "application/json",
                    "X-Gravitee-Api-Key": API_ASSO_TOKEN as string,
                },
            });

            if (res.status === 200 && (typeof res.data != "string" || !res.data.includes("Error"))) {
                this.requestCache.add(route, res.data);
                return res.data;
            }
            return null;
        } catch {
            return null;
        }
    }

    public async findAssociationByRna(rna: Rna): Promise<Association | null> {
        const rnaStructure = await this.sendRequest<RnaStructureDto>(`/api/rna/${rna}`);

        if (!rnaStructure) return null;
        if (!rnaStructure.identite?.date_modif_rna) return null; // sometimes an empty shell object if given by the api
        return ApiAssoDtoAdapter.rnaStructureToAssociation(rnaStructure);
    }

    public async findAssociationBySiren(siren: Siren): Promise<Association | null> {
        const sirenStructure = await this.sendRequest<SirenStructureDto>(`/api/siren/${siren}`);

        const isSirenStructureValid = structure => structure.etablissement && structure.etablissement.length;

        if (!sirenStructure || !isSirenStructureValid(sirenStructure)) {
            const structure = await this.sendRequest<SirenStructureDto>(`/api/structure/${siren}`);
            if (!structure || !structure.identite?.date_modif_siren) return null;
            return ApiAssoDtoAdapter.sirenStructureToAssociation(structure);
        }
        if (!sirenStructure.identite?.date_modif_siren) return null; // sometimes an empty shell object if given by the api
        return ApiAssoDtoAdapter.sirenStructureToAssociation(sirenStructure);
    }

    private async findEtablissementsBySiren(siren: Siren): Promise<Etablissement[] | null> {
        const structure = await this.sendRequest<StructureDto>(`/api/structure/${siren}`);

        if (!structure) return null;
        if (!structure.identite?.date_modif_siren) return null; // sometimes an empty shell object if given by the api

        await this.saveStructureInAssociationName(structure);

        const establishments = Array.isArray(structure.etablissements.etablissement)
            ? structure.etablissements.etablissement
            : [structure.etablissements.etablissement];

        const ribs = structure.ribs
            ? Array.isArray(structure.ribs.rib)
                ? structure.ribs.rib
                : [structure.ribs.rib]
            : [];

        return establishments.map(etablissement =>
            ApiAssoDtoAdapter.toEtablissement(
                etablissement,
                ribs,
                structure.representant_legal,
                structure.identite.date_modif_siren,
            ),
        );
    }

    private async saveStructureInAssociationName(structure: StructureDto) {
        if (!structure?.identite?.id_siren || !structure?.identite?.id_rna || !structure?.identite?.nom) return;

        const lastUpdateDateRna = ApiAssoDtoAdapter.apiDateToDate(structure.identite.date_modif_rna);
        const lastUpdateDateSiren = ApiAssoDtoAdapter.apiDateToDate(structure.identite.date_modif_siren);

        const rnaIsMoreRecent = isDateNewer(lastUpdateDateRna, lastUpdateDateSiren);

        await associationNameService.upsert({
            rna: structure.identite.id_rna,
            siren: structure.identite.id_siren.toString(),
            name: structure.identite.nom,
            provider: rnaIsMoreRecent ? ApiAssoDtoAdapter.providerNameRna : ApiAssoDtoAdapter.providerNameSiren,
            lastUpdate: rnaIsMoreRecent ? lastUpdateDateRna : lastUpdateDateSiren,
        });
    }

    private filterRnaDocuments(documents: StructureRnaDocumentDto[]) {
        const acceptedType = ["MD", "LDC", "PV", "STC"];

        const sortByYearAndTimeAsc = (a: StructureRnaDocumentDto, b: StructureRnaDocumentDto) => {
            return parseFloat(`${a.annee}.${a.time}`) - parseFloat(`${b.annee}.${b.time}`);
        };

        return acceptedType
            .map(type =>
                documents
                    .filter(document => document["sous_type"].toLocaleUpperCase() === type)
                    .sort(sortByYearAndTimeAsc)
                    // Get most recent document
                    .pop(),
            )
            .filter(document => document) as StructureRnaDocumentDto[];
    }

    private filterDacDocuments(documents: StructureDacDocumentDto[]) {
        const acceptedType = [
            "RFA",
            "BPA",
            "RCA",
            "RAR",
            "CAP",
            "Jeunesse et Education Populaire (JEP)",
            "Education nationale",
            "Formation",
        ];

        const sortByTimeDepotAsc = (a: StructureDacDocumentDto, b: StructureDacDocumentDto) =>
            new Date(a.time_depot).getTime() - new Date(b.time_depot).getTime();

        return acceptedType
            .map(type =>
                documents
                    .filter(document => document.meta.type.toLocaleUpperCase() === type.toLocaleUpperCase())
                    .sort(sortByTimeDepotAsc)
                    // Get most recent document
                    .pop(),
            )
            .filter(document => document) as StructureDacDocumentDto[];
    }

    private filterRibsInDacDocuments(documents: StructureDacDocumentDto[]) {
        const ribs = documents.filter(
            document =>
                document.meta.type.toLocaleUpperCase() === "RIB" && document.url && document.meta.iban !== "null",
        );

        const uniquesRibs = ribs.reduce((acc, rib) => {
            const ribName = rib.meta.iban || rib.nom;
            if (!acc[ribName] || new Date(rib.time_depot).getTime() > new Date(acc[ribName].time_depot).getTime()) {
                acc[ribName] = rib;
            }
            return acc;
        }, {} as DefaultObject<StructureDacDocumentDto>);

        return Object.values(uniquesRibs);
    }

    private filterActiveDacDocuments(documents: StructureDacDocumentDto[], structureIdentifier: StructureIdentifiers) {
        if (!Array.isArray(documents)) {
            const errorMessage = "API-ASSO documents is not an array for structure " + structureIdentifier;
            Sentry.captureException(new Error(errorMessage));
            console.error(errorMessage);
            return [];
        }
        return documents.filter(document => document.meta.etat === "courant");
    }

    private async fetchDocuments(identifier: AssociationIdentifiers) {
        const result = await this.sendRequest<StructureDocumentDto>(`/proxy_db_asso/documents/${identifier}`);
        return result?.asso?.documents;
    }

    private async findRibs(identifier: AssociationIdentifiers) {
        const documents = await this.fetchDocuments(identifier);
        if (!documents) return [];

        const activeDacDocuments = this.filterActiveDacDocuments(documents.document_dac || [], identifier);
        const ribs = this.filterRibsInDacDocuments(activeDacDocuments);
        return ribs.map(rib => ApiAssoDtoAdapter.dacDocumentToRib(rib));
    }

    private async findDocuments(identifier: AssociationIdentifiers): Promise<Document[]> {
        const documents = await this.fetchDocuments(identifier);
        if (!documents) return [];

        const filtredRnaDocument = this.filterRnaDocuments(documents.document_rna || []);
        const activeDacDocuments = this.filterActiveDacDocuments(documents.document_dac || [], identifier);
        const filtredDacDocument = this.filterDacDocuments(activeDacDocuments);
        const ribs = this.filterRibsInDacDocuments(activeDacDocuments);

        return [
            ...filtredRnaDocument.map(document => ApiAssoDtoAdapter.rnaDocumentToDocument(document)),
            ...filtredDacDocument.map(document => ApiAssoDtoAdapter.dacDocumentToDocument(document)),
            ...ribs.map(document => ApiAssoDtoAdapter.dacDocumentToRib(document)),
        ];
    }

    /**
     * |-------------------------|
     * |    Associations Part    |
     * |-------------------------|
     */

    isAssociationsProvider = true;

    async getAssociationsBySiren(siren: Siren): Promise<Association[] | null> {
        const sirenAssociation = await this.findAssociationBySiren(siren);

        if (!sirenAssociation) return null;

        const groupedIdentifier = await associationNameService.getGroupedIdentifiers(siren);
        let rna = groupedIdentifier.rna || "";

        if (!groupedIdentifier.rna) {
            // Check if information rna <=> siren is save in apiRNA
            const structure = await this.sendRequest<StructureDto>(`/api/structure/${siren}`);
            if (!structure?.identite.id_rna) return [sirenAssociation];
            rna = structure.identite.id_rna;
        }

        const rnaAssociation = await this.findAssociationByRna(rna);

        if (!rnaAssociation) return [sirenAssociation];

        return [sirenAssociation, rnaAssociation];
    }

    async getAssociationsBySiret(siret: Siret): Promise<Association[] | null> {
        return this.getAssociationsBySiren(siretToSiren(siret));
    }

    async getAssociationsByRna(rna: Rna): Promise<Association[] | null> {
        const rnaAssociation = await this.findAssociationByRna(rna);

        if (!rnaAssociation) return null;

        const groupedIdentifier = await associationNameService.getGroupedIdentifiers(rna);

        let siren = groupedIdentifier.siren || "";

        if (!groupedIdentifier.siren) {
            // Check if information rna <=> siren is saved in apiRNA
            const structure = await this.sendRequest<StructureDto>(`/api/structure/${rna}`);
            if (!structure?.identite.id_siren) return [rnaAssociation];
            siren = structure.identite.id_siren.toString();
        }

        const sirenAssociation = await this.findAssociationBySiren(siren);

        if (!sirenAssociation) return [rnaAssociation];

        return [rnaAssociation, sirenAssociation];
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

        return result.filter(e => e.siret[0].value == siret);
    }

    async getEtablissementsBySiren(siren: Siren): Promise<Etablissement[] | null> {
        const etablissements = await this.findEtablissementsBySiren(siren);

        if (!etablissements) return null;

        return etablissements;
    }

    /**
     * |---------------------|
     * |   Documents Part    |
     * |---------------------|
     */

    isDocumentProvider = true;

    async getDocumentsBySiren(siren: Siren) {
        return this.findDocuments(siren);
    }

    async getDocumentsBySiret(siret: Siret) {
        const siren = siretToSiren(siret);

        const documents = await this.findDocuments(siren);

        if (!documents) return documents;

        const filteredDocuments = documents.filter(document => {
            if (document.__meta__.siret == siret) return true;
            return false;
        });

        return filteredDocuments;
    }

    async getDocumentsByRna(rna: Rna) {
        return this.findDocuments(rna);
    }

    async getRibsBySiret(siret: Siret) {
        const ribs = await this.findRibs(siretToSiren(siret));

        return ribs.filter(rib => rib.__meta__.siret === siret);
    }
}

const apiAssoService = new ApiAssoService();

export default apiAssoService;
