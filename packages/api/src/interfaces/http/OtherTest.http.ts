import { Controller, Get, Route } from "tsoa";

@Route("othertest")
export class OtherTestHttp extends Controller {
    @Get("a")
    public async getA() {
        console.log("get a");
    }
}
