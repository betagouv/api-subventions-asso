import SheetSelectorController from "./SheetSelector.controller";

describe("SheetSelectorController", () => {
    let controller: SheetSelectorController;

    beforeEach(() => {
        const excelSheets = ["sheet1", "sheet2", "sheet3"];
        controller = new SheetSelectorController(excelSheets);
    });

    describe("handleChange", () => {
        it("should update selectedOption", () => {
            const selectedValue = "Sheet2";
            const event = { detail: { value: selectedValue } } as CustomEvent<{ value: string }>;

            controller.handleChange(event);

            expect(controller.selectedOption.value).toBe(selectedValue);
        });
    });
});
