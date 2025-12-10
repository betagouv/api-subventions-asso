import SubventiaCli from "./Subventia.cli";
import subventiaService from "../../modules/providers/subventia/subventia.service";
jest.mock("csv-stringify/sync", () => ({
    stringify: jest.fn(() => ""),
}));
jest.mock("fs");
jest.mock("../../modules/providers/subventia/subventia.service");
import * as CliHelper from "../../shared/helpers/CliHelper";
import { SubventiaDbo } from "../../modules/providers/subventia/@types/subventia.entity";
import { ApplicationStatus } from "dto";
jest.mock("../../shared/helpers/CliHelper");
import { ParsedDataWithProblem } from "../../modules/providers/subventia/validators/@types/Validation";
import * as csvSyncStringifier from "csv-stringify/sync";
import fs from "fs";
import { normalize } from "path";

const MOCK_ENTITIES: Omit<SubventiaDbo, "_id">[] = [
    {
        service_instructeur: "Service 1",
        annee_demande: 2022,
        siret: "12345678901234",
        date_commission: new Date(2022, 1, 1),
        montants_accorde: 1000,
        montants_demande: 2000,
        dispositif: "Dispositif 1",
        sous_dispositif: "Sous-dispositif 1",
        statut_label: ApplicationStatus.REFUSED,
        status: "Refused",
        reference_demande: "Ref 1",
        provider: "Provider 1",
        updateDate: new Date("2022-01-01"),
        __data__: [
            {
                "Financeur Principal": "Financeur 1",
                "Référence administrative - Demande": "Ref 1",
                annee_demande: "2022",
                "SIRET - Demandeur": "12345678901234",
                "Date - Décision": "2022-01-01",
                "Montant voté TTC - Décision": 1000,
                "Montant Ttc": 2000,
                "Dispositif - Dossier de financement": "Dispositif 1",
                "Thematique Title": "Thematique 1",
                "Statut - Dossier de financement": "Statut 1",
            },
            {
                "Financeur Principal": "Financeur 2",
                "Référence administrative - Demande": "Ref 2",
                annee_demande: "2023",
                "SIRET - Demandeur": "23456789012345",
                "Date - Décision": "2023-02-02",
                "Montant voté TTC - Décision": 3000,
                "Montant Ttc": 4000,
                "Dispositif - Dossier de financement": "Dispositif 2",
                "Thematique Title": "Thematique 2",
                "Statut - Dossier de financement": "Statut 2",
            },
        ],
    },
    {
        service_instructeur: "Service 2",
        annee_demande: 2023,
        siret: "23456789012345",
        date_commission: new Date(2023, 2, 2),
        montants_accorde: 3000,
        montants_demande: 4000,
        dispositif: "Dispositif 2",
        sous_dispositif: "Sous-dispositif 2",
        statut_label: ApplicationStatus.GRANTED,
        status: "Granted",
        updateDate: new Date("2023-02-02"),
        reference_demande: "Ref 2",
        provider: "Provider 2",
        __data__: [
            {
                "Financeur Principal": "Financeur 1",
                "Référence administrative - Demande": "Ref 1",
                annee_demande: "2022",
                "SIRET - Demandeur": "12345678901234",
                "Date - Décision": "2022-01-01",
                "Montant voté TTC - Décision": 1000,
                "Montant Ttc": 2000,
                "Dispositif - Dossier de financement": "Dispositif 1",
                "Thematique Title": "Thematique 1",
                "Statut - Dossier de financement": "Statut 1",
            },
            {
                "Financeur Principal": "Financeur 2",
                "Référence administrative - Demande": "Ref 2",
                annee_demande: "2023",
                "SIRET - Demandeur": "23456789012345",
                "Date - Décision": "2023-02-02",
                "Montant voté TTC - Décision": 3000,
                "Montant Ttc": 4000,
                "Dispositif - Dossier de financement": "Dispositif 2",
                "Thematique Title": "Thematique 2",
                "Statut - Dossier de financement": "Statut 2",
            },
            {
                "Financeur Principal": "Financeur 3",
                "Référence administrative - Demande": "Ref 3",
                annee_demande: "2024",
                "SIRET - Demandeur": "34567890123456",
                "Date - Décision": "2024-03-03",
                "Montant voté TTC - Décision": 5000,
                "Montant Ttc": 6000,
                "Dispositif - Dossier de financement": "Dispositif 3",
                "Thematique Title": "Thematique 3",
                "Statut - Dossier de financement": "Statut 3",
            },
        ],
    },
];

const PROCESSED_DATA = { applications: MOCK_ENTITIES, invalids: [] };

