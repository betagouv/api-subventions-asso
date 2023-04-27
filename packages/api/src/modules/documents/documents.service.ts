import { Rna, Siren, Siret } from "@api-subventions-asso/dto";
import { Document } from "@api-subventions-asso/dto/search/Document";
import providers from "../providers";
import { StructureIdentifiers } from "../../@types";
import { getIdentifierType } from "../../shared/helpers/IdentifierHelper";
import { StructureIdentifiersEnum } from "../../@enums/StructureIdentifiersEnum";
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

    private isDocumentProvider(data: unknown): data is DocumentProvider {
        return !!(data as DocumentProvider).isDocumentProvider;
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
                    console.error(e);
                    return [];
                }),
            ),
        );

        return result.flat() as Document[];
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
}

const documentsService = new DocumentsService();

export default documentsService;
