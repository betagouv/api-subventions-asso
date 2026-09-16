import AssociationNameEntity from "../../../../modules/association-name/entities/AssociationNameEntity";

export function toPagniatedResult(entities: AssociationNameEntity[], page: number) {
    const PAGE_SIZE = 12;

    return {
        nbPages: Math.ceil(entities.length / PAGE_SIZE),
        page,
        results: entities.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
        total: entities.length,
    };
}
