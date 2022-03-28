import chorusService from "../../../src/modules/providers/chorus/chorus.service";
import ChorusLineEntity from "../../../src/modules/providers/chorus/entities/ChorusLineEntity";
import AssociationDto from "../../../src/modules/search/interfaces/http/dto/AssociationDto";
import EtablissementDto from "../../../src/modules/search/interfaces/http/dto/EtablissmentDto";
import versementsService from "../../../src/modules/versements/versements.service";
import ProviderValueAdapter from "../../../src/shared/adapters/ProviderValueAdapter";

describe("VersementService", () => {
    const now = new Date();
    const toPVs = <T=unknown>(value: T, provider = "Chorus") => ProviderValueAdapter.toProviderValues(value, provider, now);
    const toPV = (value: unknown, provider = "Chorus") => ProviderValueAdapter.toProviderValue(value, provider, now);
    
    describe("aggregateVersementsByAssoSearch", () => {
        const asso = {
            siren: toPVs("100000000"),
            etablissements: [
                {
                    siret: toPVs("10000000000000"),
                    demandes_subventions: [
                        {
                            ej: toPV("1000000000")
                        }
                    ]
                }
            ]
        } as unknown as AssociationDto;

        beforeEach(async () => {
            jest.spyOn(chorusService, "sirenBelongAsso").mockImplementation(() => Promise.resolve(true))
            await chorusService.addChorusLine(new ChorusLineEntity("FAKE_ID", {
                siret: "10000000000000",
                ej: "1000000000",
                amount: 1000,
                dateOperation: now,
                codeBranche: "Z004",
                branche: "BRANCHE",
                compte: "COMPTE",
                typeOperation: "ZSUB"
            }, {}));
        })

        it("should be aggregate versements", () => {
            expect(versementsService.aggregateVersementsByAssoSearch(asso)).resolves.toMatchObject({
                siren: toPVs("100000000"),
                versements:  [
                    {
                        siret: toPV("10000000000000"),
                        ej: toPV("1000000000"),
                        amount: toPV(1000),
                        dateOperation: toPV(now),
                        codeBranche: toPV("Z004"),
                        branche: toPV("BRANCHE"),
                        compte: toPV("COMPTE"),
                        type: toPV("ZSUB")
                    }
                ],
                etablissements: [
                    {
                        siret: toPVs("10000000000000"),
                        versements: [{
                            siret: toPV("10000000000000"),
                            ej: toPV("1000000000"),
                            amount: toPV(1000),
                            dateOperation: toPV(now),
                            codeBranche: toPV("Z004"),
                            compte: toPV("COMPTE")
                        }],
                        demandes_subventions: [
                            {
                                ej: toPV("1000000000"),
                                versements:  [{
                                    siret: toPV("10000000000000"),
                                    ej: toPV("1000000000"),
                                    amount: toPV(1000),
                                    dateOperation: toPV(now),
                                    codeBranche: toPV("Z004"),
                                    compte: toPV("COMPTE")
                                }]
                            }
                        ]
                    }
                ]
            })
        })

        it("should be not aggregate versements", () => {
            expect(versementsService.aggregateVersementsByAssoSearch({...asso, siren: toPVs("100000080")})).resolves.toMatchObject({
                siren: toPVs("100000080"),
                versements: [],
                etablissements: [
                    {
                        siret: toPVs("10000000000000"),
                        versements: [],
                        demandes_subventions: [
                            {
                                ej: toPV("1000000000"),
                                versements:  []
                            }
                        ]
                    }
                ]
            })
        });
    });


     
    describe("aggregateVersementsByEtablissementSearch", () => {
        const etablissementDto = {
            siret: toPVs("10000000000000"),
            demandes_subventions: [
                {
                    ej: toPV("1000000000")
                }
            ]
        } as unknown as EtablissementDto;

        beforeEach(async () => {
            jest.spyOn(chorusService, "sirenBelongAsso").mockImplementation(() => Promise.resolve(true))
            await chorusService.addChorusLine(new ChorusLineEntity("FAKE_ID", {
                siret: "10000000000000",
                ej: "1000000000",
                amount: 1000,
                dateOperation: now,
                codeBranche: "Z004",
                branche: "BRANCHE",
                compte: "COMPTE",
                typeOperation: "ZSUB"
            }, {}));
        })

        it("should be aggregate versements", () => {
            expect(versementsService.aggregateVersementsByEtablissementSearch(etablissementDto)).resolves.toMatchObject({
                siret: toPVs("10000000000000"),
                versements: [{
                    siret: toPV("10000000000000"),
                    ej: toPV("1000000000"),
                    amount: toPV(1000),
                    dateOperation: toPV(now),
                    codeBranche: toPV("Z004"),
                    compte: toPV("COMPTE")
                }],
                demandes_subventions: [
                    {
                        ej: toPV("1000000000"),
                        versements:  [{
                            siret: toPV("10000000000000"),
                            ej: toPV("1000000000"),
                            amount: toPV(1000),
                            dateOperation: toPV(now),
                            codeBranche: toPV("Z004"),
                            compte: toPV("COMPTE")
                        }]
                    }
                ]
            })
        })

        it("should be not aggregate versements", () => {
            expect(versementsService.aggregateVersementsByEtablissementSearch({...etablissementDto, siret: toPVs("10000000008000")})).resolves.toMatchObject({
                siret: toPVs("10000000008000"),
                versements: [],
                demandes_subventions: [
                    {
                        ej: toPV("1000000000"),
                        versements:  []
                    }
                ]
            })
        });
    });
});