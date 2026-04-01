import type { DocumentRequestDto, StructureIdentifierDto } from "dto";
import type { IdentifiedRequest } from "../../@types";

import {
    Route,
    Get,
    Controller,
    Tags,
    Security,
    Response,
    Query,
    Path,
    Post,
    Body,
    Request,
    Produces,
    Hidden,
} from "tsoa";
import { HttpErrorInterface } from "core";
import documentService from "../../modules/documents/documents.service";
import establishmentIdentifierService from "../../modules/establishment-identifier/establishment-identifier.service";
import associationIdentifierService from "../../modules/association-identifier/association-identifier.service";

@Route("document")
@Security("jwt")
@Tags("Document Controller")
export class DocumentHttp extends Controller {
    /**
     * @summary Télécharge tous les documents d'une structure (ZIP) via son RNA, SIREN ou SIRET
     */
    @Produces("application/zip")
    @Get("/downloads/{identifier}")
    public async downloadDocumentsByIdentifier(@Path() identifier: StructureIdentifierDto) {
        const identifierEntity = await (establishmentIdentifierService.isEstablishmentIdentifier(identifier)
            ? establishmentIdentifierService.getEstablishmentIdentifiers(identifier)
            : associationIdentifierService.getOneAssociationIdentifier(identifier));

        const stream = await documentService.getDocumentsFilesByIdentifier(identifierEntity);
        this.setHeader("Content-Type", "application/zip");
        this.setHeader("Content-Disposition", "inline");
        return stream;
    }

    /**
     * @summary Télécharge une sélection de documents (ZIP)
     */
    @Produces("application/zip")
    @Post("/downloads")
    public async downloadRequiredDocuments(
        @Body() requiredDocs: DocumentRequestDto[],
        @Request() req: IdentifiedRequest,
    ) {
        const stream = await documentService.safeGetRequestedDocumentFiles(requiredDocs, req.user._id.toString());
        this.setHeader("Content-Type", "application/zip");
        this.setHeader("Content-Disposition", "inline");
        return stream;
    }

    // @TODO: seems not used anymore ?
    /**
     * Télécharge un document dauphin
     *
     * @summary Télécharge un document depuis un identifiant de document fournisseur
     * @param providerId
     * @param url absolute provider's doc path
     */
    @Produces("application/octet-stream")
    @Hidden()
    @Get("/{providerId}")
    @Response<HttpErrorInterface>("404")
    // tsoa workaround https://github.com/lukeautry/tsoa/issues/340#issuecomment-518229063
    public async getDocumentStream(@Path() providerId: string, @Query() url: string): Promise<unknown> {
        const stream = await documentService.getDocumentStream(providerId, decodeURIComponent(url));
        this.setHeader("Content-Type", stream.headers["content-type"] || "application/octet-stream");
        this.setHeader("Content-Disposition", stream.headers["content-disposition"]);
        return stream;
    }
}
