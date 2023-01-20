import { Controller, Get, Route, Tags } from "tsoa";
import indexService from "../../index.service";

@Route("")
@Tags("Index Controller")
export class IndexController extends Controller {
    @Get()
    public index() {
        return indexService.getIndexData();
    }
}
