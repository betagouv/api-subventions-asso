import { HttpError } from "core";
import {
    OMOGEN_API_KEY,
    OMOGEN_AUTH_URL,
    OMOGEN_CLIENT,
    OMOGEN_SECRET,
    OMOGEN_URL,
} from "../../../../configurations/apis.conf";
import { HttpAdapter } from "../../../http.adapter";
import { OmogenFile, OmogenToken } from "./omogen.dto";
import { OmogenPort } from "./omogen.port";
import { RequestResponse } from "../../../../modules/provider-request/@types/RequestResponse";

export class OmogenAdapter extends HttpAdapter implements OmogenPort {
    private readonly url: string;
    private readonly authUrl: string;
    private readonly client: string;
    private readonly secret: string;
    private readonly apiKey: string;
    private token?: string;

    constructor() {
        super("omogen");
        if (!OMOGEN_URL || !OMOGEN_AUTH_URL || !OMOGEN_CLIENT || !OMOGEN_SECRET || !OMOGEN_API_KEY)
            throw new Error("Omogen is not configured");
        this.url = OMOGEN_URL;
        this.authUrl = OMOGEN_AUTH_URL;
        this.client = OMOGEN_CLIENT;
        this.secret = OMOGEN_SECRET;
        this.apiKey = OMOGEN_API_KEY;
    }

    private get authHeader() {
        return {
            Authorization: `Bearer ${this.token}`,
            // "X-omogen-codeUAI": OMOGEN_CODE_UAI,
        };
    }

    // set OAuth2 token
    // @TODO: make it private after local test succeed
    async auth() {
        const body = new URLSearchParams({
            grant_type: "client_credentials",
            client_id: this.client,
            client_secret: this.secret,
        });

        this.token = (
            await this.http.post<OmogenToken>(this.authUrl, body, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "X-omogen-api-key": this.apiKey,
                    // "X-omogen-codeUAI": OMOGEN_CODE_UAI,
                },
            })
        ).data.access_token;

        console.log("setting token: ", this.token);
    }

    private async ensureAuth<T>(fn: () => Promise<RequestResponse<T>>): Promise<T> {
        if (!this.token) await this.auth();
        try {
            return (await fn()).data;
        } catch (e) {
            if ((e as HttpError).status !== 401) throw e;
            await this.auth();
            return (await fn()).data;
        }
    }

    // lists all files on the server
    async list() {
        return this.ensureAuth<OmogenFile[]>(() =>
            this.http.get<OmogenFile[]>(`${this.url}/flux`, {
                headers: {
                    ...this.authHeader,
                    producteur: "DATA-SUBVENTION-SND",
                    depot: "DEPOT-DATA-SUBVENTION-SND",
                    tagDepot: "TD-DATA-SUBVENTION-SND",
                },
            }),
        );
    }

    // download specific file
    async get(id: string) {
        return this.ensureAuth(() =>
            this.http.get<unknown[]>(`${this.url}/flux/${id}`, {
                headers: { ...this.authHeader, consommateur: "DATA-SUBVENTION" },
            }),
        );
    }

    async upload(stream) {
        return this.ensureAuth(() =>
            this.http.post(
                `${this.url}/flux`,
                { fichier: stream },
                {
                    headers: {
                        ...this.authHeader,
                        "Content-Type": "multipart/form-data",
                        producteur: "DATA-SUBVENTION-SND",
                        depot: "DEPOT-DATA-SUBVENTION-SND",
                        tagDepot: "TD-DATA-SUBVENTION-SND",
                    },
                },
            ),
        );
    }
}

const omogenAdapter = new OmogenAdapter();
export default omogenAdapter;
