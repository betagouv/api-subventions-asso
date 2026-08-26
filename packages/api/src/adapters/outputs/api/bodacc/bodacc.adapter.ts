import { Siren } from "../../../../identifier-objects";
import { HttpAdapter } from "../../../http.adapter";
import { BodaccDto } from "./bodacc.dto";
import { toEntity } from "./bodacc.mapper";
import { BodaccPort } from "./bodacc.port";

export class BodaccAdapter extends HttpAdapter implements BodaccPort {
    private baseUrl: string;

    constructor() {
        super("bodacc");
        this.baseUrl = "https://bodacc-datadila.opendatasoft.com/api/v2";
    }

    async getRecordsBySiren(siren: Siren) {
        const url =
            this.baseUrl +
            `/catalog/datasets/annonces-commerciales/records?order_by=dateparution DESC&refine=registre:${siren.value}`;

        const response = await this.http.get<BodaccDto>(url);

        // we do not fail if API respond nothing
        if (!response.data || response.data.total_count === 0) return [];

        return response.data.records.map(record => toEntity(record.record));
    }
}

const bodaccAdapter = new BodaccAdapter();
export default bodaccAdapter;
