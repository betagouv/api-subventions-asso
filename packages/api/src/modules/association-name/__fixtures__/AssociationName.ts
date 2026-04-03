import { RNA_STR, SIREN_STR } from "../../../../tests/__fixtures__/association.fixture";
import Rna from "../../../identifier-objects/Rna";
import Siren from "../../../identifier-objects/Siren";
import AssociationNameEntity from "../entities/AssociationNameEntity";

export const ASSOCIATION_NAME: AssociationNameEntity = {
    name: "Association Name Fixture",
    siren: new Siren(SIREN_STR),
    rna: new Rna(RNA_STR),
};
