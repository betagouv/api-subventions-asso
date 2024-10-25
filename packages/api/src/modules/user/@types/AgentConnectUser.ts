import { ObjectId } from "mongodb";
import { SirenDto, SiretDto } from "dto";

// cf https://github.com/france-connect/Documentation-AgentConnect/blob/main/doc_fs/projet_fca/projet_fca_donnees.md
export type AgentConnectUser = {
    given_name: string; // first names separated by spaces
    usual_name: string; // last name
    email: string;
    uid: string; // agent connect identifier
    sub: string; // identifier dependant of identity provider. Don't use!

    siren?: SirenDto;
    siret?: SiretDto;
    organizational_unit?: string;
    belonging_population?: string;
    phone?: string; // unclear type, TODO test type in real environment
    chorusdt?: string;
};

export type AgentConnectTokenDbo = {
    _id: ObjectId;
    token: string;
    creationDate: Date;
    userId: ObjectId;
};
