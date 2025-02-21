import Store, {ReadStore, derived} from "$lib/core/Store";
import { numberToEuro } from "$lib/helpers/dataHelper";
import type { AmountsVsProgramRegionDto } from "dto";

export class AmountsVsYearController {

    public selectedExercise: Store<number>;
    public selectedRegion: Store<string>;
    public selectedProgram: Store<string>;

    public exerciseOptions : {value:number, label:string}[]  = this._getExerciceOptions(4);
    public regionOptions: {value: string, label: string}[];
    public programOptions: {value: string, label: string}[];

    public data: AmountsVsProgramRegionDto[];
    public filteredData: ReadStore<AmountsVsProgramRegionDto[]>;

    // filtersYear in Table defined as static and applied at the beginning to all instances ??
    
    constructor(data : AmountsVsProgramRegionDto[]) {
        this.data = data;
        this.regionOptions = this._getRegionOptions(data); 
        this.programOptions = this._getProgramOptions(data);

        this.selectedExercise = new Store(2023);
        this.selectedRegion = new Store("Administration Centrale");
        this.selectedProgram = new Store("102 - Accès et retour à l'emploi");


        this.filteredData = derived([this.selectedExercise, this.selectedRegion, this.selectedProgram], ([exercise, region, program]) =>
                this._filterData(this.data, exercise, region, program)
        );

    }

    private _filterData(data : AmountsVsProgramRegionDto[],
                        selectedExercice: number,
                        selectedRegion: string,
                        selectedProgram: string
    ): AmountsVsProgramRegionDto[] {
        console.log("exercice", selectedExercice);
        console.log("selectedRegion", selectedRegion);
        console.log("selectedProgram", selectedProgram)
        console.log(data);
        const filteredData = data.filter(element => {
            return (
                element.exerciceBudgetaire === selectedExercice &&
                element.regionAttachementComptable === selectedRegion &&
                element.programme === selectedProgram
            );
        });
        console.log(filteredData);

        return filteredData
    }

    private _getExerciceOptions(years_number : number): {value: number, label : string}[] {
        const lastCompleteYear = new Date().getFullYear() - 1;
        return Array.from({ length: years_number }, (_, i) => ({
            value : lastCompleteYear - i,
            label: (lastCompleteYear -i).toString()}));
    }

    private _getRegionOptions(data : AmountsVsProgramRegionDto[]): {value: string, label: string}[] {
        const uniqueRegions = [...new Set(data.map(element => element.regionAttachementComptable))]
        
        return uniqueRegions.map((region) => ({
            value : region,
            label : region
        }));
    }

    private _getProgramOptions(data : AmountsVsProgramRegionDto[]): {value: string, label: string}[] {
        const uniquePrograms = [...new Set(data.map(element => element.programme))]
        return uniquePrograms.map((program) => ({
            value: program,
            label: program
        }));
    }


}