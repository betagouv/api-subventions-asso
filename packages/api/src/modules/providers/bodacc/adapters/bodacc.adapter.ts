import { Association } from "dto";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";
import bodaccService from "../bodacc.service";
import { BodaccDto } from "../dto/BodaccDto";

export default class BodaccAdapter {
    static toAssociation(dto: BodaccDto) {
        const toPVs = ProviderValueFactory.buildProviderValuesAdapter(bodaccService.meta.name, new Date());

        return {
            siren: toPVs(dto.records[0].record.fields.registre[1]),
            bodacc: toPVs(dto.records.map(record => record.record)),
        } as Association;
    }
}
