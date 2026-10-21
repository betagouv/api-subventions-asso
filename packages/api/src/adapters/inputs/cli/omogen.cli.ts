import { CliStaticInterface } from "../../../@types";
import { StaticImplements } from "../../../decorators/static-implements.decorator";
import omogenAdapter, { OmogenAdapter } from "../../outputs/api/omogen/omogen.adapter";

import fs from "fs";

@StaticImplements<CliStaticInterface>()
export default class OmogenCli {
    static cmdName = "omogen";

    constructor(private adapter: OmogenAdapter) {}

    // used for local test only
    async list() {
        return this.adapter.list();
    }

    async auth() {
        return this.adapter.auth();
    }

    async get(id: string) {
        return this.adapter.get(id);
    }

    // @TODO: remove this when the download has been tested
    async upload(path) {
        return this.adapter.upload(fs.createReadStream(path));
    }

    //     curl -X POST "https://omogen-api-tst-pr.phm.education.gouv.fr/omogen-fichiers-test" \
    //   -H "producteur: DATA-SUBVENTION-SND" \
    //   -H "depot: DEPOT-DATA-SUBVENTION-SND" \
    //   -H "tagDepot: TD-DATA-SUBVENTION-SND" \
    // -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGZ1RWTGNyNk1MWkxRX2JiWDVCQk1EUF9EUGZITHZtMG1GbjZPU3Y0UXhVIn0.eyJleHAiOjE3OTMwMDQyODIsImlhdCI6MTc5MzAwMzY4MiwianRpIjoiZDJjMzI0ZTUtNDUwZC00ZjBiLTgxYjEtNzg4MmJjNTdiNmFlIiwiaXNzIjoiaHR0cHM6Ly9wcC1vYXV0aC1hcGkucGhtLmVkdWNhdGlvbi5nb3V2LmZyL2F1dGgvcmVhbG1zL29tb2dlbiIsInN1YiI6ImNlOTVjMWYwLTdmNGItNDIwNS05MmExLWEzY2Y5M2IyYWY3MyIsInR5cCI6IkJlYXJlciIsImF6cCI6ImRhdGEtc3VidmVudGlvbi1wcCIsInNjb3BlIjoiIiwiY2xpZW50SG9zdCI6Ijg4LjE3My4yNDUuMTk2IiwiY2xpZW50QWRkcmVzcyI6Ijg4LjE3My4yNDUuMTk2IiwiY2xpZW50X2lkIjoiZGF0YS1zdWJ2ZW50aW9uLXBwIn0.CMHPMtl0zMtY3v2YZFZ6_DYZpkcgIbBg3isIZsTxFA1LXLEmghsU05AEpwOcfo_njIvdhTY-UX-wRyM9qKC5Wz24BcRMn6LS5-fVnNJEsgZq6JN_4irhu1WWlKAmuOfjadoO8aIL1KTKDQNmIly5pYxlUvX_y38YNZtCXmsBjG4lXHgEeWlQb_hvtEIPVYAGPoiN6XBy2SzA8-bN6OQvTS4fyFrK9VagCxE0b0RPhaS8eISHhypy6zSnephnNDnI0W89puYOape1K8DPB6OWg8poj-UstUjqCgWhcRDJXDGBsdii3jFwQi08iaizV85BVKATCmcT9AhzQ7MBfBYTWQ" \
    //   -F "fichier=@tests/interfaces/cli/__fixtures__/new-chorus-export.xlsx"
}

export const createOmogenCli = () => new OmogenCli(omogenAdapter);
