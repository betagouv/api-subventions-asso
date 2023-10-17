export default class ProviderRequestLog {
    constructor(
        public providerName: string,
        public route: string,
        public date: Date,
        public responseCode: number,
        public type: "GET" | "POST",
        public id?: string,
    ) {}
}
