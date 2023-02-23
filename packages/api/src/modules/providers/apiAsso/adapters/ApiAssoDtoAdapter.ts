import { siretToNIC } from "../../../../shared/helpers/SirenHelper";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";
import { Etablissement, Association } from "@api-subventions-asso/dto";
import { Document } from "@api-subventions-asso/dto/search/Document";
import StructureDto, {
    StructureDacDocumentDto,
    StructureEtablissementDto,
    StructureRepresentantLegalDto,
    StructureRibDto,
    StructureRnaDocumentDto
} from "../dto/StructureDto";
import { isValidDate } from "../../../../shared/helpers/DateHelper";

export default class ApiAssoDtoAdapter {
    static providerNameRna = "RNA";
    static providerNameLcaDocument = "Le Compte Asso";
    static providerNameSiren = "SIREN";

    static toAssociation(structure: StructureDto): Association[] {
        const associations: Association[] = [];
        const fromRNA = structure.identite.regime === "loi1901"; // Data come from rna
        const toDate = (stringDate: string) => {
            const [year, month, day] = stringDate.split("-").map(string => parseInt(string, 10));
            return new Date(Date.UTC(year, month - 1, day));
        };

        if (structure.identite.date_modif_rna) {
            const toRnaPvs = ProviderValueFactory.buildProviderValuesAdapter(
                this.providerNameRna,
                toDate(structure.identite.date_modif_rna)
            );
            const rnaAssociation: Association = {
                rna: toRnaPvs(structure.identite.id_rna),
                denomination_rna: toRnaPvs(structure.identite.nom),
                date_creation_rna: structure.identite.date_creat
                    ? toRnaPvs(toDate(structure.identite.date_creat))
                    : undefined,
                date_modification_rna: toRnaPvs(toDate(structure.identite.date_modif_rna)),
                objet_social: toRnaPvs(structure.activites.objet),
                code_objet_social_1: toRnaPvs(structure.activites.id_objet_social1),
                code_objet_social_2: toRnaPvs(structure.activites.id_objet_social2),
                adresse_siege_rna: fromRNA
                    ? toRnaPvs({
                          numero: structure.coordonnees.adresse_siege.num_voie,
                          type_voie: structure.coordonnees.adresse_siege.type_voie,
                          voie: structure.coordonnees.adresse_siege.voie,
                          code_postal: structure.coordonnees.adresse_siege.cp,
                          commune: structure.coordonnees.adresse_siege.commune
                      })
                    : undefined
            };
            associations.push(rnaAssociation);
        }

        if (structure.identite.date_modif_siren) {
            const toSirenPvs = ProviderValueFactory.buildProviderValuesAdapter(
                this.providerNameSiren,
                toDate(structure.identite.date_modif_siren)
            );
            const adresse =
                structure.coordonnees.adresse_siege_sirene ||
                (fromRNA ? undefined : structure.coordonnees.adresse_siege);
            const sirenAssociation: Association = {
                denomination_siren: structure.identite.nom_sirene
                    ? toSirenPvs(structure.identite.nom_sirene)
                    : toSirenPvs(structure.identite.nom),
                siren: toSirenPvs(structure.identite.id_siren),
                nic_siege: toSirenPvs(siretToNIC(structure.identite.id_siret_siege)),
                categorie_juridique: toSirenPvs(structure.identite.id_forme_juridique.toString()),
                date_creation_siren: structure.identite.date_creation_sirene
                    ? toSirenPvs(toDate(structure.identite.date_creation_sirene))
                    : undefined,
                date_modification_siren: toSirenPvs(toDate(structure.identite.date_modif_siren)),
                adresse_siege_siren: adresse
                    ? toSirenPvs({
                          numero: adresse.num_voie,
                          type_voie: adresse.type_voie,
                          voie: adresse.voie,
                          code_postal: adresse.cp,
                          commune: adresse.commune
                      })
                    : undefined,
                etablisements_siret: toSirenPvs(structure.etablissement.map(e => e.id_siret))
            };
            associations.push(sirenAssociation);
        }

        return associations;
    }

