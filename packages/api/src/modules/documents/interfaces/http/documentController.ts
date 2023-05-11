import { IncomingMessage } from "http";
import { Route, Get, Controller, Tags, Security, Response } from "tsoa";
import { HttpErrorInterface } from "../../../../shared/errors/httpErrors/HttpError";
import documentService from "../../documents.service";

@Route("document")
@Security("jwt")
@Tags("Document Controller")
export class DocumentController extends Controller {
    /**
     * Télécharge un document dauphin
     * @param encodedDocPath dauphin internal doc Id
     */
    @Get("dauphin/{encodedDocPath}")
    @Response<HttpErrorInterface>("404")
    public async getDauphinDocument(encodedDocPath): Promise<IncomingMessage> {
        const stream = await documentService.getDauphinDocumentStream(decodeURIComponent(encodedDocPath));
        this.setHeader("Content-Type", stream.headers["content-type"] || "application/octet-stream");
        this.setHeader("Content-Disposition", "inline");
        return stream;
    }
}
