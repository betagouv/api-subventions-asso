import IOsirisRequestInformations from "../../../../src/modules/providers/osiris/@types/IOsirisRequestInformations";
import OsirisRequestEntity from "../../../../src/modules/providers/osiris/entities/OsirisRequestEntity";
import osirisService, { OsirisService } from "../../../../src/modules/providers/osiris/osiris.service";
import ProviderValueAdapter from "../../../../src/shared/adapters/ProviderValueAdapter";
import AssociationIdentifier from "../../../../src/identifierObjects/AssociationIdentifier";
import Rna from "../../../../src/identifierObjects/Rna";
import Siren from "../../../../src/identifierObjects/Siren";

// TODO ensure this is proper integ test. It is historical test when we did not make a difference

describe("OsirisService", () => {
    it("should return an instance of osirisService", () => {
        expect(osirisService).toBeInstanceOf(OsirisService);
    });

    const SIREN = new Siren("123456789");
    const SIRET = SIREN.toSiret("00000");
    const RNA = new Rna("W123456789");

    const ASSOCIATION_IDENTIFER = AssociationIdentifier.fromSirenAndRna(SIREN, RNA);

    describe("Etablisesement part", () => {
        const now = new Date(Date.UTC(2022, 0));
        const toPVs = (value: unknown, provider = "Osiris") =>
            ProviderValueAdapter.toProviderValues(value, provider, now);

        const entity = new OsirisRequestEntity(
            { siret: "12345678900000", rna: RNA.value, name: "NAME" },
            {
                osirisId: "FAKE_ID_2",
                compteAssoId: "COMPTEASSOID",
                ej: "",
                amountAwarded: 0,
                dateCommission: new Date(),
                exercise: 2022,
            } as IOsirisRequestInformations,
            {},
            undefined,
            [],
        );

        beforeEach(async () => {
            await osirisService.bulkAddRequest([entity]);
        });

        describe("getEstablishments", () => {
            it("should return one demande", async () => {
                const expected = [
                    {
                        siret: toPVs(SIRET.value),
                        nic: toPVs("00000"),
                    },
                ];

                const actual = await osirisService.getEstablishments(ASSOCIATION_IDENTIFER);
                expect(actual).toMatchObject(expected);
            });
        });
    });

    describe("Association part", () => {
        const now = new Date(Date.UTC(2022, 0));
        const toPVs = (value: unknown, provider = "Osiris") =>
            ProviderValueAdapter.toProviderValues(value, provider, now);

        const entity = new OsirisRequestEntity(
            { siret: "12345678900000", rna: "W123456789", name: "NAME" },
            {
                osirisId: "FAKE_ID_2",
                compteAssoId: "COMPTEASSOID",
                ej: "",
                amountAwarded: 0,
                dateCommission: new Date(),
                exercise: 2022,
            } as IOsirisRequestInformations,
            {},
            undefined,
            [],
        );

        const SIREN = new Siren("123456789");
        const IDENTIFIER = AssociationIdentifier.fromSiren(SIREN);

        beforeEach(async () => {
            await osirisService.bulkAddRequest([entity]);
        });

        describe("getAssociations", () => {
            it("should return one demande", async () => {
                const expected = [
                    {
                        siren: toPVs("123456789"),
                        rna: toPVs("W123456789"),
                        etablisements_siret: toPVs(["12345678900000"]),
                    },
                ];

                const actual = await osirisService.getAssociations(IDENTIFIER);
                expect(actual).toMatchObject(expected);
            });
        });
    });
});
