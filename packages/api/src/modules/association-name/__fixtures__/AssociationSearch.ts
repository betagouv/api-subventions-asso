import { RNA_STR, SIREN_STR } from "../../../../tests/__fixtures__/association.fixture";
import AssociationSearchEntity from "../../../entities/AssociationSearchEntity";
import Rna from "../../../identifier-objects/Rna";
import Siren from "../../../identifier-objects/Siren";

export const ASSOCIATION_SEARCH_ENTITY = new AssociationSearchEntity({
    name: "Association Name Fixture",
    siren: new Siren(SIREN_STR),
    rna: new Rna(RNA_STR),
});