    static toEtablissement(
        etablissement: StructureEtablissementDto,
        ribs: StructureRibDto[],
        representantsLegaux: StructureRepresentantLegalDto[],
        dateModif: string
    ): Etablissement {
        const toDate = (stringDate: string) => {
            const [year, month, day] = stringDate.split("-").map(string => parseInt(string, 10));
            return new Date(Date.UTC(year, month - 1, day));
        };
        const toSirenPvs = ProviderValueFactory.buildProviderValuesAdapter(this.providerNameSiren, toDate(dateModif));
        const toLCAPvs = ProviderValueFactory.buildProviderValuesAdapter(
            this.providerNameLcaDocument,
            toDate(dateModif)
        );

        const toContact = (r: StructureRepresentantLegalDto) => ({
            nom: r.nom,
            prenom: r.prenom,
            civilite: r.civilité,
            telephone: r.telephone,
            email: r.courriel,
            role: r.fonction
        });

        return {
            siret: toSirenPvs(etablissement.id_siret),
            nic: toSirenPvs(siretToNIC(etablissement.id_siret)),
            ouvert: toSirenPvs(etablissement.actif),
            siege: toSirenPvs(etablissement.est_siege),
            adresse: toSirenPvs({
                numero: etablissement.adresse.num_voie,
                type_voie: etablissement.adresse.type_voie,
                voie: etablissement.adresse.voie,
                code_postal: etablissement.adresse.cp,
                commune: etablissement.adresse.commune
            }),
            information_banquaire: ribs
                .filter(rib => rib.id_siret === etablissement.id_siret)
                .map(rib => toLCAPvs({ iban: rib.iban, bic: rib.bic })),
            representants_legaux: representantsLegaux
                ? representantsLegaux
                      .filter(r => r.id_siret === etablissement.id_siret)
                      .map(r => toLCAPvs(toContact(r)))
                : undefined,
            contacts: representantsLegaux
                ? representantsLegaux
                      .filter(r => r.id_siret === etablissement.id_siret)
                      .map(r => toLCAPvs(toContact(r)))
                : undefined
        };
    }

    static rnaDocumentToDocument(rnaDocument: StructureRnaDocumentDto): Document {
        let date = new Date(Date.UTC(rnaDocument.annee as number, 0));
        // DTO expect date so we use 1970 as a hack to know that the date is not defined
        if (!isValidDate(date)) date = new Date(Date.UTC(1970, 0));
        else if (rnaDocument.time) date.setTime(date.getTime() + rnaDocument.time);

        const toRnaPv = ProviderValueFactory.buildProviderValueAdapter(this.providerNameRna, date);
        return {
            nom: toRnaPv(`${rnaDocument.lib_sous_type} - ${rnaDocument.id}`),
            type: toRnaPv(rnaDocument.sous_type),
            url: toRnaPv(rnaDocument.url),
            __meta__: {}
        };
    }

    static dacDocumentToDocument(dacDocument: StructureDacDocumentDto): Document {
        const isoDate = new Date(dacDocument.time_depot);
        const toLCAPv = ProviderValueFactory.buildProviderValueAdapter(
            this.providerNameLcaDocument,
            new Date(
                Date.UTC(
                    isoDate.getFullYear(),
                    isoDate.getMonth(),
                    isoDate.getDate(),
                    isoDate.getHours(),
                    isoDate.getMinutes()
                )
            )
        );

        return {
            nom: toLCAPv(dacDocument.nom),
            type: toLCAPv(dacDocument.meta.type),
            url: toLCAPv(dacDocument.url),
            __meta__: {
                siret: String(dacDocument.meta.id_siret)
            }
        };
    }

    static dacDocumentToRib(rib: StructureDacDocumentDto): Document {
        const isoDate = new Date(rib.time_depot);

        const toRnaPv = ProviderValueFactory.buildProviderValueAdapter(this.providerNameRna, isoDate);
        return {
            nom: toRnaPv(rib.meta.iban || rib.nom),
            type: toRnaPv("RIB"),
            url: toRnaPv(rib.url),
            __meta__: {
                siret: String(rib.meta.id_siret)
            }
        };
    }
}
