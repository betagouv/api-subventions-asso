import { ParserInfo } from "../../../../@types";
import Gispro from "../@types/Gispro";

export default class GisproLineEntity implements Gispro {
    public provider = "Gispro";

    public static indexedInformationsPath: { [key: string]: ParserInfo } = {
        ej: { path: ["CHORUS -EJ"], adapter: value => value?.toString() },
        dauphinId: {
            path: ["Action de demande - Code dossier"],
            adapter: value => {
                if (typeof value !== "string") return;
                return value.match(/(?:DA)?(\d{8})(?:-\d*)?/)?.[1];
            },
        },
        siret: { path: ["Code SIRET"] },
    };

    constructor(public ej: string, public dauphinId: string, public siret: string) {}
}
