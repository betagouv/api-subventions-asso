import fs from "fs";
import childProcess from "child_process";
import { IncomingMessage } from "http";
import { DocumentDto, DocumentRequestDto } from "dto";
import * as Sentry from "@sentry/node";
import mime = require("mime-types");
import providers from "../providers";
import { StructureIdentifier } from "../../@types";
import { ProviderRequestService } from "../provider-request/providerRequest.service";
import { FRONT_OFFICE_URL } from "../../configurations/front.conf";
import ProviderCore from "../providers/ProviderCore";
import { DauphinService } from "../providers/dauphin/dauphin.service";
import { providersById } from "../providers/providers.helper";
import EstablishmentIdentifier from "../../valueObjects/EstablishmentIdentifier";
import DocumentProvider from "./@types/DocumentsProvider";
import { documentToDocumentRequest } from "./document.adapter";

export class DocumentsService {
    ACCEPTED_URLS = [
        "https://lecompteasso.associations.gouv.fr/apim/api-asso/api/documents/",
        "https://api-avis-situation-sirene.insee.fr/identification/pdf/",
    ];

    providersById = providersById(Object.values(providers));

    public getDocuments(identifier: StructureIdentifier) {
        return this.aggregateDocuments(identifier);
    }

    public getRibs(identifier: EstablishmentIdentifier) {
        return this.aggregate(this.getRibProviders(), "getRibs", identifier);
    }

    private isDocumentProvider(provider): provider is DocumentProvider {
        return provider?.isDocumentProvider || false;
    }

    private getDocumentProviders() {
        return Object.values(providers).filter(p => this.isDocumentProvider(p)) as DocumentProvider[];
    }

    private getRibProviders() {
        return this.getDocumentProviders().filter(p => p.getRibs);
    }

    private async aggregate(providers: DocumentProvider[], method: string, id: StructureIdentifier) {
        const result = await Promise.all(
            providers.map(provider =>
                provider[method].call(provider, id).catch(e => {
                    Sentry.captureException(e);
                    console.error(e);
                    return [];
                }),
            ),
        );

        return result.flat() as DocumentDto[];
    }

    private aggregateDocuments(id: StructureIdentifier): Promise<DocumentDto[]> {
        return this.aggregate(this.getDocumentProviders(), "getDocuments", id);
    }

    getDocumentStream(providerId: string, docId: string): Promise<IncomingMessage> {
        const service = this.providersById[providerId] as DauphinService | ProviderCore;
        if ("getSpecificDocumentStream" in service) return service.getSpecificDocumentStream(docId);
        // TODO: refactor this to avoid typescript error on private access method
        // @ts-expect-error: ok for now because it was any type before refactor
        return this.getGenericDocumentStream(service.http, docId);
    }

    async getGenericDocumentStream(http: ProviderRequestService, url: string): Promise<IncomingMessage> {
        if (!this.ACCEPTED_URLS.some(acceptedUrl => url.startsWith(acceptedUrl))) throw new Error("Invalid URL");
        const res = await http.get(url, {
            responseType: "stream",
            headers: {
                "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-type": "attachment",
                "mg-authentication": "true",
                "Referrer-Policy": "strict-origin-when-cross-origin",
            },
        });
        return res.data;
    }

    async getDocumentsFilesByIdentifier(identifier: StructureIdentifier) {
        const documents = await this.aggregateDocuments(identifier);

        if (!documents || documents.length == 0) throw new Error("No document found");

        return this.getRequestedDocumentFiles(documents.map(documentToDocumentRequest), identifier.toString());
    }

    private sanitizeDocumentRequest(doc: DocumentRequestDto) {
        const noPathTraversal = s => s.replace(/[/|\\]/, "");
        doc.type = noPathTraversal(doc.type);
        doc.nom = noPathTraversal(doc.nom);
        return doc;
    }

    async safeGetRequestedDocumentFiles(unsafeDocuments: DocumentRequestDto[], baseFolderName = "docs") {
        const documents = unsafeDocuments.map(doc => this.sanitizeDocumentRequest(doc));
        return this.getRequestedDocumentFiles(documents, baseFolderName);
    }

    async getRequestedDocumentFiles(documents: DocumentRequestDto[], baseFolderName = "docs") {
        const folderName = `${baseFolderName}-${new Date().getTime()}`;

        fs.mkdirSync("/tmp/" + folderName);

        const documentsPathPromises = documents.map(document => {
            return this.downloadDocument(folderName, document);
        });

        const documentsPath = (await Promise.all(documentsPathPromises)).filter(document => document) as string[];
        childProcess.execFileSync("zip", ["j", `/tmp/${folderName}.zip`].concat(documentsPath));
        fs.rmSync("/tmp/" + folderName, { recursive: true, force: true });
        const stream = fs.createReadStream(`/tmp/${folderName}.zip`);

        // end event is same event of finish but for read stream
        stream.on("end", () => {
            fs.rmSync(`/tmp/${folderName}.zip`);
        });

        return stream;
    }

    private async downloadDocument(folderName: string, document: DocumentRequestDto): Promise<string | null> {
        try {
            const escapeInjectCmdInName = name => name.split('"')[0];
            const readStream = await this.getDocumentStreamByLocalApiUrl(document.url);
            const sourceFileName = escapeInjectCmdInName(
                readStream.headers["content-disposition"]?.match(/attachment;filename="(.*)"/)?.[1] || document.nom,
            );
            const extension = /\.[^/]+$/.test(sourceFileName)
                ? ""
                : "." + (mime.extension(readStream.headers["content-type"]) || "pdf");
            const documentPath = `/tmp/${folderName}/${document.type}-${sourceFileName}${extension}`;
            const writeStream = readStream.pipe(fs.createWriteStream(documentPath));
            return new Promise((resolve, reject) => {
                // finish event is same event of end but for write stream
                writeStream.on("finish", () => resolve(documentPath));
                writeStream.on("error", reject);
            });
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    private async getDocumentStreamByLocalApiUrl(localApiUrl: string) {
        const urlObj = new URL(localApiUrl, FRONT_OFFICE_URL);
        const providerId = urlObj.pathname.split("/")[2];
        const id = urlObj.searchParams.get("url") || "";
        return this.getDocumentStream(providerId, decodeURIComponent(id));
    }
}

const documentsService = new DocumentsService();

export default documentsService;
