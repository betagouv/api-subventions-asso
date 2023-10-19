export default interface RequestConfig<D = unknown> {
    providerName: string;
    headers?: Record<string, string | string[] | number | boolean | null>;
    keepAlive?: boolean;
    responseType?: "arraybuffer" | "blob" | "document" | "json" | "text" | "stream";
    data?: D;
}
