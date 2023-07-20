import { MonthlyGraphTooltipController } from "./MonthlyGraphTooltip.controller";
import { capitalizeFirstLetter } from "$lib/helpers/stringHelper";

jest.mock("$lib/helpers/stringHelper", () => {
    return {
        __esModule: true, // this property makes it work
        capitalizeFirstLetter: jest.fn(() => "Capitalized"),
    };
});

describe("MonthlyGraphTooltipController", () => {
    const WITH_PREVIOUS_VALUE = true;
    const YEAR = 2012;
    describe("constructor", () => {
        it.each`
            parameterName           | expected
            ${"_withPreviousValue"} | ${WITH_PREVIOUS_VALUE}
            ${"_year"}              | ${YEAR}
        `("initializes correctly $parameterName", ({ parameterName, expected }) => {
            const ctrl = new MonthlyGraphTooltipController(WITH_PREVIOUS_VALUE, YEAR);
            expect(ctrl[parameterName]).toEqual(expected);
        });

        it.each`
            parameterName | expected
            ${"style"}    | ${""}
            ${"date"}     | ${""}
            ${"number"}   | ${""}
        `("initializes correctly $parameterName store", ({ parameterName, expected }) => {
            const ctrl = new MonthlyGraphTooltipController(WITH_PREVIOUS_VALUE, YEAR);
            expect(ctrl[parameterName].value).toEqual(expected);
        });

        it("initializes _dynamicStyle with proper object", () => {
            const ctrl = new MonthlyGraphTooltipController(WITH_PREVIOUS_VALUE, YEAR);
            expect(ctrl._dynamicStyle).toMatchObject({ cssText: "" });
        });
    });

    describe("_normalizeMonth0Index", () => {
        const ctrl = new MonthlyGraphTooltipController(WITH_PREVIOUS_VALUE, YEAR);

        it.each`
            withPreviousValue | givenIndex | expected
            ${true}           | ${2}       | ${1}
            ${false}          | ${2}       | ${2}
        `(
            "shifts index according to 'withPreviousValue' param ($withPreviousValue)",
            ({ withPreviousValue, givenIndex, expected }) => {
                ctrl._withPreviousValue = withPreviousValue;
                const actual = ctrl._normalizedMonth0Index(givenIndex);
                expect(actual).toBe(expected);
            },
        );
    });

    describe("_dateLabel", () => {
        const YEAR = 2012;
        const ctrlPreviousValue = new MonthlyGraphTooltipController(true, YEAR);
        const ctrlNoPreviousValue = new MonthlyGraphTooltipController(false, YEAR);

        it("returns correct value for previous value", () => {
            const expected = "Fin d'année 2011";
            const actual = ctrlPreviousValue._dateLabel(0);
            expect(actual).toBe(expected);
        });

        describe.each`
            previousValue | ctrl                   | index
            ${true}       | ${ctrlPreviousValue}   | ${3}
            ${false}      | ${ctrlNoPreviousValue} | ${2}
        `("behavior withPreviousValue = $previousValue", ({ ctrl, index }) => {
            const normalizeSpy = jest.spyOn(ctrl, "_normalizedMonth0Index");
            normalizeSpy.mockReturnValue(2);

            it("calls _normalizedMonth0Index if not previous value", () => {
                ctrl._dateLabel(index);
                expect(normalizeSpy).toBeCalledWith(index);
            });

            it("calls capitalizeFirstLetter with correct date", () => {
                ctrl._dateLabel(index);
                const expected = "mars 2012";
                expect(capitalizeFirstLetter).toBeCalledWith(expected);
            });

            it("returns proper value", () => {
                const actual = ctrl._dateLabel(index);
                const expected = "Capitalized"; // mocked value for capitalizedFirstLetter
                expect(actual).toBe(expected);
            });
        });
    });

    describe("update", () => {
        const INDEX = 3;
        const VALUE = "2";
        const TOOLTIP_VISIBLE = { opacity: 1, caretX: 12, caretY: 22, dataPoints: [{ dataIndex: INDEX, raw: VALUE }] };
        const TOOLTIP_HIDDEN = { ...TOOLTIP_VISIBLE, opacity: 0 };
        let ctrl;

        describe.each`
            context                        | text
            ${{ tooltip: TOOLTIP_HIDDEN }} | ${"with hidden tooltip"}
            ${{}}                          | ${"with no given tooltip"}
        `("hides tooltip $text", ({ context }) => {
            ctrl = new MonthlyGraphTooltipController(WITH_PREVIOUS_VALUE, YEAR);

            it("updates opacity to zero", () => {
                ctrl.update(context);
                const actual = ctrl._dynamicStyle.opacity;
                const expected = "0";
                expect(actual).toBe(expected);
            });

            it("calls style setter with cssText", () => {
                const STYLE = "style";
                const styleSetterSpy = jest.spyOn(ctrl.style, "set");
                const styleGetterSpy = jest.spyOn(ctrl._dynamicStyle, "cssText", "get");
                styleGetterSpy.mockReturnValue(STYLE);
                ctrl.update(context);
                expect(styleSetterSpy).toHaveBeenCalledWith(STYLE);
            });
        });

        describe("does update tooltip", () => {
            const DATE_LABEL = "mars 2012";
            ctrl = new MonthlyGraphTooltipController(WITH_PREVIOUS_VALUE, YEAR);
            const dateLabelSpy = jest.spyOn(ctrl, "_dateLabel");
            dateLabelSpy.mockReturnValue(DATE_LABEL);

            it("calls _dateLabel", () => {
                ctrl.update({ tooltip: TOOLTIP_VISIBLE });
                expect(dateLabelSpy).toHaveBeenCalledWith(INDEX);
            });

            it("updates date with _dateLabel return value", () => {
                const setDateSpy = jest.spyOn(ctrl.date, "set");
                ctrl.update({ tooltip: TOOLTIP_VISIBLE });
                expect(setDateSpy).toHaveBeenCalledWith(DATE_LABEL);
            });

            it("updates number", () => {
                const setNumberSpy = jest.spyOn(ctrl.number, "set");
                ctrl.update({ tooltip: TOOLTIP_VISIBLE });
                expect(setNumberSpy).toHaveBeenCalledWith(VALUE);
            });

            it("updates opacity and position", () => {
                const expected = {
                    opacity: "1",
                    left: "12px",
                    top: "22px",
                };
                ctrl.update({ tooltip: TOOLTIP_VISIBLE });
                expect(ctrl._dynamicStyle).toMatchObject(expected);
            });

            it("calls style setter with cssText", () => {
                const STYLE = "style";
                const styleSetterSpy = jest.spyOn(ctrl.style, "set");
                const styleGetterSpy = jest.spyOn(ctrl._dynamicStyle, "cssText", "get");
                styleGetterSpy.mockReturnValue(STYLE);
                ctrl.update({ tooltip: TOOLTIP_VISIBLE });
                expect(styleSetterSpy).toHaveBeenCalledWith(STYLE);
            });
        });
    });
});
