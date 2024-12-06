import { GrantDashboardController } from "./GrantDashboard.controller";
import type { FlatGrant } from "$lib/resources/@types/FlattenGrant";
import { isSiret } from "$lib/helpers/identifierHelper";
import establishmentService from "$lib/resources/establishments/establishment.service";
import establishmentPort from "$lib/resources/establishments/establishment.port";
import associationService from "$lib/resources/associations/association.service";
import associationPort from "$lib/resources/associations/association.port";
import trackerService from "$lib/services/tracker.service";
import documentHelper from "$lib/helpers/document.helper";
vi.mock("$lib/helpers/identifierHelper");
vi.mock("$lib/resources/establishments/establishment.service");
vi.mock("$lib/resources/establishments/establishment.port");
vi.mock("$lib/resources/associations/association.service");
vi.mock("$lib/resources/associations/association.port");
vi.mock("$lib/helpers/providerValueHelper");
vi.mock("$lib/services/tracker.service");
vi.mock("$lib/helpers/document.helper");

describe("GrantDashboard Controller", () => {
    const IDENTIFIER = "000000001";

    const GRANT_FROM_2024 = {
        application: { annee_demande: 2024 },
    };

    const GRANT_FROM_2023 = {
        application: { annee_demande: 2022 },
        payments: [{ dateOperation: "2023-01-13" }, { dateOperation: "2023-04-21" }],
    };

    const GRANT_FROM_2021 = { payments: [{ dateOperation: "2021-08-14" }] };

    const FLAT_GRANTS = [GRANT_FROM_2021, GRANT_FROM_2023, GRANT_FROM_2024] as FlatGrant[];

    let CTRL: GrantDashboardController;

    beforeAll(() => {
        vi.mocked(associationPort.getGrants).mockResolvedValue(FLAT_GRANTS);
        vi.mocked(establishmentPort.getGrants).mockResolvedValue(FLAT_GRANTS);
    });

    describe("constructor", () => {
        beforeAll(() => {
            vi.mocked(isSiret).mockReturnValue(true);
        });

        beforeEach(() => {
            vi.mocked(isSiret).mockReturnValue(true);
            CTRL = new GrantDashboardController(IDENTIFIER);
            // @ts-expect-error: mock
            vi.spyOn(CTRL, "processGrants").mockReturnValue("processGrants return value");
        });

        it("calls isSiret", () => {
            expect(vi.mocked(isSiret)).toHaveBeenCalledWith(IDENTIFIER);
        });

        it("fetches establishment grants", () => {
            expect(establishmentPort.getGrants).toHaveBeenCalledWith(IDENTIFIER);
        });

        it("fetches assocation grants", () => {
            vi.clearAllMocks();
            vi.mocked(isSiret).mockReturnValueOnce(false);
            CTRL = new GrantDashboardController(IDENTIFIER);
            // @ts-expect-error: mock
            vi.spyOn(CTRL, "processGrants").mockReturnValue("processGrants return value");
            expect(associationPort.getGrants).toHaveBeenCalledWith(IDENTIFIER);
        });

        it("calls processGrants", () => {
            // @ts-expect-error: access private method
            expect(CTRL.processGrants).toHaveBeenCalledWith(FLAT_GRANTS);
        });
    });

    describe("with a mocked constructor", () => {
        beforeEach(() => {
            vi.mocked(isSiret).mockReturnValue(true);
            const constructor = GrantDashboardController.prototype.constructor;
            // @ts-expect-error: ok
            vi.spyOn(GrantDashboardController.prototype, "constructor").mockImplementation(() => ({ grants: [] }));
            CTRL = new GrantDashboardController(IDENTIFIER);
            GrantDashboardController.prototype.constructor = constructor;
        });

        describe("processGrants", () => {
            const GRANTS_BY_EXERCISE = { 2021: GRANT_FROM_2021, 2023: [GRANT_FROM_2023], 2024: [GRANT_FROM_2024] };
            beforeEach(() => {
                // @ts-expect-error: mock private method
                vi.spyOn(CTRL, "splitGrantsByExercise").mockReturnValue(GRANTS_BY_EXERCISE);
            });

            it("defines grants", () => {
                // @ts-expect-error: calls private method
                CTRL.processGrants(FLAT_GRANTS);
                expect(CTRL.grants.value).toEqual(FLAT_GRANTS);
            });

            it("split grants by exercise", () => {
                // @ts-expect-error: calls private method
                CTRL.processGrants(FLAT_GRANTS);
                expect(CTRL.grantsByExercise).toEqual(GRANTS_BY_EXERCISE);
            });

            it("select most recent exercise", () => {
                // @ts-expect-error: calls private method
                CTRL.processGrants(FLAT_GRANTS);
                expect(CTRL.selectedExerciseIndex.value).toBe(2);
            });
        });

        describe("selectExercise", () => {
            it("update selectedExerciseIndex", () => {
                CTRL.selectExercise(1);
                expect(CTRL.selectedExerciseIndex.value).toBe(1);
            });
        });

        describe("clickProviderLink", () => {
            it("call trackerService", () => {
                CTRL.clickProviderLink();
                expect(vi.mocked(trackerService.trackEvent)).toHaveBeenCalledWith(
                    "association-etablissement.dashboard.display-provider-modal",
                );
            });
        });

        describe("splitGrantsByExercise", () => {
            it("returns grants by exercise", () => {
                // @ts-expect-error: call private method
                const actual = CTRL.splitGrantsByExercise(FLAT_GRANTS);
                expect(actual).toMatchSnapshot();
            });
        });

        describe("download", () => {
            beforeAll(() => {
                vi.mocked(establishmentService.getGrantExtract).mockImplementation(() =>
                    Promise.resolve({ blob: "blob", filename: "filename" }),
                );
                vi.mocked(associationService.getGrantExtract).mockImplementation(() =>
                    Promise.resolve({ blob: "blob", filename: "filename" }),
                );
            });

            it("stops if extract already loading", async () => {
                CTRL.isExtractLoading.set(true);
                await CTRL.download();
                expect(trackerService.trackEvent).not.toHaveBeenCalled();
            });

            it("calls trackerService", async () => {
                await CTRL.download();
                expect(trackerService.buttonClickEvent).toHaveBeenCalledWith(
                    "association-etablissement.dashbord.download-csv",
                    CTRL.identifier,
                );
            });

            it("set isExtractLoading to true", async () => {
                // @ts-expect-error: mock store
                CTRL.isExtractLoading = { set: vi.fn() };
                await CTRL.download();
                expect(CTRL.isExtractLoading.set).toHaveBeenNthCalledWith(1, true);
            });

            it("calls isSiret", async () => {
                vi.mocked(isSiret).mockReturnValue(true);
                await CTRL.download();
                expect(isSiret).toHaveBeenCalledWith(CTRL.identifier);
            });

            it("calls establishmentService", async () => {
                vi.mocked(isSiret).mockReturnValue(true);
                await CTRL.download();
                expect(establishmentService.getGrantExtract).toHaveBeenCalledWith(CTRL.identifier);
            });

            it("calls associationService", async () => {
                vi.mocked(isSiret).mockReturnValue(false);
                await CTRL.download();
                expect(associationService.getGrantExtract).toHaveBeenCalledWith(CTRL.identifier);
            });

            it("calls documentHelper.download()", async () => {
                await CTRL.download();
                expect(documentHelper.download).toHaveBeenCalled();
            });

            it("set isExtractLoading to false", async () => {
                // @ts-expect-error: mock store
                CTRL.isExtractLoading = { set: vi.fn() };
                await CTRL.download();
                expect(CTRL.isExtractLoading.set).toHaveBeenNthCalledWith(2, false);
            });
        });
    });
});
