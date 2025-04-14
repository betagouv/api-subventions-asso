import ApplicationFlatEntity, { ApplicationNature, PaymentCondition } from "../../entities/ApplicationFlatEntity";
import { ApplicationStatus, DemandeSubvention } from "dto";
import ApplicationFlatAdapter from "./ApplicationFlatAdapter";

describe("ApplicationFlatAdapter", () => {
    const ENTITY = new ApplicationFlatEntity({
        anneeDemande: 2015,
        anneesPluriannualite: [2042, 2043, 2044],
        cofinancementsSollicites: false,
        conditionsVersements: PaymentCondition.PHASED,
        dateConvention: new Date("2015-03-14"),
        dateDecision: new Date("2015-03-13"),
        dateDepotDemande: new Date("2015-03-12"),
        datesPeriodeVersement: [new Date("2015-03-15"), new Date("2015-03-16")],
        descriptionConditionsVersements: "conditions",
        descriptionIdJointure: "pour joindre",
        dispositif: "dispositif",
        ej: "EJ0001",
        exerciceBudgetaire: 2015,
        idAttribuant: "123456789",
        idAutoriteGestion: "012345678",
        idBeneficiaire: "12345678901234", // a siret here
        idCofinanceursSollicites: [],
        idJointure: "joint001",
        idRAE: "RAEid",
        idServiceInstructeur: "890123456",
        idSubventionProvider: "subv001",
        idVersement: "idv",
        montantAccorde: 15000,
        montantDemande: 30000,
        montantTotal: 50000,
        nature: ApplicationNature.NATURE,
        nomAttribuant: "attribuant",
        nomAutoriteGestion: "autoriteGestion",
        nomServiceInstructeur: "serviceInstructeur",
        nomsAttribuantsCofinanceurs: [],
        notificationUE: false,
        objet: "objet",
        pluriannualite: true,
        pourcentageSubvention: 100,
        provider: "provider",
        referenceDecision: "idDecision",
        sousDispositif: "sous-dispositif",
        statutLabel: ApplicationStatus.GRANTED,
        typeIdAttribuant: undefined,
        typeIdAutoriteGestion: undefined,
        typeIdBeneficiaire: "",
        typeIdCofinanceursSollicites: [],
        typeIdServiceInstructeur: undefined,
    });

    describe("rawToApplication", () => {
        const expected = "adapted" as unknown as DemandeSubvention;
        it("returns res from toDemandeSubvention", () => {
            const toDemandeSubvSpy = jest
                .spyOn(ApplicationFlatAdapter, "rawToApplication")
                .mockReturnValueOnce(expected);
            const actual = ApplicationFlatAdapter.rawToApplication({ provider: "", type: "application", data: ENTITY });
            expect(actual).toBe(expected);
            toDemandeSubvSpy.mockReset();
        });
    });

    describe("toDemandeSubvention", () => {
        it("returns null if no siret", () => {
            const actual = ApplicationFlatAdapter.toDemandeSubvention(
                new ApplicationFlatEntity({
                    dateConvention: new Date("2015-03-14"),
                    exerciceBudgetaire: 0,
                    idBeneficiaire: "123456789", // no siret can be found
                    idSubventionProvider: "",
                    montantDemande: 0,
                    provider: "",
                    statutLabel: ApplicationStatus.GRANTED,
                }),
            );
            expect(actual).toBeNull();
        });

        it("adapts properly", () => {
            const actual = ApplicationFlatAdapter.toDemandeSubvention(ENTITY);
            expect(actual).toMatchSnapshot();
        });
    });
});
