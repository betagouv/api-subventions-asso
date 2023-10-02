import { HomeController } from "./Home.controller";
import { isRna, isSiren, isSiret, isStartOfSiret } from "$lib/helpers/validatorHelper";
import associationService from "$lib/resources/associations/association.service";
import { goto } from "$app/navigation";

vi.mock("$lib/helpers/validatorHelper");
vi.mock("$app/navigation", () => ({ goto: vi.fn() }));

describe("HomeController", () => {
    const INPUT = "je suis la recherche";
    let ctrl = new HomeController();
    beforeAll(() => (ctrl = new HomeController()));

    describe("constructor", () => {
        beforeEach(() => (ctrl = new HomeController()));

        it.each`
            parameterName       | expected
            ${"_searchCache"}   | ${new Map()}
            ${"successMessage"} | ${undefined}
        `("initializes correctly $parameterName", ({ parameterName, expected }) => {
            expect(ctrl[parameterName]).toEqual(expected);
        });

        it.each`
            parameterName      | expected
            ${"isLoading"}     | ${false}
            ${"searchResult"}  | ${[]}
            ${"input"}         | ${""}
            ${"currentSearch"} | ${null}
        `("initializes correctly $parameterName store", ({ parameterName, expected }) => {
            expect(ctrl[parameterName].value).toEqual(expected);
        });

        it("initializes correctly successMessage", () => {
            ctrl = new HomeController({ success: "ACCOUNT_ACTIVATED" });
            const actual = ctrl.successMessage;
            expect(actual).toMatchInlineSnapshot(`
              {
                "content": "Vous pouvez commencer à effectuer vos recherches",
                "title": "Bravo, votre compte a été créé !",
              }
            `);
        });
    });

    describe("onInput", () => {
        let debounceLoadSpy, debounceSearchSpy;
        beforeAll(() => {
            debounceLoadSpy = vi.spyOn(ctrl, "_debouncedInitSearch").mockImplementation(vi.fn());
            debounceSearchSpy = vi.spyOn(ctrl, "_debouncedPerformSearch").mockImplementation(vi.fn());
        });
        afterAll(() => {
            debounceSearchSpy.mockRestore();
            debounceLoadSpy.mockRestore();
        });

        it("does not call any debounce if input is too short", () => {
            const shortInput = "ta";
            ctrl.onInput(shortInput);
            expect(debounceSearchSpy).not.toHaveBeenCalled() && expect(debounceLoadSpy).not.toHaveBeenCalled();
        });

        it("calls debounced initSearch", () => {
            ctrl.onInput(INPUT);
            expect(debounceLoadSpy).toHaveBeenCalled();
        });

        it("calls debounced search with proper arg", () => {
            ctrl.onInput(INPUT);
            expect(debounceSearchSpy).toHaveBeenCalledWith(INPUT);
        });
    });

    describe("_initSearch", () => {
        it("sets nothing if already loading", () => {
            ctrl = new HomeController();
            ctrl.isLoading.set(true);
            const setLoadingSpy = vi.spyOn(ctrl.isLoading, "set");
            ctrl._initSearch();
            expect(setLoadingSpy).not.toHaveBeenCalled();
        });

        it("loads loading to true", () => {
            ctrl = new HomeController();
            const setLoadingSpy = vi.spyOn(ctrl.isLoading, "set");
            ctrl._initSearch();
            expect(setLoadingSpy).toHaveBeenCalledWith(true);
        });
    });

    describe("_performSearch", () => {
        const INPUT_NO_SPACE = "jesuislarecherche";
        let removeSpaceSpy, setSearchSpy;

        beforeAll(() => {
            ctrl = new HomeController();
            removeSpaceSpy = vi.spyOn(ctrl, "_removeSpaceFromIdentifier").mockReturnValue(INPUT_NO_SPACE);
            setSearchSpy = vi.spyOn(ctrl.currentSearch, "set");
        });
        afterAll(() => {
            removeSpaceSpy.mockRestore();
            setSearchSpy.mockRestore();
        });

        it("calls removeSpace", () => {
            ctrl._performSearch(INPUT);
            expect(removeSpaceSpy).toHaveBeenCalledWith(INPUT);
        });

        it("returns if text is identical", () => {
            ctrl.currentSearch.value = { text: INPUT_NO_SPACE };
            setSearchSpy.mockClear();
            ctrl._performSearch(INPUT);
            expect(setSearchSpy).not.toHaveBeenCalled();
        });

        it("sets new search", () => {
            ctrl.currentSearch.value = null;
            setSearchSpy.mockClear();
            ctrl._performSearch(INPUT);
            expect(setSearchSpy.mock.calls[0][0]).toMatchObject({ text: INPUT_NO_SPACE });
        });

        describe("newly created promise", () => {
            let searchSpy, finishSearchSpy;

            beforeAll(() => {
                searchSpy = vi.spyOn(ctrl, "_searchAndCache").mockResolvedValue({});
                finishSearchSpy = vi.spyOn(ctrl, "_finishSearch").mockImplementation(vi.fn());
            });
            afterAll(() => {
                searchSpy.mockRestore();
                finishSearchSpy.mockRestore();
            });
            beforeEach(() => {
                ctrl.currentSearch.value = null;
            });

            function getPromise() {
                ctrl._performSearch(INPUT);
                return ctrl.currentSearch.value.promise;
            }

            it("calls searchAndCache", async () => {
                await getPromise();
                expect(searchSpy).toHaveBeenCalledWith(INPUT_NO_SPACE);
            });

            it("calls _finishSearch", async () => {
                const RESULT = "result";
                searchSpy.mockResolvedValueOnce(RESULT);
                await getPromise();
                expect(finishSearchSpy).toHaveBeenCalledWith(INPUT_NO_SPACE, RESULT);
            });
        });
    });

    describe("_finishSearch", () => {
        let setLoadingSpy, setResultSpy;
        const RESULT = "result";

        beforeAll(() => {
            setLoadingSpy = vi.spyOn(ctrl.isLoading, "set");
            setResultSpy = vi.spyOn(ctrl.searchResult, "set");
        });

        it("sets nothing if text is different than current", () => {
            ctrl.currentSearch.value = { text: "not the same text" };
            ctrl._finishSearch(INPUT, RESULT);
            expect(setLoadingSpy).not.toHaveBeenCalled() && expect(setResultSpy).not.toHaveBeenCalled();
        });

        it("sets loading to false", () => {
            ctrl.currentSearch.value = { text: INPUT };
            ctrl._finishSearch(INPUT, RESULT);
            expect(setLoadingSpy).toHaveBeenCalledWith(false);
        });

        it("sets searchResult to result", () => {
            ctrl.currentSearch.value = { text: INPUT };
            ctrl._finishSearch(INPUT, RESULT);
            expect(setResultSpy).toHaveBeenCalledWith(RESULT);
        });

        it("sets searchResult to empty list", () => {
            ctrl.currentSearch.value = { text: INPUT };
            ctrl._finishSearch(INPUT, undefined);
            expect(setResultSpy).toHaveBeenCalledWith([]);
        });

        it("returns back result from args", () => {
            const expected = RESULT;
            ctrl.currentSearch.value = { text: INPUT };
            const actual = ctrl._finishSearch(INPUT, RESULT);
            expect(actual).toBe(expected);
        });
    });

    describe("onSubmit", () => {
        const IDENTIFIER = "identifier";

        beforeAll(() => {
            isRna.mockReturnValue(false);
            isSiren.mockReturnValue(false);
            isSiret.mockReturnValue(false);
            ctrl.input.value = IDENTIFIER;
        });
        afterAll(() => {
            isRna.mockRestore();
            isSiren.mockRestore();
            isSiret.mockRestore();
        });

        it.each`
            dataType   | structure          | expected                          | helper
            ${"rna"}   | ${"association"}   | ${`/association/${IDENTIFIER}`}   | ${isRna}
            ${"siren"} | ${"association"}   | ${`/association/${IDENTIFIER}`}   | ${isSiren}
            ${"siret"} | ${"etablissement"} | ${`/etablissement/${IDENTIFIER}`} | ${isSiret}
        `("updates href to given $structure from $dataType", ({ expected, helper }) => {
            helper.mockReturnValueOnce(true);
            ctrl.onSubmit();
            expect(goto).toHaveBeenCalledWith(expected);
        });

        it.each`
            dataType
            ${"rna"}
            ${"siren"}
        `("updates href to given association from first search result's $dataType", ({ dataType }) => {
            const expected = `/association/${IDENTIFIER}`;
            ctrl.searchResult.value = [{ [dataType]: IDENTIFIER }];
            ctrl.onSubmit();
            expect(goto).toHaveBeenCalledWith(expected);
        });
    });

    describe("_searchAndCache", () => {
        let spyHas, spyGet, spySet, spyService;

        beforeAll(() => {
            spyHas = vi.spyOn(ctrl._searchCache, "has").mockReturnValue(false);
            spyGet = vi.spyOn(ctrl._searchCache, "get");
            spySet = vi.spyOn(ctrl._searchCache, "set");
            spyService = vi.spyOn(associationService, "search").mockResolvedValue([]);
        });

        afterAll(() => {
            spyHas.mockRestore();
        });

        it("returns result from cache", async () => {
            const RES = "result";
            spyHas.mockReturnValueOnce(true);
            spyGet.mockReturnValue(RES);
            const expected = RES;
            const actual = await ctrl._searchAndCache(INPUT);
            expect(actual).toEqual(expected);
        });

        it("calls search from association service", async () => {
            await ctrl._searchAndCache(INPUT);
            expect(spyService).toHaveBeenCalledWith(INPUT);
        });

        it("sets sliced result in cache from association service", async () => {
            spyService.mockResolvedValueOnce(new Array(25));
            const actual = await ctrl._searchAndCache(INPUT);
            const expected = new Array(20);
            expect(actual).toEqual(expected);
        });

        it("returns sliced result from association service", async () => {
            spyService.mockResolvedValueOnce(new Array(25));
            await ctrl._searchAndCache(INPUT);
            const expected = new Array(20);
            expect(spySet).toHaveBeenCalledWith(INPUT, expected);
        });
    });

    describe("_removeSpaceFromIdentifier", () => {
        const INPUT_NO_SPACE = "jesuislarecherche";

        beforeAll(() => {
            isRna.mockReturnValue(false);
            isStartOfSiret(false);
        });
        afterAll(() => {
            isRna.mockRestore();
            isStartOfSiret.mockRestore();
        });

        it.each`
            helper            | dataType
            ${isRna}          | ${"rna"}
            ${isStartOfSiret} | ${"start of siret"}
        `("returns spaceless input is $dataType", ({ helper }) => {
            helper.mockReturnValueOnce(true);
            const expected = INPUT_NO_SPACE;
            const actual = ctrl._removeSpaceFromIdentifier(INPUT);
            expect(actual).toBe(expected);
        });

        it("returns full input", () => {
            const expected = INPUT;
            const actual = ctrl._removeSpaceFromIdentifier(INPUT);
            expect(actual).toBe(expected);
        });
    });
});
