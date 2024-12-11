import { GrantDashboardController } from "./GrantDashboard.controller";
import { getPaymentDashboardData, getPaymentsCells } from "./payments.helper";
import { getApplicationCells, getApplicationDashboardData, isGranted } from "./application.helper";
import type { FlatGrant } from "$lib/resources/@types/FlattenGrant";
import { isSiret } from "$lib/helpers/identifierHelper";
import establishmentService from "$lib/resources/establishments/establishment.service";
import establishmentPort from "$lib/resources/establishments/establishment.port";
import associationService from "$lib/resources/associations/association.service";
import associationPort from "$lib/resources/associations/association.port";
import trackerService from "$lib/services/tracker.service";
import documentHelper from "$lib/helpers/document.helper";
import PaymentsInfoModal from "$lib/components/GrantDashboard/Modals/PaymentsInfoModal.svelte";
import ApplicationInfoModal from "$lib/components/GrantDashboard/Modals/ApplicationInfoModal.svelte";
import { data, modal } from "$lib/store/modal.store";
import type {
    DashboardApplication,
    DashboardPayment,
    SortableRow,
} from "$lib/components/GrantDashboard/@types/DashboardGrant";
import { grantCompareFn } from "$lib/components/GrantDashboard/sort.helper";
import type { TableCell } from "$lib/dsfr/TableCell.types";
import * as Store from "$lib/core/Store";
import type { ReadStore } from "$lib/core/Store";

vi.mock("$lib/helpers/identifierHelper");
vi.mock("$lib/resources/establishments/establishment.service");
vi.mock("$lib/resources/establishments/establishment.port");
vi.mock("$lib/resources/associations/association.service");
vi.mock("$lib/resources/associations/association.port");
vi.mock("$lib/helpers/providerValueHelper");
vi.mock("$lib/services/tracker.service");
vi.mock("$lib/helpers/document.helper");
vi.mock("$lib/store/modal.store");
vi.mock("./application.helper");
vi.mock("./payments.helper");
vi.mock("$lib/components/GrantDashboard/sort.helper", () => ({
    grantCompareFn: [null, vi.fn((_a, _b, _sortOrder) => 0)],
}));

