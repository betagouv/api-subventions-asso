import { type AdminStructureDto, AdminTerritorialLevel, AgentTypeEnum } from "dto";
import type { MockInstance } from "vitest";
import DecentralizedSubStepController from "./DecentralizedSubStep.controller";
import Store from "$lib/core/Store";
import subscriptionFormService from "$lib/resources/auth/subscriptionForm/subscriptionForm.service";
import geoService from "$lib/resources/externals/geo/geo.service";

vi.mock("$lib/resources/auth/subscriptionForm/subscriptionForm.service");
vi.mock("$lib/resources/externals/geo/geo.service");
vi.mock("$lib/core/Dispatch", () => ({
    default: {
        getDispatcher: () => vi.fn(),
    },
}));

describe("DecentralizedSubStep", () => {
    let ctrl: DecentralizedSubStepController;
    const REGION_STRUCTURE = {
        agentType: AgentTypeEnum.OPERATOR,
        territorialLevel: AdminTerritorialLevel.REGIONAL,
        structure: "someOtherStructure",
    };
    const STRUCTURES: AdminStructureDto[] = [
        {
            agentType: AgentTypeEnum.OPERATOR,
            territorialLevel: AdminTerritorialLevel.DEPARTMENTAL,
            structure: "someStructure",
        },
        REGION_STRUCTURE,
    ];

    beforeAll(() => {
        ctrl = new DecentralizedSubStepController();
    });

    describe("constructor", () => {
        beforeEach(() => {
            ctrl = new DecentralizedSubStepController();
        });
        it("initializes allStructures", () => {
            // @ts-expect-error test private
            const actual = ctrl.allStructures;
            const expected: AdminStructureDto[] = [];
            expect(actual).toEqual(expected);
        });

        it.each`
            store
            ${"departmentOptions"}
            ${"structureOptions"}
        `("initializes $store store", ({ store }) => {
            const actual = (ctrl[store] as Store<never[]>).value;
            const expected: never[] = [];
            expect(actual).toEqual(expected);
        });
    });

    describe("init", () => {
        const INITIAL_VALUES = { decentralizedLevel: AdminTerritorialLevel.OVERSEAS };
        let setOptionsMock: MockInstance;

        beforeAll(() => {
            vi.mocked(subscriptionFormService.getStructures).mockResolvedValue(STRUCTURES);
            ctrl = new DecentralizedSubStepController();
            // @ts-expect-error private
            setOptionsMock = vi.spyOn(ctrl, "setOptions");
        });

        it("gets structures with proper agentType", async () => {
            await ctrl.init(INITIAL_VALUES);
            expect(subscriptionFormService.getStructures).toHaveBeenCalledWith(AgentTypeEnum.DECONCENTRATED_ADMIN);
        });

        it("updates allStructures thanks to call", async () => {
            await ctrl.init(INITIAL_VALUES);
            const expected = STRUCTURES;
            // @ts-expect-error test private
            const actual = ctrl.allStructures;
            expect(actual).toEqual(expected);
        });

        it("initializes options", async () => {
            await ctrl.init(INITIAL_VALUES);
            expect(setOptionsMock).toHaveBeenCalled();
        });

        it("doesn't initialize options if unknown territorial level", async () => {
            await ctrl.init();
            expect(setOptionsMock).not.toHaveBeenCalled();
        });
    });

    describe("onChoosingLevel", () => {
        const LEVEL = AdminTerritorialLevel.DEPARTMENTAL;
        let setOptionsMock: MockInstance;

        beforeAll(() => {
            ctrl = new DecentralizedSubStepController();
            // @ts-expect-error private
            setOptionsMock = vi.spyOn(ctrl, "setOptions").mockImplementation(vi.fn());
        });

        afterAll(() => {
            ctrl = new DecentralizedSubStepController();
            setOptionsMock.mockRestore();
        });

        it("calls setOptions with proper arg", () => {
            ctrl.onChoosingLevel({ label: "anything", value: LEVEL });
            expect(setOptionsMock).toHaveBeenCalledWith(LEVEL);
        });
    });

    describe("setOptions", () => {
        beforeAll(() => {
            ctrl = new DecentralizedSubStepController();
        });
        describe.each`
            methodName                | terrLevel
            ${"onChoosingDepartment"} | ${AdminTerritorialLevel.DEPARTMENTAL}
        `("case $terrLevel", ({ methodName, terrLevel }) => {
            let terrSpy: MockInstance;
            let filterStructuresSpy: MockInstance;

            beforeAll(() => {
                terrSpy = vi.spyOn(ctrl, methodName).mockImplementation(vi.fn());
                // @ts-expect-error test private
                filterStructuresSpy = vi.spyOn(ctrl, "filterStructureOptions").mockImplementation(vi.fn());
            });

            afterAll(() => {
                terrSpy.mockReset();
                filterStructuresSpy.mockReset();
            });

            it("calls filterStructureOptions with proper arg", () => {
                // @ts-expect-error private
                ctrl.setOptions(terrLevel);
                expect(filterStructuresSpy).toHaveBeenCalledWith(terrLevel);
            });

            it("calls specific method to update territory options", () => {
                // @ts-expect-error private
                ctrl.setOptions(terrLevel);
                expect(terrSpy).toHaveBeenCalled();
            });
        });
    });

    describe("filterStructureOptions", () => {
        beforeAll(() => {
            ctrl = new DecentralizedSubStepController();
        });
        it("sets structureOptions with filtered structure options", () => {
            // @ts-expect-error test private
            ctrl.allStructures = STRUCTURES;
            // @ts-expect-error test private
            ctrl.filterStructureOptions(AdminTerritorialLevel.REGIONAL);
            const actual = ctrl.structureOptions.value;
            expect(actual).toMatchInlineSnapshot(`
              [
                {
                  "label": "someOtherStructure",
                  "value": "someOtherStructure",
                },
              ]
            `);
        });
    });

    describe("fillOptionsOnce", () => {
        beforeAll(() => {
            ctrl = new DecentralizedSubStepController();
        });
        const TERRITORIES = [
            { code: "50", name: "Wonderland" },
            { code: "10", name: "Netherland" },
        ];

        const optionStore: Store<unknown[]> = new Store([]);
        const serviceMethod = vi.fn(() => TERRITORIES);
        const transform = vi.fn(({ code, label }) => `${code} ${label}`);

        beforeEach(() => {
            optionStore.value = [];
        });

        it("if store value is not empty do not call service", () => {
            optionStore.set([{ label: "", value: "" }]);
            // @ts-expect-error -- test private
            ctrl.fillOptionsOnce(optionStore, serviceMethod, transform);
            expect(serviceMethod).not.toHaveBeenCalled();
        });

        it("calls service", () => {
            // @ts-expect-error -- test private
            ctrl.fillOptionsOnce(optionStore, serviceMethod, transform);
            expect(serviceMethod).toHaveBeenCalled();
        });

        it("sets options as results from transform arg", () => {
            // @ts-expect-error -- test private
            ctrl.fillOptionsOnce(optionStore, serviceMethod, transform);
            const actual = optionStore.value;
            expect(actual).toMatchInlineSnapshot("[]");
        });
    });

    describe.each`
        optionStoreName        | testedMethod              | geoServiceMethod     | expectedTransform
        ${"departmentOptions"} | ${"onChoosingDepartment"} | ${"getDepartements"} | ${"50 - terr"}
    `("onChoosingDepartment", ({ optionStoreName, testedMethod, geoServiceMethod, expectedTransform }) => {
        beforeAll(() => {
            ctrl = new DecentralizedSubStepController();
        });
        let fillOptionsSpy: MockInstance;
        const TERR_OPTIONS = [{ value: "terr", label: "terr" }];
        const TERR = { code: "50", nom: "terr" };

        beforeAll(() => {
            // @ts-expect-error -- test private
            fillOptionsSpy = vi.spyOn(ctrl, "fillOptionsOnce");
            ctrl[optionStoreName].value = TERR_OPTIONS;
        });

        afterAll(() => {
            fillOptionsSpy.mockReset();
        });

        it("call fillOptionsOnce", () => {
            ctrl[testedMethod]();
            expect(fillOptionsSpy).toHaveBeenCalled();
        });

        it("calls it with options store", () => {
            const expected = TERR_OPTIONS;
            ctrl[testedMethod]();
            const actual = fillOptionsSpy.mock.calls[0][0].value;
            expect(actual).toEqual(expected);
        });

        it("calls geoService service", () => {
            ctrl[testedMethod]();
            const service = fillOptionsSpy.mock.calls[0][1];
            service();
            expect(geoService[geoServiceMethod]).toHaveBeenCalled();
        });

        it("transforms department to code - name", () => {
            const expected = expectedTransform;
            ctrl[testedMethod]();
            const transform = fillOptionsSpy.mock.calls[0][2];
            const actual = transform(TERR);
            expect(actual).toEqual(expected);
        });
    });
});
