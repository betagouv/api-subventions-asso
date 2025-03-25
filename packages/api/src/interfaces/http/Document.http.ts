import { Route, Get, Controller, Tags, Security, Response, Query, Path, Post, Body, Request } from "tsoa";
import { DocumentRequestDto, StructureIdentifierDto } from "dto";
import { HttpErrorInterface } from "core";
import documentService from "../../modules/documents/documents.service";
import { IdentifiedRequest } from "../../@types";
import establishmentIdentifierService from "../../modules/establishment-identifier/establishment-identifier.service";
import associationIdentifierService from "../../modules/association-identifier/association-identifier.service";

@Route("document")
@Security("jwt")
@Tags("Document Controller")
export class DocumentHttp extends Controller {
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

    /**
     * Télécharge un document dauphin
     * @param providerId
     * @param url absolute provider's doc path
     */
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
