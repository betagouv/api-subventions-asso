import { ReadStore } from "$lib/core/Store";
import { page as nativePage } from "$app/stores";

export const page = ReadStore.fromSvelteStore(nativePage);
