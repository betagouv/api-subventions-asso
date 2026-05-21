import { NotFoundError } from "core";
import { ProviderDetails } from "dto";
import GetOsirisDetailsUseCase, {
    getOsirisDetailsUseCase,
} from "../../providers/osiris/use-cases/get-osiris-details.use-case";

export default class GetProviderDetailsUseCase {
    constructor(private getOsirisDetails: GetOsirisDetailsUseCase) {}

    async execute(provider: string, id: string): Promise<ProviderDetails<unknown>> {
        if (provider === "osiris") {
            return this.getOsirisDetails.execute(id);
        }

        throw new NotFoundError(`Uncovered provider: ${provider}`);
    }
}

const getProviderDetailsUseCase = new GetProviderDetailsUseCase(getOsirisDetailsUseCase);

export { getProviderDetailsUseCase };
