import { Adresse, Siren, Siret } from "dto";

export class InseeEstablishmentEntity {
    public siren: Siren;
    public siret: Siret;
    public nic: string;
    public lastUpdate: Date;
    public siege: boolean;
    public ouvert: boolean;
    public adresse: Adresse;

    constructor({
        siren,
        siret,
        nic,
        lastUpdate,
        siege,
        ouvert,
        adresse,
    }: {
        siren: Siren;
        siret: Siret;
        nic: string;
        lastUpdate: Date;
        siege: boolean;
        ouvert: boolean;
        adresse: Adresse;
    }) {
        this.siren = siren;
        this.siret = siret;
        this.nic = nic;
        this.lastUpdate = lastUpdate;
        this.siege = siege;
        this.ouvert = ouvert;
        this.adresse = adresse;
    }
}

export class InseeAddress {
    public complementAdresse?: string;
    public numeroVoie?: string;
    public indiceRepetition?: string;
    public typeVoie?: string;
    public voie?: string;
    public codePostal?: string;
    public commune?: string;
    public distributionSpeciale?: string;
    public cedex?: string;
    public pays?: string;

    constructor({
        complementAdresse,
        numeroVoie,
        indiceRepetition,
        typeVoie,
        voie,
        codePostal,
        commune,
        distributionSpeciale,
        cedex,
        pays,
    }: {
        complementAdresse?: string;
        numeroVoie?: string;
        indiceRepetition?: string;
        typeVoie?: string;
        voie?: string;
        codePostal?: string;
        commune?: string;
        distributionSpeciale?: string;
        cedex?: string;
        pays?: string;
    }) {
        this.complementAdresse = complementAdresse;
        this.numeroVoie = numeroVoie;
        this.indiceRepetition = indiceRepetition;
        this.typeVoie = typeVoie;
        this.voie = voie;
        this.codePostal = codePostal;
        this.commune = commune;
        this.distributionSpeciale = distributionSpeciale;
        this.cedex = cedex;
        this.pays = pays;
    }
}
