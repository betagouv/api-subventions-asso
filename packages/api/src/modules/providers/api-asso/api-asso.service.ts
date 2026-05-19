import { AssociationWithProviderValues, EstablishmentWithProviderValues, DocumentWithProviderValueDto } from "dto";
import { XMLParser } from "fast-xml-parser";
import * as Sentry from "@sentry/node";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import { DefaultObject } from "../../../@types";
import CacheData from "../../../shared/Cache";
import { CACHE_TIMES } from "../../../shared/helpers/TimeHelper";
import AssociationsProvider from "../../associations/@types/AssociationsProvider";
import DocumentProvider from "../../documents/@types/DocumentsProvider";
import EstablishmentProvider from "../../establishments/@types/EstablishmentProvider";
import { hasEmptyProperties } from "../../../shared/helpers/ObjectHelper";
import ProviderCore from "../provider.core";
import AssociationIdentifier from "../../../identifier-objects/AssociationIdentifier";
import Rna from "../../../identifier-objects/Rna";
import Siren from "../../../identifier-objects/Siren";
import EstablishmentIdentifier from "../../../identifier-objects/EstablishmentIdentifier";
import ApiAssoDtoMapper from "./mappers/api-asso.dto.mapper";
import StructureDto, {
    DocumentsDto,
    StructureDacDocumentDto,
    StructureDocumentDto,
    StructureRnaDocumentDto,
} from "./dto/StructureDto";
import { SirenStructureDto } from "./dto/SirenStructureDto";
import { StructureIdentifier } from "../../../identifier-objects/@types/StructureIdentifier";
import apiAssoAdapter from "../../../adapters/outputs/api/api-asso/api-asso.adapter";
import ApiAssoPort from "../../../adapters/outputs/api/api-asso/api-asso.port";

