import type { AmountsVsProgramRegionDto } from "dto";
import { filterYears, groupAndSum } from "../../dataViz.helper";
import type { PartialAmountsVsProgramRegionDto } from "../../@types/AmountsVsYear.types";
import Store, { ReadStore, derived } from "$lib/core/Store";

export class AmountsVsYearController {
    public selectedRegion: Store<string>;
    public selectedProgram: Store<string>;

    public regionOptions: { value: string; label: string }[];
    public programOptions: { value: string; label: string }[];

    public data: AmountsVsProgramRegionDto[];
    public filteredData: ReadStore<PartialAmountsVsProgramRegionDto[]>;
    public dataYear: PartialAmountsVsProgramRegionDto[];

    constructor(data: AmountsVsProgramRegionDto[]) {
        this.data = data;
        this.regionOptions = this._getRegionOptions(data);
        this.programOptions = this._getProgramOptions(data);

        this.selectedRegion = new Store("Tous");
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
        const filteredData = data.filter(element => {
            return (
                (selectedRegion === "Tous" || element.regionAttachementComptable === selectedRegion) &&
                (selectedProgram === "Tous" || element.programme === selectedProgram)
            );
        });

        return filteredData;
    }

    private _getRegionOptions(data: AmountsVsProgramRegionDto[]): { value: string; label: string }[] {
        const uniqueRegions = [...new Set(data.map(element => element.regionAttachementComptable))].map(
            (region, index) => ({
                value: `region-${index}`,
                label: region,
            }),
        );
        uniqueRegions.push({ value: "region-all", label: "Tous" });
        return uniqueRegions;
    }

    private _getProgramOptions(data: AmountsVsProgramRegionDto[]): { value: string; label: string }[] {
        const uniquePrograms = [...new Set(data.map(element => element.programme))].map((program, index) => ({
            value: `program-${index}`,
            label: program,
        }));
        uniquePrograms.push({ value: "program-all", label: "Tous" });
        return uniquePrograms;
    }
}
