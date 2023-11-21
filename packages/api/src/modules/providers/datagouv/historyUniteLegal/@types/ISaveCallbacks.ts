export type IStreamAction = () => void;

export interface SaveCallback<T> {
    (entity: T, streamPause: () => void, streamResume: () => void): Promise<void>;
}
