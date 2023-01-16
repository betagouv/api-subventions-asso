export default interface ConfigurationEntity<T = unknown> {
    name: string;
    updatedAt: Date;
    data: T;
}