describe("GrantDashboard Controller", () => {
    const IDENTIFIER = "000000001";
    const INDEX = 1;

    const GRANT_FROM_2024 = () => ({
        application: { annee_demande: 2024 },
    });

    const GRANT_FROM_2023 = () => ({
        application: { annee_demande: 2022 },
        payments: [{ dateOperation: "2023-01-13" }, { dateOperation: "2023-04-21" }],
    });

    const GRANT_FROM_2021 = () => ({ payments: [{ dateOperation: "2021-08-14" }] });

    const FLAT_GRANTS = () => [GRANT_FROM_2021(), GRANT_FROM_2023(), GRANT_FROM_2024()] as FlatGrant[];

    let CTRL: GrantDashboardController;

    beforeAll(() => {
        vi.mocked(associationPort.getGrants).mockResolvedValue(FLAT_GRANTS());
        vi.mocked(establishmentPort.getGrants).mockResolvedValue(FLAT_GRANTS());
    });

    describe("constructor", () => {
        beforeAll(() => {
            vi.mocked(isSiret).mockReturnValue(true);
        });

        beforeEach(() => {
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

        it("fetches association grants", () => {
            vi.clearAllMocks();
            vi.mocked(isSiret).mockReturnValueOnce(false);
            CTRL = new GrantDashboardController(IDENTIFIER);
            // @ts-expect-error: mock
            vi.spyOn(CTRL, "processGrants").mockReturnValue("processGrants return value");
            expect(associationPort.getGrants).toHaveBeenCalledWith(IDENTIFIER);
        });

        it("calls processGrants", () => {
            // @ts-expect-error: access private method
            expect(CTRL.processGrants).toHaveBeenCalledWith(FLAT_GRANTS());
        });
    });

    describe("with a mocked constructor", () => {
        beforeAll(() => {
            vi.mocked(isSiret).mockReturnValueOnce(true);
            vi.mocked(establishmentPort.getGrants).mockResolvedValueOnce([]);
            CTRL = new GrantDashboardController(IDENTIFIER);
        });

        describe("initStores", () => {
            let updateRowSpy;
            beforeAll(() => {
                // @ts-expect-error -- test private
                updateRowSpy = vi.spyOn(CTRL, "updateRows").mockReturnValue();
            });

            afterAll(() => {
                updateRowSpy.mockRestore();
            });

            describe("selectedExercise derives from selectedExerciseIndex", () => {
                let updateSpy;
                let refStore;

                beforeAll(() => {
                    const derivedSpy = vi.spyOn(Store, "derived");
                    // @ts-expect-error -- test private
                    CTRL.initStores();
                    const callArgs = vi.mocked(derivedSpy).mock.calls[0];
                    updateSpy = callArgs[1];
                    refStore = callArgs[0];
                });

                it("depends on selectedExerciseIndex", () => {
                    const actual = refStore;
                    const expected = CTRL.selectedExerciseIndex;
                    expect(actual).toBe(expected);
                });

                it("returns null if no exercise index", () => {
                    const expected = null;
                    const actual = updateSpy(undefined);
                    expect(actual).toBe(expected);
                });

                it("returns null if no exerciseOptions", () => {
                    CTRL.exerciseOptions.value = undefined;
                    const expected = null;
                    const actual = updateSpy(0);
                    expect(actual).toBe(expected);
                });

                it("returns exercise from options", () => {
                    const expected = "2023";
                    CTRL.exerciseOptions.value = ["2022", expected];
                    const actual = updateSpy(1);
                    expect(actual).toBe(expected);
                });

                it("returns exercise from options with index set to 0", () => {
                    const expected = "2023";
                    CTRL.exerciseOptions.value = [expected, "2022"];
                    const actual = updateSpy(0);
                    expect(actual).toBe(expected);
                });
            });

            describe("on selectedExerciseIndex change", () => {
                let subscribeFn;
                const YEAR = "2021";
                const GRANTS = "g2021" as unknown as FlatGrant[];

                beforeAll(() => {
                    const subscribeSpy = vi.fn();
                    vi.spyOn(Store, "derived").mockReturnValueOnce({
                        subscribe: subscribeSpy,
                    } as unknown as ReadStore<string>);
                    // @ts-expect-error -- test private
                    CTRL.initStores();
                    subscribeFn = subscribeSpy.mock.calls[0][0];
                    CTRL.grantsByExercise = { [YEAR]: GRANTS };
                });

                it("does nothing if selectedExercise is set to null", () => {
                    const setSpy = vi.spyOn(CTRL.selectedGrants, "set");
                    subscribeFn(null);
                    expect(setSpy).not.toHaveBeenCalled();
                });

                it("updates selectedGrants through grantsByExercise on selectedExerciseIndex change", () => {
                    const setSpy = vi.spyOn(CTRL.selectedGrants, "set");
                    subscribeFn(YEAR);
                    expect(setSpy).toHaveBeenCalledWith(GRANTS);
                });
            });

            it("calls updateRows on selectedGrants change", () => {
                // @ts-expect-error -- test private
                CTRL.initStores();

                const GRANTS = "grants" as unknown as FlatGrant[];
                CTRL.selectedGrants.set(GRANTS);
                expect(updateRowSpy).toHaveBeenCalledWith(GRANTS);
            });
        });

        describe("processGrants", () => {
            const GRANTS_BY_EXERCISE = { 2021: GRANT_FROM_2021, 2023: [GRANT_FROM_2023], 2024: [GRANT_FROM_2024] };
            let splitSpy;
            beforeAll(() => {
                // @ts-expect-error: mock private method
                splitSpy = vi.spyOn(CTRL, "splitGrantsByExercise").mockReturnValue(GRANTS_BY_EXERCISE);
            });
            afterAll(() => {
                splitSpy.mockRestore();
            });

            it("defines grants", () => {
                // @ts-expect-error: calls private method
                CTRL.processGrants(FLAT_GRANTS());
                expect(CTRL.grants.value).toEqual(FLAT_GRANTS());
            });

            it("split grants by exercise", () => {
                // @ts-expect-error: calls private method
                CTRL.processGrants(FLAT_GRANTS());
                expect(CTRL.grantsByExercise).toEqual(GRANTS_BY_EXERCISE);
            });

            it("select most recent exercise", () => {
                // @ts-expect-error: calls private method
                CTRL.processGrants(FLAT_GRANTS());
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
                const actual = CTRL.splitGrantsByExercise(FLAT_GRANTS());
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

            it("calls trackerService if not already loading", async () => {
                CTRL.isExtractLoading.value = false;
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

        describe("updateRows", () => {
            let rowSetSpy;

            beforeAll(() => {
                rowSetSpy = vi.spyOn(CTRL.rows, "set");
            });

            it("does nothing if grants is null", () => {
                // @ts-expect-error -- test private
                CTRL.updateRows(null);
                expect(rowSetSpy).not.toHaveBeenCalled();
            });

            it("sets rows with results from adapters", () => {
                vi.mocked(isGranted).mockReturnValueOnce(true);
                vi.mocked(isGranted).mockReturnValueOnce(false);
                vi.mocked(getApplicationCells).mockImplementation(a => `ac-${a}` as unknown as TableCell[]);
                vi.mocked(getPaymentsCells).mockImplementation(a => `pc-${a}` as unknown as TableCell[]);
                vi.mocked(getApplicationDashboardData).mockImplementation(
                    a => `a-${a}` as unknown as DashboardApplication,
                );
                vi.mocked(getPaymentDashboardData).mockImplementation(a => `p-${a}` as unknown as DashboardPayment);
                const GRANTS = [
                    { application: "a0", payments: "p0" },
                    { application: "a1", payments: "p1" },
                ];
                // @ts-expect-error -- test private
                CTRL.updateRows(GRANTS);
                const actual = rowSetSpy.mock.calls[0][0];
                expect(actual).toMatchInlineSnapshot(`
                  [
                    {
                      "application": "a-a0",
                      "applicationCells": "ac-a0",
                      "granted": true,
                      "payment": "p-p0",
                      "paymentsCells": "pc-p0",
                    },
                    {
                      "application": "a-a1",
                      "applicationCells": "ac-a1",
                      "granted": false,
                      "payment": "p-p1",
                      "paymentsCells": "pc-p1",
                    },
                  ]
                `);
                vi.mocked(getApplicationCells).mockRestore();
                vi.mocked(getPaymentsCells).mockRestore();
                vi.mocked(getApplicationDashboardData).mockRestore();
                vi.mocked(getPaymentDashboardData).mockRestore();
            });
        });

        describe("sortTable", () => {
            it("changes sort order", () => {
                const expected = 2;
                // @ts-expect-error -- test mock private
                CTRL.columnsSortOrder[INDEX] = -2;
                CTRL.sortTable(INDEX);
                // @ts-expect-error -- test mock private
                const actual = CTRL.columnsSortOrder[INDEX];
                expect(actual).toBe(expected);
            });

            it("sorts row with compare function with proper index", () => {
                CTRL.sortTable(INDEX);
                expect(grantCompareFn[INDEX]).toHaveBeenCalled();
            });

            it("updates rows", () => {
                const spy = vi.spyOn(CTRL.rows, "update");
                CTRL.sortTable(INDEX);
                expect(spy).toHaveBeenCalled();
            });
        });

        describe.each`
            side            | method                  | keyWordInTracker | modalComponent
            ${"payment"}    | ${"onPaymentClick"}     | ${"payment"}     | ${PaymentsInfoModal}
            ${"subvention"} | ${"onApplicationClick"} | ${"subvention"}  | ${ApplicationInfoModal}
        `("onRowClick: $side side", ({ method, keyWordInTracker, modalComponent }) => {
            const INDEX = 1;
            const ROWS = [
                { paymentCells: "Pc0", applicationCells: "Ac0" },
                {
                    paymentCells: "Pc1",
                    applicationCells: "Ac1",
                },
            ] as unknown as SortableRow[];
            const SUBV = [
                { application: "A0", payments: "P0" },
                { application: "A1", payments: "P1" },
            ] as unknown as FlatGrant[];

            beforeAll(() => {
                CTRL.selectedGrants.value = SUBV;
                CTRL.rows.value = ROWS;
            });

            it("if no cells, nothing happens", () => {
                CTRL.rows.value = [ROWS[0], {} as SortableRow];
                CTRL[method](INDEX);
                expect(trackerService.buttonClickEvent).not.toHaveBeenCalled();
                expect(data.set).not.toHaveBeenCalled();
                expect(modal.set).not.toHaveBeenCalled();
                CTRL.rows.value = ROWS;
            });

            it("tracks button click", () => {
                CTRL[method](INDEX);
                const eventTag = `association-etablissement.dashbord.${keyWordInTracker}.more_information`;
                expect(trackerService.buttonClickEvent).toHaveBeenCalledWith(eventTag, IDENTIFIER);
            });

            it("sets data", () => {
                CTRL.selectedGrants.value = SUBV;
                CTRL[method](INDEX);
                expect(data.set).toHaveBeenCalledWith({ application: "A1" });
            });

            it("sets modal component", () => {
                CTRL.selectedGrants.value = SUBV;
                CTRL[method](INDEX);
                expect(modal.set).toHaveBeenCalledWith(modalComponent);
            });
        });
    });
});
