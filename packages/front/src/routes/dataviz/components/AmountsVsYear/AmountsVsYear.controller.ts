import Store, { ReadStore, derived } from "$lib/core/Store";
import type { AmountsVsProgramRegionDto } from "dto";
import { filterYears, groupAndSum} from "../../DataViz.helper";
import type { PartialAmountsVsProgramRegionDto } from "../../DataViz.helper";

export class AmountsVsYearController {
    public selectedRegion: Store<string>;
    public selectedProgram: Store<string>;

    public regionOptions: { value: string; label: string }[];
    public programOptions: { value: string; label: string }[];

    public data: AmountsVsProgramRegionDto[];
    public filteredData: ReadStore<PartialAmountsVsProgramRegionDto[]>;
    public dataYear: PartialAmountsVsProgramRegionDto[];

    // filtersYear in Table defined as static and applied at the beginning to all instances ??

    constructor(data: AmountsVsProgramRegionDto[]) {
        this.data = data;
        this.regionOptions = this._getRegionOptions(data);
        this.programOptions = this._getProgramOptions(data);

        this.selectedRegion = new Store("Bretagne");
        this.selectedProgram = new Store("Tous");

        this.filteredData = derived([this.selectedRegion, this.selectedProgram], ([region, program]) =>
            filterYears(groupAndSum(this._filterData(this.data, region, program), []), 2021),
        );

        this.dataYear = filterYears(groupAndSum(this.data, []), 2021);
    }

    private _filterData(
        data: AmountsVsProgramRegionDto[],
        selectedRegion: string,
        selectedProgram: string,
    ): AmountsVsProgramRegionDto[] {
        console.log("selectedRegion", selectedRegion);
        console.log("selectedProgram", selectedProgram);
        const filteredData = data.filter(element => {
            return (
                (selectedRegion === "Tous" || element.regionAttachementComptable === selectedRegion) &&
                (selectedProgram === "Tous" || element.programme === selectedProgram)
            );
        });

        return filteredData;
    }

    private _getRegionOptions(data: AmountsVsProgramRegionDto[]): { value: string; label: string }[] {
        const uniqueRegions = [...new Set(data.map(element => element.regionAttachementComptable))].map(region => ({
            value: region,
            label: region,
        }));
        uniqueRegions.push({ value: "Tous", label: "Tous" });
        return uniqueRegions;
    }

    private _getProgramOptions(data: AmountsVsProgramRegionDto[]): { value: string; label: string }[] {
        const uniquePrograms = [...new Set(data.map(element => element.programme))].map(program => ({
            value: program,
            label: program,
        }));
        uniquePrograms.push({ value: "Tous", label: "Tous" });
        return uniquePrograms;
    }
}
