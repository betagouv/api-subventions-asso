export interface CliStaticInterface {
    cmdName: string;
    new (): unknown;
}

export interface ApplicationFlatCli {
    // adapte all provider's data
    initApplicationFlat(): void;
    // adapte only provider's data for given exercise
    syncApplicationFlat(exercise: number);
}
