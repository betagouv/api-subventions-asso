import { FindCursor } from "mongodb";

export const toArray = async asyncIterable => (asyncIterable as FindCursor).toArray();
