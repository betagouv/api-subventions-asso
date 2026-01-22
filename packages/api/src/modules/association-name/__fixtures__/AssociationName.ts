import { RNA_STR, SIREN_STR } from "../../../../tests/__fixtures__/association.fixture";
import Rna from "../../../identifierObjects/Rna";
import Siren from "../../../identifierObjects/Siren";
import AssociationNameEntity from "../entities/AssociationNameEntity";

export const ASSOCIATION_NAME: AssociationNameEntity = {
    name: "Association Name Fixture",
    siren: new Siren(SIREN_STR),
    rna: new Rna(RNA_STR),
};
