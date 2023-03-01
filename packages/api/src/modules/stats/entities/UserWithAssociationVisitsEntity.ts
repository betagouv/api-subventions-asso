import UserDto from "@api-subventions-asso/dto/user/UserDto";
import AssociationVisitEntity from "./AssociationVisitEntity";

export interface UserWithAssociationVistitsEntity extends UserDto {
    associationVisits: AssociationVisitEntity[];
}
