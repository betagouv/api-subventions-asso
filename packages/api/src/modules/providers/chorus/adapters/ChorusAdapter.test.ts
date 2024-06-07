import { ObjectId, WithId } from "mongodb";
import ProviderValueAdapter from "../../../../shared/adapters/ProviderValueAdapter";
import ChorusLineEntity from "../entities/ChorusLineEntity";
import ChorusAdapter from "./ChorusAdapter";

describe("ChorusAdapter", () => {
    describe("toCommon", () => {
        it("returns proper result", () => {
            const INPUT = {
                indexedInformations: {
                    amount: 42789,
                    dateOperation: new Date("2022-02-02"),
                    codeDomaineFonctionnel: "0BOP-other",
                },
            };
            // @ts-expect-error mock
            const actual = ChorusAdapter.toCommon(INPUT);
            expect(actual).toMatchSnapshot();
        });
    });

    const now = new Date();
    const toPV = (value: unknown, provider = "Chorus") => ProviderValueAdapter.toProviderValue(value, provider, now);

    it("should return complet entity", () => {
        const entity = new ChorusLineEntity(
            "UNIQUE_ID",
            {
                codeBranche: "FAKE",
                branche: "FAKE",
                centreFinancier: "FAKE",
                codeCentreFinancier: "FAKE",
                domaineFonctionnel: "FAKE",
                codeDomaineFonctionnel: "FAKE",
                numeroDemandePayment: "FAKE",
                numeroTier: "FAKE",
                activitee: "FAKE",
                typeOperation: "FAKE",
                compte: "FAKE",
                siret: "FAKE",
                ej: "FAKE",
                amount: 0,
                dateOperation: now,
            },
            {},
            "" as unknown as ObjectId,
        );

        const actual = ChorusAdapter.toPayment(entity as WithId<ChorusLineEntity>);
        const expected = {
            codeBranche: toPV("FAKE"),
            branche: toPV("FAKE"),
            centreFinancier: toPV("FAKE"),
            domaineFonctionnel: toPV("FAKE"),
            numeroDemandePayment: toPV("FAKE"),
            numeroTier: toPV("FAKE"),
            activitee: toPV("FAKE"),
            compte: toPV("FAKE"),
            siret: toPV("FAKE"),
            ej: toPV("FAKE"),
            amount: toPV(0),
            dateOperation: toPV(now),
        };

        expect(actual).toMatchObject(expected);
    });

    it("should return partial entity", () => {
        const entity = new ChorusLineEntity(
            "UNIQUE_ID",
            {
                codeBranche: "FAKE",
                branche: "FAKE",
                centreFinancier: "FAKE",
                codeCentreFinancier: "FAKE",
                domaineFonctionnel: "FAKE",
                numeroDemandePayment: "FAKE",
                codeDomaineFonctionnel: "FAKE",
                siret: "FAKE",
                ej: "FAKE",
                amount: 0,
                dateOperation: now,
            },
            {},
            "" as unknown as ObjectId,
        );

        const actual = ChorusAdapter.toPayment(entity as WithId<ChorusLineEntity>);
        const expected = {
            codeBranche: toPV("FAKE"),
            branche: toPV("FAKE"),
            centreFinancier: toPV("FAKE"),
            domaineFonctionnel: toPV("FAKE"),
            siret: toPV("FAKE"),
            ej: toPV("FAKE"),
            amount: toPV(0),
            dateOperation: toPV(now),
        };

        expect(actual).toMatchObject(expected);
    });
});
