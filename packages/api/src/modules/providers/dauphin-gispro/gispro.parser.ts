import tqdm from "tqdm";
import { GenericParser } from "../../../shared/GenericParser";
import { DefaultObject, ParserInfo } from "../../../@types";
import GisproEntity from "./@types/GisproEntity";

export default class GisproParser {
    static pageIndexByYear: { [year: number]: number } = {
        2018: 0,
        2019: 0,
        2020: 0,
        2021: 0,
        2023: 1,
        2022: 2,
    };

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
        codeActionDossier: {
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
        directionGestionnaire: {
            path: [["Direction du gestionnaire du dossier"]],
            adapter: value => value?.toString(),
        },
        siret: { path: [["Code SIRET", "Code Siret"]] },
        codeProjet: { path: [["Projet - Code dossier", "Code projet"]] },
        typeProcedure: { path: [["Libellé de la famille de procédure"]] },
        montant: { path: [["Montant engagé", "Mt engagé"]] },
        typeBeneficiaire: { path: [["Type de tiers"]] },
    };

    static parse(content: Buffer, exercise: number, validator: (entity: GisproEntity) => boolean = () => true) {
        console.log("Open and read file ...");
        const pages = GenericParser.xlsxParse(content);
        const page = pages[GisproParser.pageIndexByYear[exercise]];
        console.log("Read file end");

        const header = page[0] as string[];

        const data = page.slice(1) as string[][];

        const entities: GisproEntity[] = [];
        for (const row of tqdm(data)) {
            const parsedData = GenericParser.linkHeaderToData(header, row) as DefaultObject<string>;
            const entity = GenericParser.indexDataByPathObject(
                // TODO <string|number> ??
                GisproParser.indexedInformationsPath,
                parsedData,
            ) as unknown as GisproEntity;
            entity.exercise = exercise;

            if (validator(entity)) entities.push(entity);
        }
        return entities;
    }
}
