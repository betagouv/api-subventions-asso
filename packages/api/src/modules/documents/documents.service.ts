import fs from "fs";
import childProcess from "child_process";
import { IncomingMessage } from "http";
import { Rna, Siren, Siret, DocumentDto, DocumentRequestDto } from "dto";
import * as Sentry from "@sentry/node";
import mime = require("mime-types");
import providers, { providersById } from "../providers";
import { StructureIdentifiers } from "../../@types";
import { getIdentifierType } from "../../shared/helpers/IdentifierHelper";
import { StructureIdentifiersEnum } from "../../@enums/StructureIdentifiersEnum";
import { ProviderRequestService } from "../provider-request/providerRequest.service";
import { FRONT_OFFICE_URL } from "../../configurations/front.conf";
import DocumentProvider from "./@types/DocumentsProvider";
import { documentToDocumentRequest } from "./document.adapter";

export class DocumentsService {
    public async getDocumentBySiren(siren: Siren) {
        const result = await this.aggregateDocuments(siren);

        return result.filter(d => d) as DocumentDto[];
    }

    public async getDocumentByRna(rna: Rna) {
        const result = await this.aggregateDocuments(rna);

        return result.filter(d => d) as DocumentDto[];
    }

    public async getDocumentBySiret(siret: Siret) {
        const result = await this.aggregateDocuments(siret);

        return result.filter(d => d) as DocumentDto[];
    }

    public async getRibsBySiret(siret: Siret) {
        return await this.aggregateRibs(siret);
    }

    private isDocumentProvider(provider): boolean {
        return provider?.isDocumentProvider || false;
    }

    private getDocumentProviders() {
        return Object.values(providers).filter(p => this.isDocumentProvider(p)) as DocumentProvider[];
    }

    private getRibProviders() {
        return this.getDocumentProviders().filter(p => p.getRibsBySiret);
    }

    private async aggregateRibs(id: Siret) {
        return await this.aggregate(this.getRibProviders(), "getRibsBySiret", id);
    }

    private async aggregate(providers, method, id) {
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

    private async aggregateDocuments(id: StructureIdentifiers): Promise<(DocumentDto | null)[]> {
        const documentProviders = this.getDocumentProviders();

        const type = getIdentifierType(id);
        if (!type) throw new Error("You must provide a valid SIREN or RNA or SIRET");

        const method =
            type === StructureIdentifiersEnum.rna
                ? "getDocumentsByRna"
                : type === StructureIdentifiersEnum.siren
                ? "getDocumentsBySiren"
                : "getDocumentsBySiret";

        return this.aggregate(documentProviders, method, id);
    }

    getDocumentStream(providerId: string, docId: string): Promise<IncomingMessage> {
        const service = providersById[providerId];
        if ("getSpecificDocumentStream" in service) return service.getSpecificDocumentStream(docId);
        return this.getGenericDocumentStream(service.http, docId);
    }

    async getGenericDocumentStream(http: ProviderRequestService, url: string): Promise<IncomingMessage> {
        const res = await http.get(url, {
            responseType: "stream",
            headers: {
                "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
                "mg-authentication": "true",
                "Referrer-Policy": "strict-origin-when-cross-origin",
            },
        });
        return res.data;
    }

    async getDocumentsFilesByIdentifier(identifier: StructureIdentifiers) {
        const type = getIdentifierType(identifier);

        if (!type) throw new Error("You must provide a valid SIREN or RNA or SIRET");

        const documents = (await this.aggregateDocuments(identifier)).filter(d => d) as DocumentDto[];

        if (!documents || documents.length == 0) throw new Error("No document found");

        return this.getRequestedDocumentsFiles(documents.map(documentToDocumentRequest), identifier);
    }

    async getRequestedDocumentsFiles(documents: DocumentRequestDto[], baseFolderName = "docs") {
        const folderName = `${baseFolderName}-${new Date().getTime()}`;

        fs.mkdirSync("/tmp/" + folderName);

        const documentsPathPromises = documents.map(document => {
            return this.downloadDocument(folderName, document);
        });

        const documentsPath = (await Promise.all(documentsPathPromises)).filter(document => document) as string[];
        const zipCmd = `zip -j /tmp/${folderName}.zip "${documentsPath.join('" "')}"`;
        childProcess.execSync(zipCmd);
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
            const readStream = await this.getDocumentStreamByLocalApiUrl(document.url);
            const sourceFileName =
                readStream.headers["content-disposition"]?.match(/attachment;filename="(.*)"/)?.[1] || document.nom;
            const extension = /\.[^/]+$/.test(sourceFileName)
                ? ""
                : "." + (mime.extension(readStream.headers["content-type"]) || "pdf");
            const documentPath = `/tmp/${folderName}/${document.type}-${sourceFileName}${extension}`;
            const writeStream = readStream.pipe(fs.createWriteStream(documentPath));
            return new Promise((resolve, reject) => {
                // finish event is same event of end but for write stream
                writeStream.on("finish", () => {
                    resolve(documentPath);
                });
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
