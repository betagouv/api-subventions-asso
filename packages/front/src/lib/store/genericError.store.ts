import Store from "$lib/core/Store";
import type { ErrorAlertContent } from "$lib/entities/ErrorAlertContent";

export const errorStore = new Store<boolean>(false);
export const errorMessageStore = new Store<ErrorAlertContent>({ title: "", message: "" });
