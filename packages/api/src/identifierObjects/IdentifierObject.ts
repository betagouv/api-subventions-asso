export abstract class IdentifierObject {
    protected identifier: string;

    constructor(identifier: string) {
        this.identifier = identifier;
    }

    abstract get name(): string;

    get value(): string {
        return this.identifier;
    }

    toString(): string {
        return this.value;
    }

    equals(other: this): boolean {
        return other.value === this.value;
    }
}
