import OsirisRequestAdapter from "./adapters/OsirisRequestAdapter";
import osirisService from "./osiris.service";
import { osirisRequestRepository } from "./repositories";

const toDemandeSubventionMock = jest.spyOn(OsirisRequestAdapter, "toDemandeSubvention");
jest.mock("./adapters/OsirisRequestAdapter");

describe("OsirisService", () => {
    beforeAll(() => {
        // @ts-expect-error: mock
        toDemandeSubventionMock.mockImplementation(entity => entity);
    });

    afterAll(() => {
        toDemandeSubventionMock.mockRestore();
    });

    describe("getAssociationsByRna", () => {
        const findByRnaMock = jest.spyOn(osirisRequestRepository, "findByRna");

        it("should call osirisRequestRepository.findByRna()", async () => {
            findByRnaMock.mockImplementationOnce(async () => []);
            await osirisService.getAssociationsByRna("W12345678");
        });
    });

    describe("rawToApplication", () => {
        // @ts-expect-error: parameter type
        const RAW_APPLICATION: RawApplication = { data: { foo: "bar" } };
        // @ts-expect-error: parameter type
        const APPLICATION: DemandeSubvention = { foo: "bar" };

        it("should call OsirisRequestAdapter.rawToApplication", () => {
            osirisService.rawToApplication(RAW_APPLICATION);
            expect(OsirisRequestAdapter.rawToApplication).toHaveBeenCalledWith(RAW_APPLICATION);
        });

        it("should return DemandeSubvention", () => {
            jest.mocked(OsirisRequestAdapter.rawToApplication).mockReturnValueOnce(APPLICATION);
            const expected = APPLICATION;
            const actual = osirisService.rawToApplication(RAW_APPLICATION);
            expect(actual).toEqual(expected);
        });
    });

    describe("getDemandeSubventionBySiret", () => {
        const SIRET = "12345678900000";
        const findBySiretMock = jest.spyOn(osirisService, "findBySiret");
        it("should call findBySiret()", async () => {
            // @ts-expect-error: mock
            findBySiretMock.mockImplementationOnce(jest.fn(() => [{}]));
            // @ts-expect-error: mock
            toDemandeSubventionMock.mockImplementationOnce(entity => entity);
            await osirisService.getDemandeSubventionBySiret(SIRET);
            expect(findBySiretMock).toHaveBeenCalledWith(SIRET);
        });
    });

    describe("getDemandeSubventionBySiren", () => {
        const SIREN = "123456789";
        const findBySirenMock = jest.spyOn(osirisService, "findBySiren");
        it("should call findBySiren", async () => {
            // @ts-expect-error: mock
            findBySirenMock.mockImplementationOnce(jest.fn(() => [{}]));
            // @ts-expect-error: mock
            toDemandeSubventionMock.mockImplementationOnce(entity => entity);
            await osirisService.getDemandeSubventionBySiren(SIREN);
            expect(findBySirenMock).toHaveBeenCalledWith(SIREN);
        });
    });

    describe("raw grants", () => {
        const DATA = [{ providerInformations: { ej: "EJ" } }];
        describe("getRawGrantsBySiret", () => {
            const SIRET = "12345678900000";
            let findBySiretMock;
            beforeAll(
                () =>
                    (findBySiretMock = jest
                        .spyOn(osirisService, "findBySiret")
                        // @ts-expect-error: mock
                        .mockImplementation(jest.fn(() => DATA))),
            );
            afterAll(() => findBySiretMock.mockRestore());

            it("should call findBySiret()", async () => {
                await osirisService.getRawGrantsBySiret(SIRET);
                expect(findBySiretMock).toHaveBeenCalledWith(SIRET);
            });

            it("returns raw grant data", async () => {
                const actual = await osirisService.getRawGrantsBySiret(SIRET);
                expect(actual).toMatchInlineSnapshot(`
                    Array [
                      Object {
                        "data": Object {
                          "providerInformations": Object {
                            "ej": "EJ",
                          },
                        },
                        "joinKey": "EJ",
                        "provider": "osiris",
                        "type": "application",
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
                        .spyOn(osirisService, "findBySiren")
                        // @ts-expect-error: mock
                        .mockImplementation(jest.fn(() => DATA))),
            );
            afterAll(() => findBySirenMock.mockRestore());

            it("should call findBySiren()", async () => {
                await osirisService.getRawGrantsBySiren(SIREN);
                expect(findBySirenMock).toHaveBeenCalledWith(SIREN);
            });

            it("returns raw grant data", async () => {
                const actual = await osirisService.getRawGrantsBySiren(SIREN);
                expect(actual).toMatchInlineSnapshot(`
                    Array [
                      Object {
                        "data": Object {
                          "providerInformations": Object {
                            "ej": "EJ",
                          },
                        },
                        "joinKey": "EJ",
                        "provider": "osiris",
                        "type": "application",
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
            OsirisRequestAdapter.toCommon
                // @ts-expect-error: mock
                .mockImplementation(input => input.toString());
        });

        afterAll(() => {
            // @ts-expect-error: mock
            OsirisRequestAdapter.toCommon.mockReset();
        });

        it("calls adapter with data from raw grant", () => {
            // @ts-expect-error: mock
            osirisService.rawToCommon({ data: RAW });
            expect(OsirisRequestAdapter.toCommon).toHaveBeenCalledWith(RAW);
        });
        it("returns result from adapter", () => {
            // @ts-expect-error: mock
            OsirisRequestAdapter.toCommon.mockReturnValueOnce(ADAPTED);
            const expected = ADAPTED;
            // @ts-expect-error: mock
            const actual = osirisService.rawToCommon({ data: RAW });
            expect(actual).toEqual(expected);
        });
    });
});
