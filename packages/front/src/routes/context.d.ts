export interface appContext {
    getEnv: () => string;
    getName: () => string;
    getDescription: () => string;
    getContact: () => string;
    getRepo: () => string;
}
