import chorusService, { ChorusService } from "./chorus.service";
import chorusLineRepository from "./repositories/chorus.line.repository";
jest.mock("./repositories/chorus.line.repository");
const mockedChorusLineRepository = jest.mocked(chorusLineRepository);
import ChorusAdapter from "./adapters/ChorusAdapter";
jest.mock("./adapters/ChorusAdapter");
import uniteLegalEntreprisesSerivce from "../uniteLegalEntreprises/uniteLegal.entreprises.service";
jest.mock("../uniteLegalEntreprises/uniteLegal.entreprises.service");
const mockedUniteLegalEntreprisesSerivce = jest.mocked(uniteLegalEntreprisesSerivce);
import * as StringHelper from "../../../shared/helpers/StringHelper";
jest.mock("../../../shared/helpers/StringHelper");
const mockedStringHelper = jest.mocked(StringHelper);
import rnaSirenService from "../../rna-siren/rnaSiren.service";
jest.mock("../../rna-siren/rnaSiren.service");

jest.mock("../../_open-data/rna-siren/rnaSiren.service");
const mockedRnaSirenService = jest.mocked(rnaSirenService);
import { ENTITIES } from "./__fixutres__/ChorusFixtures";

describe("chorusService", () => {
    describe("insertMany", () => {
        it("should call repository with entities", async () => {
            await chorusService.insertMany(ENTITIES);
            expect(mockedChorusLineRepository.insertMany).toHaveBeenCalledWith(ENTITIES);
        });
    });

    describe("getVersementsBySiret", () => {
        beforeAll(() => {
            mockedChorusLineRepository.findBySiret.mockResolvedValue([ENTITIES[0], ENTITIES[0]]);
        });

        afterEach(() => mockedChorusLineRepository.findBySiret.mockClear());

        afterAll(() => mockedChorusLineRepository.findBySiret.mockReset());

        const SIRET = ENTITIES[0].indexedInformations.siret;
        it("should call chorusLineRepository.findBySiret()", async () => {
            await chorusService.getVersementsBySiret(SIRET);
            expect(mockedChorusLineRepository.findBySiret).toHaveBeenCalledWith(SIRET);
        });
        it("should call ChorusAdapter.toVersement for each document", async () => {
            await chorusService.getVersementsBySiret(SIRET);
            expect(ChorusAdapter.toVersement).toHaveBeenCalledTimes(2);
        });
    });

    describe("getVersementsBySiren", () => {
        beforeAll(() => {
            mockedChorusLineRepository.findBySiren.mockResolvedValue([ENTITIES[0], ENTITIES[0]]);
        });

        afterEach(() => mockedChorusLineRepository.findOneBySiren.mockClear());

        afterAll(() => mockedChorusLineRepository.findBySiren.mockReset());

        const SIREN = ENTITIES[0].indexedInformations.siret.substring(0, 9);
        it("should call chorusLineRepository.findBySiren()", async () => {
            await chorusService.getVersementsBySiren(SIREN);
            expect(mockedChorusLineRepository.findBySiren).toHaveBeenCalledWith(SIREN);
        });
        it("should call ChorusAdapter.toVersement for each document", async () => {
            await chorusService.getVersementsBySiren(SIREN);
            expect(ChorusAdapter.toVersement).toHaveBeenCalledTimes(2);
        });
    });

    describe("getVersementsByKey", () => {
        beforeAll(() => {
            mockedChorusLineRepository.findByEJ.mockResolvedValue([ENTITIES[0], ENTITIES[0]]);
        });

        afterEach(() => mockedChorusLineRepository.findByEJ.mockClear());

        afterAll(() => mockedChorusLineRepository.findByEJ.mockReset());

        const EJ = ENTITIES[0].indexedInformations.ej;
        it("should call chorusLineRepository.findByEJ()", async () => {
            await chorusService.getVersementsByKey(EJ);
            expect(mockedChorusLineRepository.findByEJ).toHaveBeenCalledWith(EJ);
        });
        it("should call ChorusAdapter.toVersement for each document", async () => {
            await chorusService.getVersementsByKey(EJ);
            expect(ChorusAdapter.toVersement).toHaveBeenCalledTimes(2);
        });
    });

    describe("sirenBelongAsso", () => {
        const SIREN = ENTITIES[0].indexedInformations.siret.substring(0, 9);

        beforeEach(() => {
            mockedUniteLegalEntreprisesSerivce.isEntreprise.mockResolvedValue(false);
            mockedRnaSirenService.find.mockResolvedValue(null);
            // @ts-expect-error: mock resolve value
            mockedChorusLineRepository.findOneBySiren.mockResolvedValue(ENTITIES[0]);
        });

        afterAll(() => {
            mockedUniteLegalEntreprisesSerivce.isEntreprise.mockReset();
            mockedRnaSirenService.find.mockReset();
            mockedChorusLineRepository.findOneBySiren.mockReset();
        });

        it("should return false if siren belongs to company", async () => {
            mockedUniteLegalEntreprisesSerivce.isEntreprise.mockResolvedValueOnce(true);
            const expected = false;
            const actual = await chorusService.sirenBelongAsso(SIREN);
            expect(actual).toEqual(expected);
        });

        it("should return true if a RNA is found", async () => {
            mockedRnaSirenService.find.mockResolvedValueOnce([{ rna: "W7000065", siren: SIREN }]);
            const expected = true;
            const actual = await chorusService.sirenBelongAsso(SIREN);
            expect(actual).toEqual(expected);
        });

        it("should call chorusLineRepository.findOneBySiren()", async () => {
            await chorusService.sirenBelongAsso(SIREN);
            expect(mockedChorusLineRepository.findOneBySiren).toHaveBeenCalledWith(SIREN);
        });

        it("should return true if document is found", async () => {
            const expected = true;
            const actual = await chorusService.sirenBelongAsso(SIREN);
            expect(actual).toEqual(expected);
        });

        it("should return true if document is not found", async () => {
            mockedChorusLineRepository.findOneBySiren.mockResolvedValueOnce(null);
            const expected = false;
            const actual = await chorusService.sirenBelongAsso(SIREN);
            expect(actual).toEqual(expected);
        });
    });

    describe("raw grant", () => {
        const DATA = [{ indexedInformations: { ej: "EJ" } }];

        describe("getRawGrantsBySiret", () => {
            const SIRET = "12345678900000";
            let findBySiretMock;
            beforeAll(
                () =>
                    (findBySiretMock = jest
                        .spyOn(chorusLineRepository, "findBySiret")
                        // @ts-expect-error: mock
                        .mockImplementation(jest.fn(() => DATA))),
            );
            afterAll(() => findBySiretMock.mockRestore());

            it("should call findBySiret()", async () => {
                await chorusService.getRawGrantsBySiret(SIRET);
                expect(findBySiretMock).toHaveBeenCalledWith(SIRET);
            });

            it("returns raw grant data", async () => {
                const actual = await chorusService.getRawGrantsBySiret(SIRET);
                expect(actual).toMatchInlineSnapshot(`
                    Array [
                      Object {
                        "data": Object {
                          "indexedInformations": Object {
                            "ej": "EJ",
                          },
                        },
                        "joinKey": "EJ",
                        "provider": "chorus",
                        "type": "payment",
                      },
                    ]
                `);
            });
        });

        describe("getRawGrantsBySiren", () => {
            const SIREN = "123456789";
            let findBySirenMock;
            beforeAll(
                () =>
                    (findBySirenMock = jest
                        .spyOn(chorusLineRepository, "findBySiren")
                        // @ts-expect-error: mock
                        .mockImplementation(jest.fn(() => DATA))),
            );
            afterAll(() => findBySirenMock.mockRestore());

            it("should call findBySiren()", async () => {
                await chorusService.getRawGrantsBySiren(SIREN);
                expect(findBySirenMock).toHaveBeenCalledWith(SIREN);
            });

            it("returns raw grant data", async () => {
                const actual = await chorusService.getRawGrantsBySiren(SIREN);
                expect(actual).toMatchInlineSnapshot(`
                    Array [
                      Object {
                        "data": Object {
                          "indexedInformations": Object {
                            "ej": "EJ",
                          },
                        },
                        "joinKey": "EJ",
                        "provider": "chorus",
                        "type": "payment",
                      },
                    ]
                `);
            });
        });
    });

    describe("rawToCommon", () => {
        const RAW = "RAW";
        const ADAPTED = {};

        beforeAll(() => {
            ChorusAdapter.toCommon
                // @ts-expect-error: mock
                .mockImplementation(input => input.toString());
        });

        afterAll(() => {
            // @ts-expect-error: mock
            ChorusAdapter.toCommon.mockReset();
        });

        it("calls adapter with data from raw grant", () => {
            // @ts-expect-error: mock
            chorusService.rawToCommon({ data: RAW });
            expect(ChorusAdapter.toCommon).toHaveBeenCalledWith(RAW);
        });
        it("returns result from adapter", () => {
            // @ts-expect-error: mock
            ChorusAdapter.toCommon.mockReturnValueOnce(ADAPTED);
            const expected = ADAPTED;
            // @ts-expect-error: mock
            const actual = chorusService.rawToCommon({ data: RAW });
            expect(actual).toEqual(expected);
        });
    });

    describe("getMostRecentOperationDate", () => {
        it("should call repository.findMostRecentOperationDate", async () => {
            await chorusService.getMostRecentOperationDate();
            expect(mockedChorusLineRepository.findMostRecentOperationDate).toHaveBeenCalledTimes(1);
        });
    });
});
