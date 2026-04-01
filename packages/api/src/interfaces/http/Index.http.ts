import { Controller, Get, Route, Tags, Example } from "tsoa";
import indexService from "../../modules/index/index.service";

@Route("")
@Tags("Index Controller")
export class IndexHttp extends Controller {
    /**
     * @summary Informations générales de l'API (version, statut)
     */
    @Example<{ message: string; doc: string; swagger: string }>({
        message: "Hello World",
        doc: "/doc",
        swagger: "/swagger",
    })
    @Get()
    public index() {
        return indexService.getIndexData();
    }
}
