import type { AmountsVsProgramRegionDto } from "dto";
import type { PartialAmountsVsProgramRegionDto } from "../../@types/AmountsVsYear.types";
import { filterYears, groupAndSum } from "../../dataViz.helper";

export class HistoAmountsVsRegionYearController {
    public data: AmountsVsProgramRegionDto[];

    public dataHisto: PartialAmountsVsProgramRegionDto[];

    public yearMin = 2021;

    constructor(data: AmountsVsProgramRegionDto[]) {
        this.data = data;
        this.dataHisto = filterYears(groupAndSum(this.data, ["regionAttachementComptable"]), this.yearMin);
    }
}
