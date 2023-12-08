import { Controller, Get, Route, Tags } from "tsoa";
import indexService from "../../modules/index/index.service";

@Route("")
@Tags("Index Controller")
export class IndexInterfaceHttp extends Controller {
    @Get()
    public index() {
        return indexService.getIndexData();
    }
}
