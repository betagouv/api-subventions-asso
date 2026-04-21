import createSaveHeliosDataUseCase from "../../../../modules/providers/helios/use-cases/helios.use-case.factory";
import HeliosCli from "./helios.cli";

export default function createHeliosCli() {
    return new HeliosCli(createSaveHeliosDataUseCase());
}
