export default class IdentifierHelper {
    static isRna(value: string){
        return typeof value === "string" && /^W\d[A-Z\d]\d{7}$/.test(value)
    }

    static isSiret(value: string){
        return typeof value === "string" && /\d{14}/.test(value);
    }

    static isSiren(value: string){
        return typeof value === "string" && /\d{9}/.test(value);
    }

    // REFACTO: can we mutualize this with API somehow ?
    static findType(value: string) {
        if (this.isRna(value)) return "RNA";
        if (this.isSiret(value)) return "SIRET";
        if (this.isSiren(value)) return "SIREN";
        return "UNKNOWN"
    }
}