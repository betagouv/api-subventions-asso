import { ParserInfo } from "../../../../@types";
import Gispro from "../@types/Gispro";

export default class GisproLineEntity implements Gispro {
    public provider = "Gispro";

    public static indexedInformationsPath: { [key: string]: ParserInfo<string | number> } = {
        ej: {
            path: [
                [
                    "CHORUS -EJ",
                    "EJ CHORUS",
                    "CHORUS EJ",
                    "N° doc. Précédent\nn° EJ CHORUS",
                    "EJ",
                    "N° doc. précédent (EJ)",
                ],
            ],
            adapter: value => value?.toString(),
        },
        dauphinId: {
            path: [["Action de demande - Code dossier", "Numéro De l'Action Prj", "Action - Code dossier"]],
            adapter: value => {
                if (typeof value === "number")
                    return value.toLocaleString("fr-FR", {
                        minimumIntegerDigits: 8,
                        useGrouping: false,
                    });
                if (typeof value !== "string") return;
                return value.match(/(?:DA)?(\d{8})(?:-\d*)?/)?.[1];
            },
        },
        siret: { path: [["Code SIRET", "Code Siret"]] },
    };

    constructor(public ej: string, public dauphinId: string, public siret: string) {}
}
