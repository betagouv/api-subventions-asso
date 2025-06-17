export abstract class ValueObject {
    private identifier: string;
    private static identifierName: string;

    constructor(identifier: string) {
        this.identifier = identifier;
    }

    abstract get name(): string;

    static getName() {
        return this.identifierName;
    }

    get value() {
        return this.identifier;
    }

    toString() {
        return this.value;
    }

    equals(other: this) {
        return other.value === this.value;
    }
}
