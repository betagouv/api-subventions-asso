import { Association, Etablissement } from "@api-subventions-asso/dto";
import chorusService from "../../../src/modules/providers/chorus/chorus.service";
import ChorusLineEntity from "../../../src/modules/providers/chorus/entities/ChorusLineEntity";
import fonjepService from "../../../src/modules/providers/fonjep/fonjep.service";
import versementsService from "../../../src/modules/versements/versements.service";
import ProviderValueAdapter from "../../../src/shared/adapters/ProviderValueAdapter";
import { VersementEntity } from "../providers/fonjep/__fixtures__/entity";

describe("VersementService", () => {
    const now = new Date("2022-01-01");
    const toPVs = <T = unknown>(value: T, provider = "Chorus") =>
        ProviderValueAdapter.toProviderValues(value, provider, now);
    const toPV = (value: unknown, provider = "Chorus") => ProviderValueAdapter.toProviderValue(value, provider, now);

    describe("aggregateVersementsByAssoSearch", () => {
        const asso = {
            siren: toPVs("100000000"),
            etablissements: [
                {
                    siret: toPVs("10000000000000"),
                    demandes_subventions: [
                        {
                            ej: toPV("1000000000"),
                            versementKey: toPV("1000000000")
                        },
                        {
                            codePoste: toPV(VersementEntity.indexedInformations.code_poste),
                            versementKey: toPV(VersementEntity.indexedInformations.code_poste)
                        }
                    ]
                }
            ]
        } as unknown as Association;

        beforeEach(async () => {
            jest.spyOn(chorusService, "sirenBelongAsso").mockImplementation(() => Promise.resolve(true));
            await chorusService.addChorusLine(
                new ChorusLineEntity(
                    "FAKE_ID",
                    {
                        siret: "10000000000000",
                        ej: "1000000000",
                        amount: 1000,
                        dateOperation: now,
                        codeBranche: "Z004",
                        branche: "BRANCHE",
                        centreFinancier: "CENTRE_FINANCIER",
                        codeCentreFinancier: "CENTRE_FINANCIER_CODE",
                        domaineFonctionnel: "DOMAINE_FONCTIONNEL",
                        codeDomaineFonctionnel: "DOMAINE_FONCTIONNEL_CODE",
                        compte: "COMPTE",
                        typeOperation: "ZSUB"
                    },
                    {}
                )
            );
            await fonjepService.createVersementEntity(VersementEntity);
        });

        it("should aggregate versements", async () => {
            const actual = await versementsService.aggregateVersementsByAssoSearch(asso);
            // remove all IDs manually...
            // @ts-expect-error
            delete actual.versements[0].id;
            // @ts-expect-error
            delete actual?.etablissements[0].versements[0].id;
            // @ts-expect-error
            delete actual?.etablissements[0].demandes_subventions[0].versements[0].id;
            expect(actual).toMatchSnapshot();
        });

        it("should not aggregate versements", async () => {
            const actual = await versementsService.aggregateVersementsByAssoSearch({
                ...asso,
                siren: toPVs("100000080")
            });
            expect(actual).toMatchSnapshot();
        });
    });

    describe("aggregateVersementsByEtablissementSearch", () => {
        const etablissementDto = {
            siret: toPVs("10000000000000"),
            demandes_subventions: [
                {
                    ej: toPV("1000000000"),
                    versementKey: toPV("1000000000")
                }
            ]
        } as unknown as Etablissement;

        beforeEach(async () => {
            jest.spyOn(chorusService, "sirenBelongAsso").mockImplementation(() => Promise.resolve(true));
            await chorusService.addChorusLine(
                new ChorusLineEntity(
                    "FAKE_ID",
                    {
                        siret: "10000000000000",
                        ej: "1000000000",
                        amount: 1000,
                        dateOperation: now,
                        codeBranche: "Z004",
                        branche: "BRANCHE",
                        centreFinancier: "CENTRE_FINANCIER",
                        codeCentreFinancier: "CENTRE_FINANCIER_CODE",
                        domaineFonctionnel: "DOMAINE_FONCTIONNEL",
                        codeDomaineFonctionnel: "DOMAINE_FONCTIONNEL_CODE",
                        compte: "COMPTE",
                        typeOperation: "ZSUB"
                    },
                    {}
                )
            );
        });

        it("should aggregate versements", async () => {
            const actual = versementsService.aggregateVersementsByEtablissementSearch(etablissementDto);
            expect(actual).toMatchSnapshot();
        });

        it("should not aggregate versements", async () => {
            const actual = await versementsService.aggregateVersementsByEtablissementSearch({
                ...etablissementDto,
                siret: toPVs("10000000008000")
            });
            expect(actual).toMatchSnapshot();
        });
    });
});
