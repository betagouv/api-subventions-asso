import { Route, Get, Controller, Tags, Security, Response } from "tsoa";
import { HttpErrorInterface } from "../../shared/errors/httpErrors/HttpError";
import documentService from "../../modules/documents/documents.service";

@Route("document")
@Security("jwt")
@Tags("Document Controller")
export class DocumentHttp extends Controller {
    /**
     * Télécharge un document dauphin
     * @param providerId
     * @param encodedDocPath provider's doc path (TODO absolute or relative depending on provider)
     */
    @Get("/{providerId}/{encodedDocPath}")
    @Response<HttpErrorInterface>("404")
    // tsoa workaround https://github.com/lukeautry/tsoa/issues/340#issuecomment-518229063
    public async getDocumentStream(providerId: string, encodedDocPath: string): Promise<unknown> {
        const stream = await documentService.getDocumentStream(providerId, decodeURIComponent(encodedDocPath));
        this.setHeader("Content-Type", stream.headers["content-type"] || "application/octet-stream");
        this.setHeader("Content-Disposition", "inline");
        return stream;
    }
}
