import HeliosParser from "./helios.parser";

export default class HeliosCli {
    parse(filePath: string) {
        return HeliosParser.parse(filePath);
    }
}