export class ApiAssoService
    extends ProviderCore
    implements AssociationsProvider, EstablishmentProvider, DocumentProvider
{
    // API documented in part "contrat d'interface" https://lecompteasso.associations.gouv.fr/lapi-association/
    private requestCache = new CacheData<unknown>(CACHE_TIMES.ONE_DAY);

    constructor(private apiAssoAdapter: ApiAssoPort) {
        super({
            name: "API ASSO",
            type: ProviderEnum.api,
            id: "api_asso",
            description:
                "L'API Asso est une API portée par la DJEPVA et la DNUM des ministères sociaux qui expose des données sur les associations issues du RNA, de l'INSEE (SIREN/SIRET) et du Compte Asso.",
        });
    }

    public async findAssociationByRna(rna: Rna): Promise<AssociationWithProviderValues | null> {
        const rnaStructure = await this.apiAssoAdapter.getRnaStructure(rna);

        if (!rnaStructure) return null;
        if (hasEmptyProperties(rnaStructure.identite) || !rnaStructure.identite.date_modif_rna) return null; // sometimes an empty shell object if given by the api
        return ApiAssoDtoMapper.rnaStructureToAssociation(rnaStructure);
    }

    private getDefaultDateModifSiren(structure: StructureDto | SirenStructureDto) {
        return structure.identite?.date_creation_sirene || "1900-01-01";
    }

    public async findAssociationBySiren(siren: Siren): Promise<AssociationWithProviderValues | null> {
        const sirenStructure = await this.apiAssoAdapter.getSirenStructure(siren);
        const isSirenStructureValid = structure => structure.etablissement && structure.etablissement.length;

        if (!sirenStructure || !isSirenStructureValid(sirenStructure)) {
            const structure = await this.apiAssoAdapter.getStructure(siren);

            if (!structure) return structure;

            if (!structure.identite!.date_modif_siren)
                structure.identite!.date_modif_siren = this.getDefaultDateModifSiren(structure);
            return ApiAssoDtoMapper.sirenStructureToAssociation(structure);
        }

        if (hasEmptyProperties(sirenStructure.identite)) return null; // sometimes an empty shell object if given by the api

        if (!sirenStructure.identite.date_modif_siren)
            sirenStructure.identite.date_modif_siren = this.getDefaultDateModifSiren(sirenStructure);

        return ApiAssoDtoMapper.sirenStructureToAssociation(sirenStructure);
    }

    public async findEstablishmentsBySiren(siren: Siren): Promise<EstablishmentWithProviderValues[]> {
        const structure = await this.apiAssoAdapter.getStructure(siren);

        if (!structure?.identite || hasEmptyProperties(structure.identite)) return []; // sometimes an empty shell object if given by the api

        if (!structure.identite.date_modif_siren)
            structure.identite.date_modif_siren = this.getDefaultDateModifSiren(structure);

        const establishments = structure.etablissement || [];

        const ribs = structure.rib || [];

        return establishments
            .filter(establishment => establishment)
            .map(establishment =>
                ApiAssoDtoMapper.toEstablishment(
                    establishment,
                    ribs,
                    structure.representant_legal,
                    structure.identite!.date_modif_siren,
                ),
            );
    }

    private filterRnaDocuments(documents: StructureRnaDocumentDto[]) {
        const acceptedType = [
            "MD", // récépissé de modification
            "CR", //"Récépissé de création"
            "LDC", // liste des dirigeants
            "PV", // procès verbal
            "STC", // statuts
        ];

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
            "RFA", // rapports financier ou moral
            "BPA", // budget prévisionnel annuel
            "RCA", // Rapport du commissaire aux compte
            "RAR", // Rapport d'activité
            "Rapport du commissaire aux comptes", // comptes du dernier exercice clôt
            "Jeunesse et Education Populaire (JEP)",
            "Education nationale",
            "Formation", // L'habilitation d'organisme de formation
            "Service Civique", // agrement service civique
            "AGR", // arrêté de l'agrement
            "AFF", // Attestation d’affiliation
            "PRS", // Projet associatif
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

    private filterActiveDacDocuments(documents: StructureDacDocumentDto[], structureIdentifier: StructureIdentifier) {
        if (!Array.isArray(documents)) {
            if ((documents as Record<string, unknown>).uuid !== undefined) {
                // When api have one document, it is not an array but a single object
                documents = [documents];
            } else {
                const errorMessage =
                    "API-ASSO structure do not contain documents or format is not supported. Structure identifier => " +
                    structureIdentifier.toString();
                Sentry.captureException(new Error(errorMessage));
                console.error(errorMessage);
                return [];
            }
        }
        return documents.filter(document => document.meta.etat === "courant");
    }

    private async fetchDocuments(assoIdentifier: AssociationIdentifier): Promise<DocumentsDto | undefined> {
        let identifier: Siren | Rna | undefined = assoIdentifier.siren;
        if (!identifier) identifier = assoIdentifier.rna;
        if (!identifier) throw new Error("Identifier not supported for documents fetching.");

        const result = await this.apiAssoAdapter.getDocuments(identifier);

        let docs: DocumentsDto | undefined;

        if (typeof result == "string") {
            const parser = new XMLParser();
            const jsonResult = parser.parse(result) as StructureDocumentDto;
            docs = jsonResult?.asso?.documents;
        } else docs = result?.asso?.documents;

        if (docs?.document_rna && !Array.isArray(docs?.document_rna)) docs.document_rna = [docs.document_rna];
        if (docs?.document_dac && !Array.isArray(docs?.document_dac)) docs.document_dac = [docs.document_dac];

        return docs;
    }

    private async findRibs(identifier: AssociationIdentifier) {
        const documents = await this.fetchDocuments(identifier);
        if (!documents) return [];
        const activeDacDocuments = this.filterActiveDacDocuments(documents.document_dac || [], identifier);
        const ribs = this.filterRibsInDacDocuments(activeDacDocuments);
        return ribs.map(rib => ApiAssoDtoMapper.dacDocumentToRib(rib));
    }

    private async findDocuments(identifier: AssociationIdentifier): Promise<DocumentWithProviderValueDto[]> {
        const documents = await this.fetchDocuments(identifier);

        if (!documents) return [];

        const filteredRnaDocument = this.filterRnaDocuments(documents.document_rna || []);
        const activeDacDocuments = this.filterActiveDacDocuments(documents.document_dac || [], identifier);
        const filteredDacDocument = this.filterDacDocuments(activeDacDocuments);
        const ribs = this.filterRibsInDacDocuments(activeDacDocuments);

        return [
            ...filteredRnaDocument.map(document => ApiAssoDtoMapper.rnaDocumentToDocument(document)),
            ...filteredDacDocument.map(document => ApiAssoDtoMapper.dacDocumentToDocument(document)),
            ...ribs.map(document => ApiAssoDtoMapper.dacDocumentToRib(document)),
        ];
    }

    /**
     * |-------------------------|
     * |    Associations Part    |
     * |-------------------------|
     */

    isAssociationsProvider = true;

    async getAssociationsWithProviderValues(
        identifier: AssociationIdentifier,
    ): Promise<AssociationWithProviderValues[]> {
        const associations: AssociationWithProviderValues[] = [];

        if (identifier.siren) {
            const sirenAssociation = await this.findAssociationBySiren(identifier.siren);

            if (sirenAssociation) associations.push(sirenAssociation);
        }

        if (identifier.rna) {
            const rnaAssociation = await this.findAssociationByRna(identifier.rna);

            if (rnaAssociation) associations.push(rnaAssociation);
        }

        return associations;
    }

    /**
     * |-------------------------|
     * |   Etsablishment Part    |
     * |-------------------------|
     */

    isEstablishmentProvider = true;

    async getEstablishmentsWithProviderValues(
        identifier: StructureIdentifier,
    ): Promise<EstablishmentWithProviderValues[]> {
        if (identifier instanceof AssociationIdentifier && identifier.siren) {
            return this.findEstablishmentsBySiren(identifier.siren);
        } else if (identifier instanceof EstablishmentIdentifier && identifier.siret) {
            const siren = identifier.siret.toSiren();
            const result = await this.findEstablishmentsBySiren(siren);
            return result.filter(establishment => establishment.siret[0].value == identifier.siret?.value);
        }
        return [];
    }
    /**
     * |---------------------|
     * |   Documents Part    |
     * |---------------------|
     */

    isDocumentProvider = true;

    async getDocuments(identifier: StructureIdentifier): Promise<DocumentWithProviderValueDto[]> {
        if (identifier instanceof AssociationIdentifier) {
            return this.findDocuments(identifier);
        }

        if (!identifier.siret) {
            throw new Error("Invalid identifier type");
        }

        const documents = await this.findDocuments(identifier.associationIdentifier);
        return documents.filter(document => document.__meta__.siret == identifier.siret?.value);
    }

    async getRibs(identifier: EstablishmentIdentifier) {
        if (!identifier.siret) return [];
        const ribs = await this.findRibs(identifier.associationIdentifier);

        return ribs.filter(rib => rib.__meta__.siret === identifier.siret?.value);
    }
}

const apiAssoService = new ApiAssoService(apiAssoAdapter);

export default apiAssoService;
