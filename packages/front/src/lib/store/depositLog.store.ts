import Store from "$lib/core/Store";
import type { DepositScdlLogResponseDto } from "dto";

export const depositLogStore = new Store<DepositScdlLogResponseDto | null>(null);
