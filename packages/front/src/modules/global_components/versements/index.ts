import Versement from "@api-subventions-asso/dto/search/VersementDto";
import { DefaultObject } from "../../../@types/utils";

export function format(versements?: Versement[]) {
        if (!versements) return null;
        const versementsByYear = versements.reduce((acc, versement) => {
            const date = new Date(versement.dateOperation.value);
            const year = date.getFullYear();
            if (!acc[year]) acc[year] = [];
            acc[year].push(versement);
            return acc;
        }, {} as DefaultObject<Versement[]>);

        Object.values(versementsByYear).forEach(v => v.sort((a, b) => new Date(b.dateOperation.value).getTime() - new Date(a.dateOperation.value).getTime()))
        return versementsByYear;
    }