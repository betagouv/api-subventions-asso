import SubventiaCli from "./Subventia.cli";
import subventiaService from "../../modules/providers/subventia/subventia.service";
jest.mock("../../modules/providers/subventia/subventia.service");
import * as CliHelper from "../../shared/helpers/CliHelper";
import { SubventiaDbo } from "../../modules/providers/subventia/@types/subventia.entity";
import { ApplicationStatus } from "dto";
jest.mock("../../shared/helpers/CliHelper");

const MOCK_ENTITIES: Omit<SubventiaDbo, "_id">[] = [
    {
        service_instructeur: "Service 1",
        annee_demande: 2022,
        siret: "12345678901234",
        date_commision: new Date(2022, 1, 1),
        montants_accorde: 1000,
        montants_demande: 2000,
        dispositif: "Dispositif 1",
        sous_dispositif: "Sous-dispositif 1",
        status: ApplicationStatus.REFUSED,
        reference_demande: "Ref 1",
        provider: "Provider 1",
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
        date_commision: new Date(2023, 2, 2),
        montants_accorde: 3000,
        montants_demande: 4000,
        dispositif: "Dispositif 2",
        sous_dispositif: "Sous-dispositif 2",
        status: ApplicationStatus.GRANTED,
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

describe("SubventiaCli", () => {
    let subventiaCli: SubventiaCli;

    const mockFile = "mockFile";
    const mockLogs = "mockLogs";
    const mockExportDate = new Date();

    beforeAll(() => {
        subventiaCli = new SubventiaCli();

        (subventiaService.processSubventiaData as jest.Mock).mockReturnValue(MOCK_ENTITIES);
        (subventiaService.createEntity as jest.Mock).mockResolvedValue(true);
        (CliHelper.printProgress as jest.Mock).mockReturnValue(true);
    });

    it("should call ProcessSubventiaData", async () => {
        //@ts-expect-error
        await subventiaCli._parse(mockFile, mockLogs, mockExportDate);
        expect(subventiaService.processSubventiaData).toHaveBeenCalledWith(mockFile);
    });

    it.each`
        fn
        ${subventiaService.createEntity}
        ${CliHelper.printProgress}
    `("should call $fn several times", async ({ fn }) => {
        // @ts-expect-error: protected
        await subventiaCli._parse(mockFile, mockLogs, mockExportDate);
        expect(fn).toHaveBeenCalledTimes(MOCK_ENTITIES.length);
    });

    it("should call createEntity with each entity", async () => {
        // @ts-expect-error: protected
        await subventiaCli._parse(mockFile, mockLogs, mockExportDate);
        MOCK_ENTITIES.forEach(entity => {
            expect(subventiaService.createEntity).toHaveBeenCalledWith(entity);
        });
    });

    it("should call printProgress with each index", async () => {
        // @ts-expect-error: protected
        await subventiaCli._parse(mockFile, mockLogs, mockExportDate);
        MOCK_ENTITIES.forEach((_, index) => {
            expect(CliHelper.printProgress).toHaveBeenCalledWith(index + 1, MOCK_ENTITIES.length);
        });
    });
});
