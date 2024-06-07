import Store from "../../core/Store";
import subventionsService from "../../resources/subventions/subventions.service";
import paymentsService from "../../resources/payments/payments.service";
import SubventionsPaymentsDashboardController from "./SubventionsPaymentsDashboard.controller";

import * as helper from "./helper";
import SubventionTableController from "./SubventionTable/SubventionTable.controller";
import PaymentTableController from "./PaymentTable/PaymentTable.controller";
import associationService from "$lib/resources/associations/association.service";
vi.mock("$lib/resources/associations/association.service");
import establishmentService from "$lib/resources/establishments/establishment.service";
vi.mock("$lib/resources/establishments/establishment.service");

vi.mock("$lib/helpers/csvHelper", () => {
    return {
        __esModule: true,
        buildCsv: vi.fn(),
        downloadCsv: vi.fn(),
    };
});
import * as csvHelper from "$lib/helpers/csvHelper";

vi.mock("$lib/helpers/identifierHelper", () => {
    return {
        __esModule: true,
        isSiret: vi.fn(),
    };
});
import * as identifierHelper from "$lib/helpers/identifierHelper";
import trackerService from "$lib/services/tracker.service";
import { PROVIDER_BLOG_URL } from "$env/static/public";
vi.mock("$lib/services/tracker.service");
describe("SubventionsPaymentsDashboardController", () => {
    const SIREN = "123456789";
    const SIRET = SIREN + "00012";

    describe("isEtab()", () => {
        it("should call isSiret()", () => {
            const ctrl = new SubventionsPaymentsDashboardController(SIREN);
            ctrl.isEtab();
            expect(identifierHelper.isSiret).toHaveBeenCalledWith(SIREN);
        });
    });

    describe("providerBlogUrl", () => {
        it("should return URL", () => {
            const expected = PROVIDER_BLOG_URL;
            const controller = new SubventionsPaymentsDashboardController();
            const actual = controller.providerBlogUrl;
            expect(actual).toEqual(expected);
        });
    });

    describe("load", () => {
        it("should call method _getSubventionsStoreFactory", async () => {
            const controller = new SubventionsPaymentsDashboardController(SIREN);
            const methodMock = vi
                .spyOn(controller, "_getSubventionsStoreFactory")
                .mockImplementationOnce(() => () => new Store());
            vi.spyOn(controller, "_getPaymentsFactory").mockImplementationOnce(() => vi.fn());
            vi.spyOn(controller, "_onSubventionsStoreUpdate").mockImplementationOnce(() => vi.fn());

            await controller.load();

            const expected = 1;
            const actual = methodMock.mock.calls.length;

            expect(expected).toBe(actual);
        });

        it("should call method _getPaymentsFactory", async () => {
            const controller = new SubventionsPaymentsDashboardController(SIREN);
            const methodMock = vi.spyOn(controller, "_getPaymentsFactory").mockImplementationOnce(() => vi.fn());
            vi.spyOn(controller, "_getSubventionsStoreFactory").mockImplementationOnce(() => () => new Store());
            vi.spyOn(controller, "_onSubventionsStoreUpdate").mockImplementationOnce(() => vi.fn());

            await controller.load();

            const expected = 1;
            const actual = methodMock.mock.calls.length;

            expect(expected).toBe(actual);
        });

        it("should call method _onSubventionsStoreUpdate", async () => {
            const controller = new SubventionsPaymentsDashboardController(SIREN);
            const methodMock = vi.spyOn(controller, "_onSubventionsStoreUpdate").mockImplementationOnce(() => vi.fn());
            vi.spyOn(controller, "_getPaymentsFactory").mockImplementationOnce(() => vi.fn());
            vi.spyOn(controller, "_getSubventionsStoreFactory").mockImplementationOnce(() => () => new Store());

            await controller.load();

            const expected = 1;
            const actual = methodMock.mock.calls.length;

            expect(expected).toBe(actual);
        });

        it("should set _payments", async () => {
            const expected = [{ payment: 1 }, { payment: 2 }];
            const controller = new SubventionsPaymentsDashboardController(SIREN);
            vi.spyOn(controller, "_onSubventionsStoreUpdate").mockImplementationOnce(() => vi.fn);
            vi.spyOn(controller, "_getPaymentsFactory").mockImplementationOnce(() => vi.fn(() => expected));
            vi.spyOn(controller, "_getSubventionsStoreFactory").mockImplementationOnce(() => () => new Store());

            await controller.load();

            const actual = controller._payments;

            expect(expected).toBe(actual);
        });
    });

    describe("sort", () => {
        it("should change direction", () => {
            const controller = new SubventionsPaymentsDashboardController(SIREN);
            const expected = "desc";

            controller.sort(controller.sortColumn.value);

            const actual = controller.sortDirection.value;

            expect(actual).toBe(expected);
        });

        it("should revert elements", () => {
            const controller = new SubventionsPaymentsDashboardController(SIREN);
            const expected = [{ payment: 2 }, { payment: 1 }];

            controller.elements.set([{ payment: 1 }, { payment: 2 }]);
            controller.sort(controller.sortColumn.value);

            const actual = controller.elements.value;

            expect(actual).toEqual(expected);
        });

        it("should change sortColumn", () => {
            const controller = new SubventionsPaymentsDashboardController(SIREN);
            const expected = "other.column";

            vi.spyOn(helper, "sortByPath").mockImplementationOnce(() => []);
            vi.spyOn(controller, "_buildSortPath").mockImplementationOnce(() => []);

            controller.sort(expected);

            const actual = controller.sortColumn.value;

            expect(actual).toEqual(expected);
        });

        it("should set sortDirection to asc", () => {
            const controller = new SubventionsPaymentsDashboardController(SIREN);
            const expected = "asc";

            vi.spyOn(helper, "sortByPath").mockImplementationOnce(() => []);
            vi.spyOn(controller, "_buildSortPath").mockImplementationOnce(() => []);

            controller.sort("other.column");
            const actual = controller.sortDirection.value;

            expect(actual).toEqual(expected);
        });

        it("should call sortByPath", () => {
            const controller = new SubventionsPaymentsDashboardController(SIREN);

            const sortByPathMock = vi.spyOn(helper, "sortByPath").mockImplementationOnce(() => []);
            vi.spyOn(controller, "_buildSortPath").mockImplementationOnce(() => []);

            controller.sort("other.column");
            const actual = sortByPathMock.mock.calls.length;
            const expected = 1;

            expect(actual).toEqual(expected);
        });

        it("should call _buildSortPath", () => {
            const controller = new SubventionsPaymentsDashboardController(SIREN);

            vi.spyOn(helper, "sortByPath").mockImplementationOnce(() => []);
            const _buildSortPathMock = vi.spyOn(controller, "_buildSortPath").mockImplementationOnce(() => []);

            controller.sort("other.column");
            const actual = _buildSortPathMock.mock.calls.length;
            const expected = 1;

            expect(actual).toEqual(expected);
        });
    });

    describe("updateSelectedExercice", () => {
        it("should set selectedExercice", () => {
            const controller = new SubventionsPaymentsDashboardController(SIREN);

            vi.spyOn(controller, "_filterElementsBySelectedExercice").mockImplementationOnce(() => []);

            const expected = 18;
            controller.updateSelectedExercice(expected);
            const actual = controller.selectedExercice.value;

            expect(actual).toEqual(expected);
        });

        it("should set selectedYear", () => {
            const controller = new SubventionsPaymentsDashboardController(SIREN);

            vi.spyOn(controller, "_filterElementsBySelectedExercice").mockImplementationOnce(() => []);

            const expected = 2021;
            controller.exercices = [2020, 2021];
            controller.updateSelectedExercice(1);
            const actual = controller.selectedYear.value;

            expect(actual).toEqual(expected);
        });

        it("should call _filterElementsBySelectedExercice", () => {
            const controller = new SubventionsPaymentsDashboardController(SIREN);

            const _filterElementsBySelectedExerciceMock = vi
                .spyOn(controller, "_filterElementsBySelectedExercice")
                .mockImplementationOnce(() => []);

            const expected = 1;
            controller.updateSelectedExercice(1);
            const actual = _filterElementsBySelectedExerciceMock.mock.calls.length;

            expect(actual).toEqual(expected);
        });
    });

    describe("clickProviderLink", () => {
        let controller;
        beforeEach(() => {
            controller = new SubventionsPaymentsDashboardController();
        });

        it("should call trackerService.trackEvent", () => {
            controller.clickProviderLink();
            expect(vi.mocked(trackerService.trackEvent)).toHaveBeenCalledWith(
                "association-etablissement.dashboard.display-provider-modal",
            );
        });
    });

    describe("download()", () => {
        const mockExtractPaymentHeaders = vi.spyOn(PaymentTableController, "extractHeaders");
        const mockExtractPaymentRows = vi.spyOn(PaymentTableController, "extractRows");
        const mockExtractSubventionHeaders = vi.spyOn(SubventionTableController, "extractHeaders");
        const mockExtractSubventionRows = vi.spyOn(SubventionTableController, "extractRows");

        const spys = [
            mockExtractPaymentHeaders,
            mockExtractPaymentRows,
            mockExtractSubventionHeaders,
            mockExtractSubventionRows,
        ];

        let ctrl;

        const SUBVENTION_HEADERS = ["SUBVENTION_HEADER"];
        const SUBVENTION_ROWS_A = ["SERVICE INST. A", "DISPOSITIF A"];
        const SUBVENTION_ROWS_B = ["SERVICE INST. B", "DISPOSITIF B"];
        const VERSEMENT_HEADERS = ["VERSEMENT_HEADER"];
        const VERSEMENT_ROWS_A = ["CENTRE FINANCIER A"];
        const VERSEMENT_ROWS_B = ["CENTRE FINANCIER B"];

        beforeEach(() => {
            ctrl = new SubventionsPaymentsDashboardController(SIRET);
            mockExtractSubventionHeaders.mockImplementation(vi.fn(() => SUBVENTION_HEADERS));
            mockExtractSubventionRows.mockImplementation(vi.fn(() => [SUBVENTION_ROWS_A, SUBVENTION_ROWS_B]));
            mockExtractPaymentHeaders.mockImplementation(vi.fn(() => VERSEMENT_HEADERS));
            mockExtractPaymentRows.mockImplementation(vi.fn(() => [VERSEMENT_ROWS_A, VERSEMENT_ROWS_B]));
        });
        afterEach(() => spys.forEach(spy => spy.mockClear()));

        it.each`
            mock
            ${mockExtractPaymentHeaders}
            ${mockExtractPaymentRows}
            ${mockExtractSubventionHeaders}
            ${mockExtractSubventionRows}
        `("should call extract methods", ({ mock }) => {
            ctrl.download();
            expect(mock).toHaveBeenCalledTimes(1);
        });

        it("should call buildCsv()", () => {
            ctrl.download();
            expect(csvHelper.buildCsv).toHaveBeenCalledWith(
                [...SUBVENTION_HEADERS, ...VERSEMENT_HEADERS],
                [
                    [...SUBVENTION_ROWS_A, ...VERSEMENT_ROWS_A],
                    [...SUBVENTION_ROWS_B, ...VERSEMENT_ROWS_B],
                ],
            );
        });

        it("should increment assocation extract data", () => {
            identifierHelper.isSiret.mockImplementationOnce(() => false);
            ctrl.download();
            expect(associationService.incExtractData).toHaveBeenCalledTimes(1);
        });

        it("should increment establishment extract data", () => {
            identifierHelper.isSiret.mockImplementationOnce(() => true);
            ctrl.download();
            expect(establishmentService.incExtractData).toHaveBeenCalledTimes(1);
        });

        it("should call downloadCsv()", () => {
            ctrl.download();
            expect(csvHelper.buildCsv).toHaveBeenCalledTimes(1);
        });
    });

    describe("_filterElementsBySelectedExercice", () => {
        it("should filter elements with year is 2021", () => {
            const controller = new SubventionsPaymentsDashboardController(SIREN);
            const element2020 = { year: 2020 };
            const element2021 = { year: 2021 };

            controller.selectedYear.set(element2021.year);
            controller._fullElements = [element2020, element2021, element2021];

            controller._filterElementsBySelectedExercice();

            const expected = [element2021, element2021];
            const actual = controller.elements.value;

            expect(expected).toEqual(actual);
        });
    });

    describe("_onSubventionsStoreUpdate", () => {
        it("should set loaderStateStore", () => {
            const controller = new SubventionsPaymentsDashboardController(SIREN);

            const expected = ["value"];

            vi.spyOn(controller, "_buildLoadState").mockImplementationOnce(() => expected);
            vi.spyOn(controller, "_updateExercices").mockImplementationOnce(() => null);
            vi.spyOn(helper, "mapSubventionsAndPayments").mockImplementationOnce(() => []);

            controller._onSubventionsStoreUpdate({ subventions: [] });

            const actual = controller.loaderStateStore.value;

            expect(expected).toBe(actual);
        });

        it("should update _fullElements", () => {
            const controller = new SubventionsPaymentsDashboardController(SIREN);
            const element2020 = { year: 2020 };
            const element2021 = { year: 2021 };
            const expected = [element2020, element2021];

            vi.spyOn(controller, "_buildLoadState").mockImplementationOnce(() => []);
            vi.spyOn(controller, "_updateExercices").mockImplementationOnce(() => null);
            vi.spyOn(helper, "mapSubventionsAndPayments").mockImplementationOnce(() => expected);

            controller._onSubventionsStoreUpdate({ subventions: [] });

            const actual = controller._fullElements;

            expect(expected).toBe(actual);
        });

        it("should call _updateExercices two exercices", () => {
            const controller = new SubventionsPaymentsDashboardController(SIREN);
            const element2020 = { year: 2020 };
            const element2021 = { year: 2021 };
            const expected = [element2020.year, element2021.year];

            const _updateExercicesMock = vi.spyOn(controller, "_updateExercices").mockImplementationOnce(() => null);
            vi.spyOn(controller, "_buildLoadState").mockImplementationOnce(() => []);
            vi.spyOn(helper, "mapSubventionsAndPayments").mockImplementationOnce(() => [element2020, element2021]);

            controller._onSubventionsStoreUpdate({ subventions: [] });

            const actual = _updateExercicesMock.mock.calls[0][0]; // First call, first agrument

            expect(actual).toEqual(expected);
        });
        it("should call _updateExercices with two sorted exercices", () => {
            const controller = new SubventionsPaymentsDashboardController(SIREN);
            const element2020 = { year: 2020 };
            const element2021 = { year: 2021 };
            const expected = [element2020.year, element2021.year];

            const _updateExercicesMock = vi.spyOn(controller, "_updateExercices").mockImplementationOnce(() => null);
            vi.spyOn(controller, "_buildLoadState").mockImplementationOnce(() => []);
            vi.spyOn(helper, "mapSubventionsAndPayments").mockImplementationOnce(() => [element2021, element2020]);

            controller._onSubventionsStoreUpdate({ subventions: [] });

            const actual = _updateExercicesMock.mock.calls[0][0]; // First call, first agrument

            expect(actual).toEqual(expected);
        });
    });

    describe("_updateExercices", () => {
        it("should set exercices", () => {
            const controller = new SubventionsPaymentsDashboardController(SIREN);

            vi.spyOn(controller, "updateSelectedExercice").mockImplementationOnce(() => []);
            vi.spyOn(controller, "_buildExercices").mockImplementationOnce(() => []);

            const expected = [{ exercice: 1 }, { exercice: 2 }];
            controller._updateExercices(expected);
            const actual = controller.exercices;

            expect(actual).toEqual(expected);
        });

        it("should set exercicesOptions", () => {
            const controller = new SubventionsPaymentsDashboardController(SIREN);
            const expected = [{ exercice: 1 }, { exercice: 2 }];

            vi.spyOn(controller, "updateSelectedExercice").mockImplementationOnce(() => []);
            vi.spyOn(controller, "_buildExercices").mockImplementationOnce(() => expected);

            controller._updateExercices(expected);
            const actual = controller.exercicesOptions.value;

            expect(actual).toEqual(expected);
        });

        it("should call updateSelectedExercice", () => {
            const controller = new SubventionsPaymentsDashboardController(SIREN);
            const exercices = [{ exercice: 1 }, { exercice: 2 }];

            const updateSelectedExerciceMock = vi
                .spyOn(controller, "updateSelectedExercice")
                .mockImplementationOnce(() => []);
            vi.spyOn(controller, "_buildExercices").mockImplementationOnce(() => exercices);
            controller._updateExercices(exercices);
            const actual = updateSelectedExerciceMock.mock.calls.length;
            const expected = 1;

            expect(actual).toEqual(expected);
        });
    });

    describe("_buildExercices", () => {
        it("should return computed exercices data view", () => {
            const controller = new SubventionsPaymentsDashboardController(SIREN);
            const element2020 = { year: 2020 };
            const element2021 = { year: 2021 };
            controller.exercices = [element2020.year, element2021.year];

            const expected = [
                { value: 0, label: `Exercice ${element2020.year} (année civile)` },
                { value: 1, label: `Exercice ${element2021.year} (année civile)` },
            ];

            const actual = controller._buildExercices();

            expect(actual).toEqual(expected);
        });
    });

    describe("_buildSortPath", () => {
        it("should return path", () => {
            const controller = new SubventionsPaymentsDashboardController(SIREN);
            const expected = "object.path.value";
            const actual = controller._buildSortPath(expected);

            expect(actual).toBe(expected);
        });

        it("should return path with specific arguments", () => {
            const controller = new SubventionsPaymentsDashboardController(SIREN);
            const columnName = "object.date";
            const expected = "object.lastDate";
            const actual = controller._buildSortPath(columnName);

            expect(actual).toBe(expected);
        });
    });

    describe("_getSubventionsStoreFactory", () => {
        it.skip("should return etablissement method", () => {
            // Skip for hotfix
            identifierHelper.isSiret.mockImplementationOnce(() => true);
            const controller = new SubventionsPaymentsDashboardController(SIRET);
            const expected = subventionsService.getEtablissementsSubventionsStore;

            const actual = controller._getSubventionsStoreFactory();

            expect(actual).toBe(expected);
        });

        it.skip("should return association method", () => {
            // Skip for hotfix
            identifierHelper.isSiret.mockImplementationOnce(() => false);
            const controller = new SubventionsPaymentsDashboardController(SIREN);
            const expected = subventionsService.getAssociationsSubventionsStore;

            const actual = controller._getSubventionsStoreFactory();

            expect(actual).toBe(expected);
        });
    });

    describe("_getPaymentsFactory", () => {
        it("should return etablissement method", () => {
            identifierHelper.isSiret.mockImplementationOnce(() => true);
            const controller = new SubventionsPaymentsDashboardController(SIRET);
            const expected = paymentsService.getEtablissementPayments;

            const actual = controller._getPaymentsFactory();

            expect(actual).toBe(expected);
        });

        it("should return association method", () => {
            identifierHelper.isSiret.mockImplementationOnce(() => false);
            const controller = new SubventionsPaymentsDashboardController(SIREN);
            const expected = paymentsService.getAssociationPayments;

            const actual = controller._getPaymentsFactory();

            expect(actual).toBe(expected);
        });
    });
});
