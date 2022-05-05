import providers from "../providers";
import DocumentProvider from "./@types/DocumentsProvider";
import { Rna, Siren, Siret } from "@api-subventions-asso/dto";
import Document from "./@types/Document";
import { StructureIdentifiers } from "../../@types";
import { getIdentifierType } from "../../shared/helpers/IdentifierHelper";
import { StructureIdentifiersEnum } from "../../@enums/StructureIdentifiersEnum";

export class DocumentsService {

    public async getDocumentBySiren(siren: Siren) {
        const result = await this.aggregate(siren);

        return result.filter(d => d) as Document[]
    }

    public async getDocumentByRna(rna: Rna) {
        const result = await this.aggregate(rna);

        return result.filter(d => d) as Document[]
    }

    public async getDocumentBySiret(siret: Siret) {
        const result = await this.aggregate(siret);

        return result.filter(d => d) as Document[]
    }

    private isDocumentProvider(data: unknown): data is DocumentProvider {
        return !!(data as DocumentProvider).isDocumentProvider
    }

    private getDocumentProviders() {
        return Object.values(providers).filter((p) => this.isDocumentProvider(p)) as DocumentProvider[];
    }

    private async aggregate(id: StructureIdentifiers): Promise<(Document | null)[]> {
        const associationProviders = this.getDocumentProviders();

        const type = getIdentifierType(id) ;
        if (!type) throw new Error("You must provide a valid SIREN or RNA or SIRET");

        const method = type === StructureIdentifiersEnum.rna ? 'getDocumentsByRna'
            : type === StructureIdentifiersEnum.siren ? 'getDocumentsBySiren'
                : "getDocumentsBySiret"

        const result = await Promise.all(associationProviders.map(provider => provider[method].call(provider, id)));

        return result.flat();
    }
}

const documentsService = new DocumentsService();

export default documentsService;