import { UserDto } from "../user";

export interface ActivateDtoPositiveResponse {
    user: UserDto;
}

export type ActivateDtoResponse = ActivateDtoPositiveResponse;
