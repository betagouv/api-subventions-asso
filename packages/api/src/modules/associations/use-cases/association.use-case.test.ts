import { NotFoundError } from "core/build/errors/httpErrors/NotFoundErrors";
import DEFAULT_ASSOCIATION from "../../../../tests/__fixtures__/association.fixture";
import { BodaccPort } from "../../../adapters/outputs/api/bodacc/bodacc.port";
import { RnaSirenPort } from "../../../adapters/outputs/db/rna-siren/rna-siren.port";
import { RnaPort } from "../../../adapters/outputs/db/rna/rna.port";
import { SireneEstablishmentPort } from "../../../adapters/outputs/db/sirene/sirene-establishment.port";
import { SireneUniteLegalePort } from "../../../adapters/outputs/db/sirene/sirene-unite-legale.port";
import { UniteLegaleEntreprisePort } from "../../../adapters/outputs/db/unite-legale-entreprise/unite-legale-entreprise.port";
import { BODACC_ENTITY } from "../../../domain/__fixtures__/bodacc.fixture";
import { ESTABLISHMENT_ENTITY } from "../../../domain/__fixtures__/establishment.fixture";
import { RNA_ENTITY } from "../../../domain/__fixtures__/rna.fixture";
import {
    AssociationIdentifier,
    EstablishmentIdentifier,
    Rid,
    Ridet,
    Tahiti,
    Tahitiet,
} from "../../../identifier-objects";
import Rna from "../../../identifier-objects/Rna";
import Siren from "../../../identifier-objects/Siren";
import Siret from "../../../identifier-objects/Siret";
import { LEGAL_CATEGORIES_ACCEPTED } from "../../../shared/LegalCategoriesAccepted";
import { sirenStructureFixture } from "../../providers/api-asso/__fixtures__/SirenStructureFixture";
import { ApiAssoService } from "../../providers/api-asso/api-asso.service";
import { STOCK_UNITE_LEGALE_ENTITY } from "../../providers/sirene/@types/__fixtures__/sirene-stock-unite-legale.fixture";
import { CheckIdentifierIsFromAssoUseCase } from "./check-identifier-is-from-asso.use-case";
import { CheckSirenIsFromAssoUseCase } from "./check-siren-is-from-asso.use-case";
import { FindSiretFromAssociationIdentifierUseCase } from "./find-siret-from-association-identifier.use-case";
import { FindSiretFromRnaUseCase } from "./find-siret-from-rna.use-case";
import { FindSiretFromSirenUseCase } from "./find-siret-from-siren.use-case";
import { GetAssociation } from "./get-association";
import { GetIdentifierFromStringUseCase } from "./get-identifier-from-string.use-case";
import { GetRnaStructureData } from "./get-rna-structure-data";
import { GetSirenStructureData } from "./get-siren-structure-data";

