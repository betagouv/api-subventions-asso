export interface CliStaticInterface {
    cmdName: string;
    new (): unknown;
}

export interface ApplicationFlatCli {
    // adapte all subventia document
    initApplicationFlat(): void;
    // adapte only subventia documents for given exercise
    syncApplicationFlat(exercise: number);
}
