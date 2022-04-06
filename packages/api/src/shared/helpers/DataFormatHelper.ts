import { isCP } from "../Validators";

export function formatCP(cp: string | undefined): string | undefined {
    if (!cp) return undefined;
    const formatedValue = cp.replace(/ /g, "");
                
    if(!isCP(formatedValue)) return undefined

    return formatedValue
}