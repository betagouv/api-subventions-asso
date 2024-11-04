import { AxiosResponse } from "axios";
import establishmentPort from "./establishment.port";
import requestsService from "$lib/services/requests.service";
vi.mock("$lib/services/requests.service");
const mockedRequestService = vi.mocked(requestsService);

describe("EstablishmentPort", () => {
    mockedRequestService.get.mockResolvedValue({ data: {} } as AxiosResponse);

    vi.spyOn(requestsService, "get");
    const SIRET = "SIRET";

    describe("GET method", () => {
        const mockGetResource = vi.spyOn(establishmentPort, "getResource");

        beforeAll(() => {
            mockGetResource.mockResolvedValue({ data: { subventions: [] } } as AxiosResponse);
        });

        describe("incExtractData", () => {
            it("should call axios with route", () => {
                establishmentPort.incExtractData(SIRET);
                expect(mockGetResource).toHaveBeenCalledWith(SIRET, "extract-data");
            });
        });

        describe("getBySiret", () => {
            it("should call axios with route", () => {
                establishmentPort.getBySiret(SIRET);
                expect(mockGetResource).toHaveBeenCalledWith(SIRET);
            });
        });

        describe("getDocuments", () => {
            it("should call axios with route", () => {
                establishmentPort.getDocuments(SIRET);
                expect(mockGetResource).toHaveBeenCalledWith(SIRET, "documents");
            });
        });

        describe("getGrants", () => {
            it("calls getResource", () => {
                establishmentPort.getGrants(SIRET);
                expect(mockGetResource).toHaveBeenCalledWith(SIRET, "grants");
            });

            it("returns subventions", async () => {
                const expected = [];
                const actual = await establishmentPort.getGrants(SIRET);
                expect(actual).toEqual(expected);
            });
        });

        describe("getGrantExtract", () => {
            it("should call axios with route", () => {
                establishmentPort.getGrantExtract(SIRET);
                const actual = mockedRequestService.get.mock.calls[0];
                expect(actual).toMatchInlineSnapshot(`
                  [
                    "/etablissement/SIRET/grants/csv",
                    {},
                    {
                      "responseType": "blob",
                    },
                  ]
                `);
            });

            it("should return properly formatted data", async () => {
                // @ts-expect-error -- simplified response
                mockedRequestService.get.mockResolvedValueOnce({
                    data: "DATA",
                    headers: { ["content-disposition"]: "inline; filename=nom.pdf" },
                });
                const actual = await establishmentPort.getGrantExtract(SIRET);
                expect(actual).toMatchInlineSnapshot(`
              {
                "blob": "DATA",
                "filename": "nom.pdf",
              }
            `);
            });
        });
    });
});
