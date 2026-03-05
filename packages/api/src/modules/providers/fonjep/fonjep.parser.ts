import * as fs from "fs";
import { GenericParser } from "../../../shared/GenericParser";
import FonjepDispositifDto from "../../../dataProviders/db/providers/fonjep/dto/fonjepDispositifDto";
import FonjepTiersDto from "../../../dataProviders/db/providers/fonjep/dto/fonjepTiersDto";
import FonjepPosteDto, {
    FonjepPosteDtoWithJSDate,
} from "../../../dataProviders/db/providers/fonjep/dto/fonjepPosteDto";
import FonjepVersementDtoWithExcelDate, {
    FonjepVersementDto,
} from "../../../dataProviders/db/providers/fonjep/dto/fonjepVersementDto";
import FonjepTypePosteDto from "../../../dataProviders/db/providers/fonjep/dto/fonjepTypePosteDto";
import { isNumberValid } from "../../../shared/Validators";

export default class FonjepParser {
    private static mapHeaderToData(pages: unknown[][]) {
        return pages.map(page => {
            const headers = page.slice(0, 1)[0] as string[];
            const trimHeaders = headers.map((h: string) => h.trim());

            const rows = page.slice(1, page.length) as (string | number)[][]; // Delete Headers

            return rows.map(data => GenericParser.linkHeaderToData(trimHeaders, data, { allowNull: true }));
        });
    }

    public static parse(filePath: string): {
        tiers: FonjepTiersDto[];
        postes: FonjepPosteDtoWithJSDate[];
        versements: FonjepVersementDto[];
        typePoste: FonjepTypePosteDto[];
        dispositifs: FonjepDispositifDto[];
    } {
        const fileContent = this.getBuffer(filePath);
        const pagesWithName = GenericParser.xlsxParseByPageName(fileContent);
        const pages = [
            pagesWithName["Tiers"],
            pagesWithName["Poste"],
            pagesWithName["Versement"],
            pagesWithName["TypePoste"],
            pagesWithName["Dispositif"],
        ];

        // @ts-expect-error: this is what we get
        const [tiers, postes, versements, typePoste, dispositifs] = this.mapHeaderToData(pages) as [
            FonjepTiersDto[],
            FonjepPosteDto[],
            FonjepVersementDtoWithExcelDate[],
            FonjepTypePosteDto[],
            FonjepDispositifDto[],
        ];

        const versementsWithJSDate = versements.map(versement => {
            const versementWithDate: Partial<FonjepVersementDto> = {};
            if (isNumberValid(versement.PeriodeDebut)) {
                versementWithDate.PeriodeDebut = GenericParser.ExcelDateToJSDate(versement.PeriodeDebut);
            }
            if (isNumberValid(versement.PeriodeFin)) {
                versementWithDate.PeriodeFin = GenericParser.ExcelDateToJSDate(versement.PeriodeFin);
            }
            if (isNumberValid(versement.DateVersement)) {
                versementWithDate.DateVersement = GenericParser.ExcelDateToJSDate(versement.DateVersement);
            }
            return { ...versement, ...versementWithDate } as FonjepVersementDto;
        });

        const postesWithJSDate = postes.map(poste => {
            const posteWithDate: Partial<FonjepPosteDtoWithJSDate> = {};
            // DateFinTriennalite: GenericParser.ExcelDateToJSDate(poste.DateFinTriennalite),
            if (isNumberValid(poste.DateFinTriennalite)) {
                posteWithDate.DateFinTriennalite = GenericParser.ExcelDateToJSDate(poste.DateFinTriennalite);
            }
            return { ...poste, ...posteWithDate } as FonjepPosteDtoWithJSDate;
        });

        return {
            tiers,
            postes: postesWithJSDate,
            versements: versementsWithJSDate,
            typePoste,
            dispositifs,
        };
    }

    protected static getBuffer(file: string) {
        this.filePathValidator(file);

        console.log("Open and read file ...");

        return fs.readFileSync(file);
    }

    protected static filePathValidator(file: string) {
        if (!file) {
            throw new Error("Parse command need file args");
        }

        if (!fs.existsSync(file)) {
            throw new Error(`File not found ${file}`);
        }
        return true;
    }
}
