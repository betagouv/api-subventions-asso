import { NOT_APPLICABLE_VALUE } from "core";
import UseCase from "../../@types/use-case/UseCase";
import REGION_MAPPING from "./region.mapping";

export class GetRegionAttachementComptable implements UseCase<string, string | null> {
    execute(attachementComptable: string): string | null {
        if (attachementComptable == NOT_APPLICABLE_VALUE) return NOT_APPLICABLE_VALUE;

        const region = REGION_MAPPING[attachementComptable];
        if (region === undefined) {
            const errorMessage = `Unknown region code: ${attachementComptable}`;
            console.error(errorMessage);
            return null;
        }
        return region;
    }
}

const getRegionAttachementComptable = new GetRegionAttachementComptable();
export default getRegionAttachementComptable;
