export type IStreamAction = () => void;

export interface SaveCallback<T> {
    (entity: T, streamPause: IStreamAction, streamResume: IStreamAction): Promise<void>;
}
