import { Controller, Get, Route } from "tsoa";
import { OtherTestHttp } from "./OtherTest.http";

@Route("test")
export class TestHttp extends Controller {
    @Get("b")
    public async getB() {
        console.log("get b");
        new OtherTestHttp().getA();
    }
}
