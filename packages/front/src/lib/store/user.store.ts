import type { UserDto } from "dto";
import Store from "$lib/core/Store";

export const connectedUser = new Store<UserDto | null>(null);
