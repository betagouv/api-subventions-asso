import { RechercheEntreprisesDto } from "./RechercheEntreprisesDto";

export interface RechercheEntreprisesPort {
    search(query: string, page: number): Promise<RechercheEntreprisesDto | null>;
}
