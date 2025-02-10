import { elements } from "chart.js";
import type { AmountsVsProgramRegionDto } from "dto";
import type { Writable } from "svelte/store";

export class TableAmountsVsProgramRegionController{

    headersDict: Record<string, string>;

    constructor() {
        this.headersDict = {
           exerciceBudgetaire : "Exercice", 
            programme:"Programme", 
            regionAttachementComptable:"Attachement comptable",
            montant:"Montant (EUR)"};

    }

    _formatData(data)  {
        return data.map((element) => {
            const montant = new Intl.NumberFormat('fr-FR', {
                style:'decimal',
                maximumFractionDigits: 0,
            }).format(element.montant);
            return {
                ...element,
                 montant: montant
            }
        });
    }

    groupAndSum(data, selectedColumns) {
        const cols = [...selectedColumns, "exerciceBudgetaire"];
        console.log("data", data);
        const temp = data.reduce((acc, row) => {
            const key = cols.map(column => row[column]).join("-");
            if (!acc[key]) {
                acc[key] = {...cols.reduce((obj, field) => {
                        obj[field] = row[field];
                        return obj;
                    }, {})},
                    acc[key]['montant']=0;
            }
            acc[key].montant += row.montant;
            return acc;
        }, {});
        return Object.values(temp);
    }

    getTableData(data, selectedColumns) {
        const temp = this.groupAndSum(data, selectedColumns);
        return this._formatData(temp);
    }


}