describe("SubventiaCli", () => {
    let subventiaCli: SubventiaCli;

    const mockFile = "mockFile";
    const mockLogs = "mockLogs";
    const mockExportDate = new Date();

    beforeAll(() => {
        subventiaCli = new SubventiaCli();

        (subventiaService.processSubventiaData as jest.Mock).mockReturnValue(PROCESSED_DATA);
        (subventiaService.createEntity as jest.Mock).mockResolvedValue(true);
        (CliHelper.printProgress as jest.Mock).mockReturnValue(true);
    });

    describe("_parse", () => {
        let mockPersistEntities: jest.SpyInstance;
        let mockExportErrors: jest.SpyInstance;
        beforeAll(() => {
            //@ts-expect-error -- test private method
            mockPersistEntities = jest.spyOn(subventiaCli, "persistEntities").mockResolvedValue(Promise.resolve());
            //@ts-expect-error -- test private method
            mockExportErrors = jest.spyOn(subventiaCli, "exportErrors").mockResolvedValue(Promise.resolve());
        });

        afterAll(() => {
            mockPersistEntities.mockRestore();
            mockExportErrors.mockRestore();
        });

        it("should call ProcessSubventiaData", async () => {
            //@ts-expect-error: mock
            await subventiaCli._parse(mockFile, mockLogs, mockExportDate);
            expect(subventiaService.processSubventiaData).toHaveBeenCalledWith(mockFile, mockExportDate);
        });

        it("should call persistEntities", async () => {
            //@ts-expect-error: mock
            await subventiaCli._parse(mockFile, mockLogs, mockExportDate);
            expect(mockPersistEntities).toHaveBeenCalledWith(MOCK_ENTITIES);
        });

        it("should call exportErrors", async () => {
            //@ts-expect-error: mock
            await subventiaCli._parse(mockFile, mockLogs, mockExportDate);
            expect(mockExportErrors).toHaveBeenCalledWith([], mockFile);
        });
    });

    describe("persistEntities", () => {
        it.each`
            fn
            ${subventiaService.createEntity}
            ${CliHelper.printProgress}
        `("should call $fn several times", async ({ fn }) => {
            // @ts-expect-error: protected
            await subventiaCli.persistEntities(MOCK_ENTITIES);
            expect(fn).toHaveBeenCalledTimes(MOCK_ENTITIES.length);
        });

        it("should call createEntity with each entity", async () => {
            // @ts-expect-error: protected
            await subventiaCli.persistEntities(MOCK_ENTITIES);
            MOCK_ENTITIES.forEach(entity => {
                expect(subventiaService.createEntity).toHaveBeenCalledWith(entity);
            });
        });

        it("should call printProgress with each index", async () => {
            // @ts-expect-error: protected
            await subventiaCli.persistEntities(MOCK_ENTITIES);
            MOCK_ENTITIES.forEach((_, index) => {
                expect(CliHelper.printProgress).toHaveBeenCalledWith(index + 1, MOCK_ENTITIES.length);
            });
        });
    });

    describe("exportErrors", () => {
        const ERRORS: ParsedDataWithProblem[] = [
            { error: "error", "Date - Décision": null } as unknown as ParsedDataWithProblem,
        ];
        const FILE = "path/subventia";
        const STR_CONTENT = "content";
        // normalize for windows and linux compatilibity
        const OUTPUT_PATH = normalize("import-errors/subventia-Errors.csv");

        beforeAll(() => {
            jest.mocked(csvSyncStringifier.stringify).mockReturnValue(STR_CONTENT);
        });

        afterAll(() => {
            jest.mocked(csvSyncStringifier.stringify).mockRestore();
        });

        it("creates folder if it doesn't exist", async () => {
            jest.mocked(fs.existsSync).mockReturnValueOnce(false);
            // @ts-expect-error: protected
            await subventiaCli.exportErrors(ERRORS, FILE);
            expect(fs.mkdirSync).toHaveBeenCalledWith(SubventiaCli.errorsFolderName);
        });

        it("doesn't create folder if it exists", async () => {
            jest.mocked(fs.existsSync).mockReturnValueOnce(true);
            // @ts-expect-error: protected
            await subventiaCli.exportErrors(ERRORS, FILE);
            expect(fs.mkdirSync).not.toHaveBeenCalled();
        });

        it("stringifies errors", async () => {
            // @ts-expect-error: protected
            await subventiaCli.exportErrors(ERRORS, FILE);
            expect(csvSyncStringifier.stringify).toHaveBeenCalledWith(ERRORS, { header: true });
        });

        it("writes in proper path", async () => {
            // @ts-expect-error: protected
            await subventiaCli.exportErrors(ERRORS, FILE);
            expect(fs.writeFileSync).toHaveBeenCalledWith(OUTPUT_PATH, STR_CONTENT, { flag: "w", encoding: "utf-8" });
        });
    });

    describe("initApplicationFlat", () => {
        it("calls subventia service", async () => {
            await subventiaCli.initApplicationFlat();
            expect(subventiaService.initApplicationFlat).toHaveBeenCalled();
        });
    });
});
