import { OmogenFile } from "./omogen.dto";

export interface OmogenPort {
    list(): Promise<OmogenFile[]>;
    get(id: string): Promise<unknown>;
}
