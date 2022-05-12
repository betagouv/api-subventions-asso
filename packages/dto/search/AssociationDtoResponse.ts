import { Association } from "../index";

export default interface AssociationDtoResponse {
    success: boolean;
    association?: Association,
    message?: string
}