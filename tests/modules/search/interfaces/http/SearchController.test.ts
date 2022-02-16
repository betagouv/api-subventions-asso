import request from "supertest"
import OsirisRequestEntity from "../../../../../src/modules/providers/osiris/entities/OsirisRequestEntity";
import osirisService from "../../../../../src/modules/providers/osiris/osiris.service";
import getUserToken from "../../../../__helpers__/getUserToken";
import IOsirisRequestInformations from "../../../../../src/modules/providers/osiris/@types/IOsirisRequestInformations";
import ProviderValueAdapter from "../../../../../src/shared/adapters/ProviderValueAdapter";
import associationsService from "../../../../../src/modules/associations/associations.service";
import etablissementService from "../../../../../src/modules/etablissements/etablissements.service";
import ProviderValue, { ProviderValues } from "../../../../../src/@types/ProviderValue";

const g = global as unknown as { app: unknown }

describe('SearchController, /search', () => {

    const now = new Date();
    const toPVs = (value: unknown, provider = "TEST") => ProviderValueAdapter.toProviderValues(value, provider, now);
    const toPV = (value: unknown, provider = "TEST") => ProviderValueAdapter.toProviderValue(value, provider, now);
    const fromApiPV = (value: ProviderValue) => ({...value, last_update: value.last_update.toISOString()})
    const fromApiPVs = (values: ProviderValues) => (values.map(value => fromApiPV(value)))

    const spys: jest.SpyInstance<unknown>[] = [];
    beforeAll(() => {
        spys.push(
            jest.spyOn(associationsService, "getAssociationBySiren"),
            jest.spyOn(etablissementService, "getEtablissement"),
        )
    });

    afterAll(() => {
        spys.forEach(spy => spy.mockReset());
    });

    describe("GET /siret/{SIRET_NUMBER}", () => {

        beforeEach(async () => {
            const osiris = new OsirisRequestEntity({ siret: "12345678911111", rna: "RNA", name: "NAME"}, { osirisId: "FAKE_ID_2", compteAssoId: "COMPTEASSOID", ej: "35654654654654", amountAwarded: 0, dateCommission: now} as IOsirisRequestInformations, {}, undefined, []);
            await osirisService.addRequest(osiris);


            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            associationsService.getAssociationBySiren.mockImplementationOnce((siren) => ({
                siren: toPVs(siren),
                etablisements_siret: toPVs([
                    "12345678911111"
                ])
            }));

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            etablissementService.getEtablissement.mockImplementationOnce(() => ({ siret: toPVs("12345678911111") }));

        })

        it("should return 200", async () => {

            const response = await request(g.app)
                .get("/search/etablissement/12345678911111")
                .set("x-access-token", await getUserToken())
                .set('Accept', 'application/json')
    
            expect(response.statusCode).toBe(200);
        })

        it("should return data", async () => {
            const response = await request(g.app)
                .get("/search/etablissement/12345678911111")
                .set("x-access-token", await getUserToken())
                .set('Accept', 'application/json')
            
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({
                success: true,
                etablissement: {
                    siret: fromApiPVs(toPVs("12345678911111")),
                    association: {
                        siren: fromApiPVs(toPVs("123456789")),
                        etablisements_siret: fromApiPVs(toPVs([
                            "12345678911111"
                        ]))
                    },
                    demandes_subventions: [
                        {
                            ej: fromApiPV(toPV("35654654654654", "Osiris"))
                        },    
                    ]
                }
            });
        })

        it("should return 401", async () => {
            const response = await request(g.app)
                .get("/search/etablissement/12345678911111")
                .set('Accept', 'application/json')

            expect(response.statusCode).toBe(401);
        })

        it("should return 404", async () => {
            const response = await request(g.app)
                .get("/search/etablissement/00000000000000")
                .set("x-access-token", await getUserToken())
                .set('Accept', 'application/json')

            expect(response.statusCode).toBe(404);
        })
    })

    describe("GET /rna/{RNA_NUMBER}", () => {

        beforeEach(async () => {
            const osiris = new OsirisRequestEntity({ siret: "12345678911111", rna: "W123456789", name: "NAME"}, { osirisId: "FAKE_ID_2", compteAssoId: "COMPTEASSOID", ej: "35654654654654", amountAwarded: 0, dateCommission: now} as IOsirisRequestInformations, {}, undefined, []);
            await osirisService.addRequest(osiris);


            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            associationsService.getAssociationBySiren.mockImplementationOnce((siren) => ({
                siren: toPVs(siren),
                rna: toPVs("W123456789"),
                etablisements_siret: toPVs([
                    "12345678911111"
                ])
            }));

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            etablissementService.getEtablissement.mockImplementationOnce(() => ({ siret: toPVs("12345678911111") }));

        })
        it("should return 200", async () => {
            const response = await request(g.app)
                .get("/search/association/W123456789")
                .set("x-access-token", await getUserToken())
                .set('Accept', 'application/json')
    
            expect(response.statusCode).toBe(200);
        })

        it("should return data", async () => {
            const response = await request(g.app)
                .get("/search/association/W123456789")
                .set("x-access-token", await getUserToken())
                .set('Accept', 'application/json')
            
            expect(response.statusCode).toBe(200);

            expect(response.body).toMatchObject({
                success: true,
                association: {
                    siren: fromApiPVs(toPVs("123456789")),
                    etablisements_siret: fromApiPVs(toPVs([
                        "12345678911111"
                    ])),
                    etablissements: [{
                        siret: fromApiPVs(toPVs("12345678911111")),
                        demandes_subventions: [
                            {
                                ej: fromApiPV(toPV("35654654654654", "Osiris"))
                            },    
                        ]
                    }]
                }
            });
        })

        it("should return 401", async () => {
            const response = await request(g.app)
                .get("/search/association/W491002657")
                .set('Accept', 'application/json')

            expect(response.statusCode).toBe(401);
        })

        it("should return 404", async () => {
            const response = await request(g.app)
                .get("/search/association/W000000000")
                .set("x-access-token", await getUserToken())
                .set('Accept', 'application/json')

            expect(response.statusCode).toBe(404);
        })
    })
});