describe("Association Use Cases", () => {
    const RNA = new Rna(DEFAULT_ASSOCIATION.rna);
    const SIREN = new Siren(DEFAULT_ASSOCIATION.siren);
    const SIRET = new Siret(DEFAULT_ASSOCIATION.siret);

    describe("FindSiretFromAssociationIdentifier", () => {
        const mockFindFromRna = { execute: jest.fn() };
        const mockFindFromSiren = { execute: jest.fn() };
        // @ts-expect-error: inject mock
        const useCase = new FindSiretFromAssociationIdentifierUseCase(mockFindFromRna, mockFindFromSiren);

        it("retrieves siret from rna", () => {
            useCase.execute(RNA);
            expect(mockFindFromRna.execute).toHaveBeenCalledWith(RNA);
        });

        it("retrieves siret from siren", () => {
            useCase.execute(SIREN);
            expect(mockFindFromSiren.execute).toHaveBeenCalledWith(SIREN);
        });

        it.each([RNA, SIREN])("return siret", async identifier => {
            mockFindFromSiren.execute.mockResolvedValue(SIRET);
            mockFindFromRna.execute.mockResolvedValue(SIRET);
            const expected = SIRET;
            const actual = await useCase.execute(identifier);
            expect(actual).toEqual(expected);
        });
    });

    describe("CheckIdenfifierIsFromAsso", () => {
        const mockCheckSirenIsAsso = { execute: jest.fn().mockResolvedValue(true) };
        // @ts-expect-error: inject mock
        const useCase = new CheckIdentifierIsFromAssoUseCase(mockCheckSirenIsAsso);
        it("returns true when idenfitier is Rna", async () => {
            const expected = true;
            const identifier = new Rna(DEFAULT_ASSOCIATION.rna);
            const actual = await useCase.execute(identifier);
            expect(actual).toEqual(expected);
        });

        it.each([
            { _name: Rid.getName(), identifier: new Rid("1234567") },
            { _name: Ridet.getName(), identifier: new Ridet("1234567890") },
            { _name: Tahiti.getName(), identifier: new Tahiti("A12345") },
            { _name: Tahitiet.getName(), identifier: new Tahitiet("A12345678") },
        ])("returns true with not handled identifiers ($_name)", async ({ _name, identifier }) => {
            const expected = true;
            const actual = await useCase.execute(identifier);
            expect(actual).toEqual(expected);
        });

        it.each([new Siren(DEFAULT_ASSOCIATION.siren), new Siret(DEFAULT_ASSOCIATION.siret)])(
            "checks if siren is from asso",
            async identifier => {
                const siren = new Siren(DEFAULT_ASSOCIATION.siren);
                await useCase.execute(identifier);
                expect(mockCheckSirenIsAsso.execute).toHaveBeenCalledWith(siren);
            },
        );

        it("returns true when siren is from asso", async () => {
            const expected = true;
            const siren = new Siren(DEFAULT_ASSOCIATION.siren);
            const actual = await useCase.execute(siren);
            expect(actual).toEqual(expected);
        });

        it("returns false when siren is not from asso", async () => {
            mockCheckSirenIsAsso.execute.mockResolvedValueOnce(false);
            const expected = false;
            const siren = new Siren(DEFAULT_ASSOCIATION.siren);
            const actual = await useCase.execute(siren);
            expect(actual).toEqual(expected);
        });
    });

    describe("CheckSirenIsFromAsso", () => {
        const mockSirenePort = {
            findOneBySiren: jest.fn().mockResolvedValue({}),
        } as unknown as SireneUniteLegalePort;
        const mockEntreprisePort = {
            findOneBySiren: jest.fn().mockResolvedValue({}),
        } as unknown as UniteLegaleEntreprisePort;
        const mockRnaSirenPort = { find: jest.fn().mockResolvedValue([]) } as unknown as RnaSirenPort;
        const mockApiAssoService = {
            findAssociationBySiren: jest
                .fn()
                .mockResolvedValue({ categorie_juridique: [{ value: LEGAL_CATEGORIES_ACCEPTED[0] }] }),
        } as unknown as ApiAssoService;

        const useCase = new CheckSirenIsFromAssoUseCase(
            mockSirenePort,
            mockRnaSirenPort,
            mockEntreprisePort,
            mockApiAssoService,
        );

        beforeAll(() => {
            jest.mocked(mockSirenePort.findOneBySiren).mockResolvedValue(null);
            jest.mocked(mockRnaSirenPort.find).mockResolvedValue([]);
            jest.mocked(mockEntreprisePort.findOneBySiren).mockResolvedValue(null);
            jest.mocked(mockApiAssoService.findAssociationBySiren).mockResolvedValue({ categorie_juridique: [] });
        });

        it("checks in sirene collection", async () => {
            await useCase.execute(SIREN);
            expect(mockSirenePort.findOneBySiren).toHaveBeenCalledWith(SIREN);
        });

        it("returns true when match from sirene ", async () => {
            // @ts-expect-error: mock resolved value
            jest.mocked(mockSirenePort.findOneBySiren).mockResolvedValueOnce({});
            const expected = true;
            const actual = await useCase.execute(SIREN);
            expect(actual).toEqual(expected);
        });

        it("checks in rna-siren", async () => {
            await useCase.execute(SIREN);
            expect(mockRnaSirenPort.find).toHaveBeenCalledWith(SIREN);
        });

        it("returns true when siren is found from rna-siren", async () => {
            jest.mocked(mockRnaSirenPort.find).mockResolvedValueOnce([{ siren: SIREN, rna: RNA }]);
            const actual = await useCase.execute(SIREN);
            expect(actual).toEqual(true);
        });

        it("checks in entreprise collection", async () => {
            await useCase.execute(SIREN);
            expect(mockEntreprisePort.findOneBySiren).toHaveBeenCalledWith(SIREN);
        });

        it("returns false when match from entreprise ", async () => {
            const expected = false;
            const actual = await useCase.execute(SIREN);
            expect(actual).toEqual(expected);
        });

        it("fall back to api asso", async () => {
            await useCase.execute(SIREN);
            expect(mockApiAssoService.findAssociationBySiren).toHaveBeenCalledWith(SIREN);
        });

        it("returns false when structure from api asso does not match expected legal category", async () => {
            const expected = false;
            const actual = await useCase.execute(SIREN);
            expect(actual).toEqual(expected);
        });

        it("returns true when structure from api asso match legal category", async () => {
            jest.mocked(mockApiAssoService.findAssociationBySiren).mockResolvedValueOnce({
                // @ts-expect-error: mock provider value
                categorie_juridique: [{ value: "9220" }],
            });
            const expected = true;
            const actual = await useCase.execute(SIREN);
            expect(actual).toEqual(expected);
        });
    });

    describe("FindSiretFromRna", () => {
        const mockRnaSiren = {
            find: jest.fn().mockResolvedValue([{ siren: SIREN, rna: RNA }]),
        };
        const mockSirenePort = {
            findOneByRna: jest.fn().mockResolvedValue(STOCK_UNITE_LEGALE_ENTITY),
            findOneBySiren: jest.fn().mockResolvedValue(STOCK_UNITE_LEGALE_ENTITY),
        };

        // @ts-expect-error: inject mock
        const useCase = new FindSiretFromRnaUseCase(mockRnaSiren, mockSirenePort);

        it("find siren from rna-siren collection", () => {
            useCase.execute(RNA);
            expect(mockRnaSiren.find).toHaveBeenCalledWith(RNA);
        });

        it("find nic with siren from sirene unite legale", async () => {
            await useCase.execute(RNA);
            expect(mockSirenePort.findOneBySiren).toHaveBeenCalledWith(SIREN);
        });

        it("find siren unite legale from sirene when rna-siren does not match", async () => {
            mockRnaSiren.find.mockResolvedValueOnce(null);
            await useCase.execute(RNA);
            expect(mockSirenePort.findOneByRna).toHaveBeenCalledWith(RNA);
        });

        it("returns siret from unite legale", async () => {
            mockRnaSiren.find.mockResolvedValueOnce(null);
            const expected = SIRET;
            const actual = await useCase.execute(RNA);
            expect(actual).toEqual(expected);
        });
    });

    describe("FindSiretFromSiren", () => {
        const mockSirenePort = {
            findOneBySiren: jest.fn().mockResolvedValue(STOCK_UNITE_LEGALE_ENTITY),
        };

        // @ts-expect-error inject mock
        const useCase = new FindSiretFromSirenUseCase(mockSirenePort);

        it("find unite legale", () => {
            useCase.execute(SIREN);
            expect(mockSirenePort.findOneBySiren).toHaveBeenCalledWith(SIREN);
        });

        it("returns siret from unite legale", async () => {
            const expected = SIRET;
            const actual = await useCase.execute(SIREN);
            expect(actual).toEqual(expected);
        });
    });

    describe("GetIdentifierFromString", () => {
        jest.spyOn(EstablishmentIdentifier, "buildIdentifierFromString");
        jest.spyOn(AssociationIdentifier, "buildIdentifierFromString");
        const SIRET_STR = DEFAULT_ASSOCIATION.siret;
        const SIREN_STR = DEFAULT_ASSOCIATION.siren;
        const useCase = new GetIdentifierFromStringUseCase();
        it("try to build identifier from establishement identifier", () => {
            useCase.execute(SIRET_STR);
            expect(EstablishmentIdentifier.buildIdentifierFromString).toHaveBeenCalledWith(SIRET_STR);
        });

        it("try to build identifier from association identifier", () => {
            useCase.execute(SIREN_STR);
            expect(AssociationIdentifier.buildIdentifierFromString).toHaveBeenCalledWith(SIREN_STR);
        });

        it.each([
            { _type: EstablishmentIdentifier.name, str: SIRET_STR, expected: new Siret(SIRET_STR) },
            { _type: AssociationIdentifier.name, str: SIREN_STR, expected: new Siren(SIREN_STR) },
        ])("returns $_type identifier", ({ _type, str, expected }) => {
            const actual = useCase.execute(str);
            expect(actual).toEqual(expected);
        });

        it("returns siren over ridet if string is 9 numbers long", () => {
            const STR = "123456789";
            const expected = new Siren(STR);
            const actual = useCase.execute(STR);
            expect(actual).toEqual(expected);
        });

        it("return null if given string match no identifier format", () => {
            const expected = null;
            const actual = useCase.execute("nothing");
            expect(actual).toEqual(expected);
        });
    });

    describe("GetRnaStructureData", () => {
        const RNA = new Rna(DEFAULT_ASSOCIATION.rna);
        const mockRnaPort = {
            getByRna: jest.fn(),
        } as unknown as jest.Mocked<RnaPort>;

        const mockApiAssoService = { findAssociationByRna: jest.fn() } as unknown as ApiAssoService;
        const useCase = new GetRnaStructureData(mockRnaPort, mockApiAssoService);

        it("returns data from rna", async () => {
            mockRnaPort.getByRna.mockResolvedValue(RNA_ENTITY);
            const actual = await useCase.execute(RNA);
            expect(actual).toMatchSnapshot();
        });
    });

    describe("GetSirenStructureData", () => {
        const SIREN = new Siren(DEFAULT_ASSOCIATION.siren);
        const mockBodaccPort = {
            getRecordsBySiren: jest.fn().mockResolvedValue(BODACC_ENTITY),
        } as unknown as jest.Mocked<BodaccPort>;
        const mockUniteLegalePort = {
            findOneBySiren: jest.fn().mockResolvedValue(STOCK_UNITE_LEGALE_ENTITY),
        } as unknown as jest.Mocked<SireneUniteLegalePort>;
        const mockEstablishmentPort = {
            getAllBySiren: jest.fn().mockResolvedValue(ESTABLISHMENT_ENTITY),
        } as unknown as jest.Mocked<SireneEstablishmentPort>;
        const mockApiAssoService = {
            findAssociationBySiren: jest.fn().mockResolvedValue(sirenStructureFixture),
        } as unknown as jest.Mocked<ApiAssoService>;

        const useCase = new GetSirenStructureData(
            mockBodaccPort,
            mockUniteLegalePort,
            mockEstablishmentPort,
            mockApiAssoService,
        );

        it("fetches bodacc data ", async () => {
            await useCase.execute(SIREN);
            expect(mockBodaccPort.getRecordsBySiren).toHaveBeenCalledWith(SIREN);
        });

        it("fetches sirene unite legale data ", async () => {
            await useCase.execute(SIREN);
            expect(mockUniteLegalePort.findOneBySiren).toHaveBeenCalledWith(SIREN);
        });

        it("fetches establishment data ", async () => {
            await useCase.execute(SIREN);
            expect(mockEstablishmentPort.getAllBySiren).toHaveBeenCalledWith(SIREN);
        });

        it("returns association data", async () => {
            const actual = await useCase.execute(SIREN);
            expect(actual).toMatchSnapshot({
                bodacc: [
                    {
                        last_update: expect.any(Date),
                    },
                ],
            });
        });

        it("falls back to api asso when no unite legale found", async () => {
            mockUniteLegalePort.findOneBySiren.mockResolvedValueOnce(null);
            await useCase.execute(SIREN);
            expect(mockApiAssoService.findAssociationBySiren).toHaveBeenCalledWith(SIREN);
        });

        it("returns api asso data when no unite legale found", async () => {
            mockUniteLegalePort.findOneBySiren.mockResolvedValueOnce(null);
            const actual = await useCase.execute(SIREN);
            expect(actual).toMatchSnapshot({
                bodacc: [
                    {
                        last_update: expect.any(Date),
                    },
                ],
            });
        });
    });

    describe("GetAssociation", () => {
        const ASSO_IDENTIFIER = AssociationIdentifier.fromSirenAndRna(
            new Siren(DEFAULT_ASSOCIATION.siren),
            new Rna(DEFAULT_ASSOCIATION.rna),
        );

        const mockGetRnaData = {
            execute: jest.fn().mockResolvedValue({ rna: "rna" }),
        } as unknown as jest.Mocked<GetRnaStructureData>;
        const mockGetSirenData = {
            execute: jest.fn().mockResolvedValue({ siren: "siren" }),
        } as unknown as jest.Mocked<GetSirenStructureData>;

        const useCase = new GetAssociation(mockGetRnaData, mockGetSirenData);

        it("fetches rna data when identifier has a rna defined", async () => {
            await useCase.execute(ASSO_IDENTIFIER);
            expect(mockGetRnaData.execute).toHaveBeenCalledWith(ASSO_IDENTIFIER.rna);
        });

        it("fetches siren data when identifier has a siren defined", async () => {
            await useCase.execute(ASSO_IDENTIFIER);
            expect(mockGetSirenData.execute).toHaveBeenCalledWith(ASSO_IDENTIFIER.siren);
        });

        it("returns a merge of association found", async () => {
            const expected = { rna: "rna", siren: "siren" };
            const actual = await useCase.execute(ASSO_IDENTIFIER);
            expect(actual).toEqual(expected);
        });

        it("returns only siren association when rna return null", async () => {
            const expected = { siren: "siren" };
            mockGetRnaData.execute.mockResolvedValueOnce(null);
            const actual = await useCase.execute(ASSO_IDENTIFIER);
            expect(actual).toEqual(expected);
        });

        it("returns only rna association when siren return null", async () => {
            const expected = { rna: "rna" };
            mockGetSirenData.execute.mockResolvedValueOnce(null);
            const actual = await useCase.execute(ASSO_IDENTIFIER);
            expect(actual).toEqual(expected);
        });

        it("throws when neither rna or siren return data", async () => {
            mockGetRnaData.execute.mockResolvedValueOnce(null);
            mockGetSirenData.execute.mockResolvedValueOnce(null);
            expect(async () => await useCase.execute(ASSO_IDENTIFIER)).rejects.toThrow(
                new NotFoundError("Association not found"),
            );
        });
    });
});
