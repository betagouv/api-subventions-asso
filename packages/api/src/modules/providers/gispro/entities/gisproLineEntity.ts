import { ParserInfo } from "../../../../@types";
import Gispro from "../@types/Gispro";

export default class GisproLineEntity implements Gispro {
    public provider = "Gispro";

    public static indexedInformationsPath: { [key: string]: ParserInfo } = {
        ej: { path: ["CHORUS -EJ"], adapter: value => value?.toString() },
        dauphinId: { path: ["Action de demande - Code dossier"] },
        siret: { path: ["Code SIRET"] },
    };

    constructor(public ej: string, public dauphinId: string, public siret: string) {}
}
