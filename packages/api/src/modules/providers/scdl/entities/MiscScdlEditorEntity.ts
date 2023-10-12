export default class MiscScdlEditorEntity {
    editorName: string;
    lastUpdate: Date;
    // Data.Gouv provider ID
    idSource: string;
    // Data.Gouv provider dataset IDs
    datasetList?: string[];

    constructor({ editorName, lastUpdate, reference, datasetList }) {
        this.editorName = editorName;
        this.lastUpdate = lastUpdate;
        this.idSource = reference;
        this.datasetList = datasetList || [];
    }
}
