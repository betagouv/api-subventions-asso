export default class MiscScdlEditorEntity {
    editorName: string;
    lastUpdate: Date;
    reference: string;
    datasetList: string[];

    constructor({ editorName, lastUpdate, reference, datasetList }) {
        this.editorName = editorName;
        this.lastUpdate = lastUpdate;
        this.reference = reference;
        this.datasetList = datasetList;
    }
}
