import Store from "$lib/core/Store";

export default class SheetSelectorController {
    public radioObj: { label: string; options: { label: string; value: string }[] };

    constructor(excelSheets: string[]) {
        const options = excelSheets.map(sheet => ({
            label: sheet,
            value: sheet,
        }));

        this.radioObj = {
            label: "Veuillez sélectionner l’onglet à prendre en compte pour l’import des données :",
            options,
        };
    }

    public selectedOption: Store<string> = new Store("");

    handleChange(event: CustomEvent) {
        this.selectedOption.set(event.detail.value);
    }
}
