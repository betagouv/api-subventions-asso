import ControllerMethod from "./ControllerMethod";

export interface StaticController {
    basePath: string;
    new (): Controller;
}

export default interface Controller {
    [key: string]: ControllerMethod;
}
