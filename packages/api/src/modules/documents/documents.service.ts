import fs from "fs";
import { execSync } from "child_process";
import { IncomingMessage } from "http";
import { Rna, Siren, Siret, Document } from "dto";
import * as Sentry from "@sentry/node";
import providers, { providersById } from "../providers";
import { StructureIdentifiers } from "../../@types";
import { getIdentifierType } from "../../shared/helpers/IdentifierHelper";
import { StructureIdentifiersEnum } from "../../@enums/StructureIdentifiersEnum";
import { ProviderRequestService } from "../provider-request/providerRequest.service";
import { FRONT_OFFICE_URL } from "../../configurations/front.conf";
import DocumentProvider from "./@types/DocumentsProvider";

export class DocumentsService {
    public async getDocumentBySiren(siren: Siren) {
        const result = await this.aggregateDocuments(siren);

        return result.filter(d => d) as Document[];
    }

    public async getDocumentByRna(rna: Rna) {
        const result = await this.aggregateDocuments(rna);

        return result.filter(d => d) as Document[];
    }

    public async getDocumentBySiret(siret: Siret) {
        const result = await this.aggregateDocuments(siret);

        return result.filter(d => d) as Document[];
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

        return (result.flat() as Document[]).filter(doc => doc.type && doc.type.value !== "LDC"); // skip "Liste des dirigeants" because of political insecurities
    }

    private async aggregateDocuments(id: StructureIdentifiers): Promise<(Document | null)[]> {
        const documentProviders = this.getDocumentProviders();

        const type = getIdentifierType(id);
        if (!type) throw new Error("You must provide a valid SIREN or RNA or SIRET");

        const method =
            type === StructureIdentifiersEnum.rna
                ? "getDocumentsByRna"
                : type === StructureIdentifiersEnum.siren
                ? "getDocumentsBySiren"
                : "getDocumentsBySiret";

        return await this.aggregate(documentProviders, method, id);
    }

    getDocumentStream(providerId: string, docId: string): Promise<IncomingMessage> {
        const service = providersById[providerId];
        if ("getSpecificDocumentStream" in service) return service.getSpecificDocumentStream(docId);
        return this.getGenericDocumentStream(service.http, docId);
    }

    async getGenericDocumentStream(http: ProviderRequestService, url: string): Promise<IncomingMessage> {
        return (
            await http.get(url, {
                responseType: "stream",
                headers: {
                    accept: "application/json, text/plain, */*",
                    "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
                    "mg-authentication": "true",
                    "Referrer-Policy": "strict-origin-when-cross-origin",
                },
            })
        ).data;
    }
    async getDocumentsFiles(identifier: StructureIdentifiers) {
        const type = getIdentifierType(identifier);

        if (!type) throw new Error("You must provide a valid SIREN or RNA or SIRET");

        const documents =
            type === StructureIdentifiersEnum.rna
                ? await this.getDocumentByRna(identifier)
                : type === StructureIdentifiersEnum.siren
                ? await this.getDocumentBySiren(identifier)
                : await this.getDocumentBySiret(identifier);

        if (!documents) throw new Error("No documents found");
        const folderName = `${identifier}-${new Date().getTime()}`;

        fs.mkdirSync("/tmp/" + folderName);

        const documentsPathPromises = documents.map(document => {
            return this.downloadDocument(folderName, document);
        });

        const documentsPath = (await Promise.all(documentsPathPromises)).filter(document => document) as string[];

        const zipCmd = `zip -j /tmp/${folderName}.zip "${documentsPath.join('" "')}"`;
        execSync(zipCmd);
        fs.rmSync("/tmp/" + folderName, { recursive: true, force: true });
        return fs.createReadStream(`/tmp/${folderName}.zip`);
    }

    private async downloadDocument(folderName: string, document: Document): Promise<string | null> {
        try {
            const documentPath = `/tmp/${folderName}/${document.type.value}-${document.nom.value}`;
            const stream = (await this.getDocumentStreamByUrl(document.url.value)).pipe(
                fs.createWriteStream(documentPath),
            );
            return new Promise((resolve, reject) => {
                stream.on("finish", () => {
                    resolve(documentPath);
                });
                stream.on("error", reject);
            });
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    private async getDocumentStreamByUrl(url: string) {
        const urlObj = new URL(url, FRONT_OFFICE_URL)
        const providerId = urlObj.pathname.split("/")[2];
        const id = urlObj.searchParams.get("url") || "";
        return this.getDocumentStream(providerId, decodeURIComponent(id));
    }
}

const documentsService = new DocumentsService();

export default documentsService;
