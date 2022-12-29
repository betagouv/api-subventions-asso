import Store from "../../core/Store";
import SubventionsVersementsDashboardController from "./SubventionsVersementsDashboard.controller";
import * as helper from "./helper";
import subventionsService from "../../resources/subventions/subventions.service";
import versementsService from "../../resources/versements/versements.service";

describe("SubventionsVersementsDashboardController", () => {
    const SIREN = "123456789";
    const SIRET = SIREN + "00012";

    describe("load", () => {
        it("should call method _getSubventionsStoreFactory", async () => {
            const controller = new SubventionsVersementsDashboardController(SIREN);
            const methodMock = jest
                .spyOn(controller, "_getSubventionsStoreFactory")
                .mockImplementationOnce(() => () => new Store());
            jest.spyOn(controller, "_getVersementsFactory").mockImplementationOnce(() => jest.fn);
            jest.spyOn(controller, "_onSubventionsStoreUpdate").mockImplementationOnce(() => jest.fn);

            await controller.load();

            const expected = 1;
            const actual = methodMock.mock.calls.length;

            expect(expected).toBe(actual);
        });

        it("should call method _getVersementsFactory", async () => {
            const controller = new SubventionsVersementsDashboardController(SIREN);
            const methodMock = jest.spyOn(controller, "_getVersementsFactory").mockImplementationOnce(() => jest.fn);
            jest.spyOn(controller, "_getSubventionsStoreFactory").mockImplementationOnce(() => () => new Store());
            jest.spyOn(controller, "_onSubventionsStoreUpdate").mockImplementationOnce(() => jest.fn);

            await controller.load();

            const expected = 1;
            const actual = methodMock.mock.calls.length;

            expect(expected).toBe(actual);
        });

        it("should call method _onSubventionsStoreUpdate", async () => {
            const controller = new SubventionsVersementsDashboardController(SIREN);
            const methodMock = jest
                .spyOn(controller, "_onSubventionsStoreUpdate")
                .mockImplementationOnce(() => jest.fn);
            jest.spyOn(controller, "_getVersementsFactory").mockImplementationOnce(() => jest.fn);
            jest.spyOn(controller, "_getSubventionsStoreFactory").mockImplementationOnce(() => () => new Store());

            await controller.load();

            const expected = 1;
            const actual = methodMock.mock.calls.length;

            expect(expected).toBe(actual);
        });

        it("should set _versements", async () => {
            const expected = [{ versement: 1 }, { versement: 2 }];
            const controller = new SubventionsVersementsDashboardController(SIREN);
            jest.spyOn(controller, "_onSubventionsStoreUpdate").mockImplementationOnce(() => jest.fn);
            jest.spyOn(controller, "_getVersementsFactory").mockImplementationOnce(() => () => expected);
            jest.spyOn(controller, "_getSubventionsStoreFactory").mockImplementationOnce(() => () => new Store());

            await controller.load();

            const actual = controller._versements;

            expect(expected).toBe(actual);
        });
    });

    describe("sort", () => {
        it("should change direction", () => {
            const controller = new SubventionsVersementsDashboardController(SIREN);
            const expected = "desc";

            controller.sort(controller.sortColumn.value);

            const actual = controller.sortDirection.value;

            expect(actual).toBe(expected);
        });

        it("should revert elements", () => {
            const controller = new SubventionsVersementsDashboardController(SIREN);
            const expected = [{ versement: 2 }, { versement: 1 }];

            controller.elements.set([{ versement: 1 }, { versement: 2 }]);
            controller.sort(controller.sortColumn.value);

            const actual = controller.elements.value;

            expect(actual).toEqual(expected);
        });

        it("should change sortColumn", () => {
            const controller = new SubventionsVersementsDashboardController(SIREN);
            const expected = "other.column";

            jest.spyOn(helper, "sortByPath").mockImplementationOnce(() => []);
            jest.spyOn(controller, "_buildSortPath").mockImplementationOnce(() => []);

            controller.sort(expected);

            const actual = controller.sortColumn.value;

            expect(actual).toEqual(expected);
        });

        it("should set sortDirection to asc", () => {
            const controller = new SubventionsVersementsDashboardController(SIREN);
            const expected = "asc";

            jest.spyOn(helper, "sortByPath").mockImplementationOnce(() => []);
            jest.spyOn(controller, "_buildSortPath").mockImplementationOnce(() => []);

            controller.sort("other.column");
            const actual = controller.sortDirection.value;

            expect(actual).toEqual(expected);
        });

        it("should call sortByPath", () => {
            const controller = new SubventionsVersementsDashboardController(SIREN);

            const sortByPathMock = jest.spyOn(helper, "sortByPath").mockImplementationOnce(() => []);
            jest.spyOn(controller, "_buildSortPath").mockImplementationOnce(() => []);

            controller.sort("other.column");
            const actual = sortByPathMock.mock.calls.length;
            const expected = 1;

            expect(actual).toEqual(expected);
        });

        it("should call _buildSortPath", () => {
            const controller = new SubventionsVersementsDashboardController(SIREN);

            jest.spyOn(helper, "sortByPath").mockImplementationOnce(() => []);
            const _buildSortPathMock = jest.spyOn(controller, "_buildSortPath").mockImplementationOnce(() => []);

            controller.sort("other.column");
            const actual = _buildSortPathMock.mock.calls.length;
            const expected = 1;

            expect(actual).toEqual(expected);
        });
    });

    describe("updateSelectedExercice", () => {
        it("should set selectedExercice", () => {
            const controller = new SubventionsVersementsDashboardController(SIREN);

            jest.spyOn(controller, "_filterElementsBySelectedExercice").mockImplementationOnce(() => []);

            const expected = 18;
            controller.updateSelectedExercice(expected);
            const actual = controller.selectedExercice.value;

            expect(actual).toEqual(expected);
        });

        it("should set selectedYear", () => {
            const controller = new SubventionsVersementsDashboardController(SIREN);

            jest.spyOn(controller, "_filterElementsBySelectedExercice").mockImplementationOnce(() => []);

            const expected = 2021;
            controller.exercices = [2020, 2021];
            controller.updateSelectedExercice(1);
            const actual = controller.selectedYear.value;

            expect(actual).toEqual(expected);
        });

        it("should call _filterElementsBySelectedExercice", () => {
            const controller = new SubventionsVersementsDashboardController(SIREN);

            const _filterElementsBySelectedExerciceMock = jest
                .spyOn(controller, "_filterElementsBySelectedExercice")
                .mockImplementationOnce(() => []);

            const expected = 1;
            controller.updateSelectedExercice(1);
            const actual = _filterElementsBySelectedExerciceMock.mock.calls.length;

            expect(actual).toEqual(expected);
        });
    });

    describe("_filterElementsBySelectedExercice", () => {
        it("should filter elements with year is 2021", () => {
            const controller = new SubventionsVersementsDashboardController(SIREN);
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
            const controller = new SubventionsVersementsDashboardController(SIREN);

            const expected = ["value"];

            jest.spyOn(controller, "_buildLoadState").mockImplementationOnce(() => expected);
            jest.spyOn(controller, "_updateExercices").mockImplementationOnce(() => null);
            jest.spyOn(helper, "mapSubventionsAndVersements").mockImplementationOnce(() => []);

            controller._onSubventionsStoreUpdate({ subventions: [] });

            const actual = controller.loaderStateStore.value;

            expect(expected).toBe(actual);
        });

        it("should update _fullElements", () => {
            const controller = new SubventionsVersementsDashboardController(SIREN);
            const element2020 = { year: 2020 };
            const element2021 = { year: 2021 };
            const expected = [element2020, element2021];

            jest.spyOn(controller, "_buildLoadState").mockImplementationOnce(() => []);
            jest.spyOn(controller, "_updateExercices").mockImplementationOnce(() => null);
            jest.spyOn(helper, "mapSubventionsAndVersements").mockImplementationOnce(() => expected);

            controller._onSubventionsStoreUpdate({ subventions: [] });

            const actual = controller._fullElements;

            expect(expected).toBe(actual);
        });

        it("should call _updateExercices two exercices", () => {
            const controller = new SubventionsVersementsDashboardController(SIREN);
            const element2020 = { year: 2020 };
            const element2021 = { year: 2021 };
            const expected = [element2020.year, element2021.year];

            const _updateExercicesMock = jest.spyOn(controller, "_updateExercices").mockImplementationOnce(() => null);
            jest.spyOn(controller, "_buildLoadState").mockImplementationOnce(() => []);
            jest.spyOn(helper, "mapSubventionsAndVersements").mockImplementationOnce(() => [element2020, element2021]);

            controller._onSubventionsStoreUpdate({ subventions: [] });

            const actual = _updateExercicesMock.mock.calls[0][0]; // First call, first agrument

            expect(actual).toEqual(expected);
        });
        it("should call _updateExercices with two sorted exercices", () => {
            const controller = new SubventionsVersementsDashboardController(SIREN);
            const element2020 = { year: 2020 };
            const element2021 = { year: 2021 };
            const expected = [element2020.year, element2021.year];

            const _updateExercicesMock = jest.spyOn(controller, "_updateExercices").mockImplementationOnce(() => null);
            jest.spyOn(controller, "_buildLoadState").mockImplementationOnce(() => []);
            jest.spyOn(helper, "mapSubventionsAndVersements").mockImplementationOnce(() => [element2021, element2020]);

            controller._onSubventionsStoreUpdate({ subventions: [] });

            const actual = _updateExercicesMock.mock.calls[0][0]; // First call, first agrument

            expect(actual).toEqual(expected);
        });
    });

    describe("_updateExercices", () => {
        it("should set exercices", () => {
            const controller = new SubventionsVersementsDashboardController(SIREN);

            jest.spyOn(controller, "updateSelectedExercice").mockImplementationOnce(() => []);
            jest.spyOn(controller, "_buildExercices").mockImplementationOnce(() => []);

            const expected = [{ exercice: 1 }, { exercice: 2 }];
            controller._updateExercices(expected);
            const actual = controller.exercices;

            expect(actual).toEqual(expected);
        });

        it("should set exercicesOptions", () => {
            const controller = new SubventionsVersementsDashboardController(SIREN);
            const expected = [{ exercice: 1 }, { exercice: 2 }];

            jest.spyOn(controller, "updateSelectedExercice").mockImplementationOnce(() => []);
            jest.spyOn(controller, "_buildExercices").mockImplementationOnce(() => expected);

            controller._updateExercices(expected);
            const actual = controller.exercicesOptions.value;

            expect(actual).toEqual(expected);
        });

        it("should call updateSelectedExercice", () => {
            const controller = new SubventionsVersementsDashboardController(SIREN);
            const exercices = [{ exercice: 1 }, { exercice: 2 }];

            const updateSelectedExerciceMock = jest
                .spyOn(controller, "updateSelectedExercice")
                .mockImplementationOnce(() => []);
            jest.spyOn(controller, "_buildExercices").mockImplementationOnce(() => exercices);
            controller._updateExercices(exercices);
            const actual = updateSelectedExerciceMock.mock.calls.length;
            const expected = 1;

            expect(actual).toEqual(expected);
        });

        it("should dont call updateSelectedExercice", () => {
            const controller = new SubventionsVersementsDashboardController(SIREN);
            const exercices = [{ exercice: 1 }, { exercice: 2 }];

            const updateSelectedExerciceMock = jest
                .spyOn(controller, "updateSelectedExercice")
                .mockImplementationOnce(() => []);
            jest.spyOn(controller, "_buildExercices").mockImplementationOnce(() => exercices);

            controller.selectedExercice.set(1);

            controller._updateExercices(exercices);
            const actual = updateSelectedExerciceMock.mock.calls.length;
            const expected = 0;

            expect(actual).toEqual(expected);
        });
    });

    describe("_buildExercices", () => {
        it("should return computed exercices data view", () => {
            const controller = new SubventionsVersementsDashboardController(SIREN);
            const element2020 = { year: 2020 };
            const element2021 = { year: 2021 };
            controller.exercices = [element2020.year, element2021.year];

            const expected = [
                { value: 0, label: `Exercice ${element2020.year} (année civile)` },
                { value: 1, label: `Exercice ${element2021.year} (année civile)` }
            ];

            const actual = controller._buildExercices();

            expect(actual).toEqual(expected);
        });
    });

    describe("_buildSortPath", () => {
        it("should return path", () => {
            const controller = new SubventionsVersementsDashboardController(SIREN);
            const expected = "object.path.value";
            const actual = controller._buildSortPath(expected);

            expect(actual).toBe(expected);
        });

        it("should return path with specific arguments", () => {
            const controller = new SubventionsVersementsDashboardController(SIREN);
            const columnName = "object.date";
            const expected = "object.lastDate";
            const actual = controller._buildSortPath(columnName);

            expect(actual).toBe(expected);
        });
    });

    describe("_getSubventionsStoreFactory", () => {
        it("should return etablissement method", () => {
            const controller = new SubventionsVersementsDashboardController(SIRET);
            const expected = subventionsService.getEtablissementsSubventionsStore;

            const actual = controller._getSubventionsStoreFactory();

            expect(actual).toBe(expected);
        });

        it("should return association method", () => {
            const controller = new SubventionsVersementsDashboardController(SIREN);
            const expected = subventionsService.getAssociationsSubventionsStore;

            const actual = controller._getSubventionsStoreFactory();

            expect(actual).toBe(expected);
        });
    });

    describe("_getVersementsFactory", () => {
        it("should return etablissement method", () => {
            const controller = new SubventionsVersementsDashboardController(SIRET);
            const expected = versementsService.getEtablissementVersements;

            const actual = controller._getVersementsFactory();

            expect(actual).toBe(expected);
        });

        it("should return association method", () => {
            const controller = new SubventionsVersementsDashboardController(SIREN);
            const expected = versementsService.getAssociationVersements;

            const actual = controller._getVersementsFactory();

            expect(actual).toBe(expected);
        });
    });
});
