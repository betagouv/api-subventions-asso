import { Etablissement, Association, Document } from "dto";
import { siretToNIC } from "../../../../shared/helpers/SirenHelper";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";
import {
    StructureDacDocumentDto,
    StructureEtablissementDto,
    StructureRepresentantLegalDto,
    StructureRibDto,
    StructureRnaDocumentDto,
} from "../dto/StructureDto";
import { isValidDate } from "../../../../shared/helpers/DateHelper";
import { RnaStructureDto } from "../dto/RnaStructureDto";
import { SirenStructureDto } from "../dto/SirenStructureDto";

export default class ApiAssoDtoAdapter {
    static providerNameRna = "RNA";
    static providerNameLcaDocument = "Le Compte Asso";
    static providerNameSiren = "SIREN";

    static apiDateToDate(stringDate: string) {
        if (!stringDate) throw new TypeError("should be a string to become a date");
        const [year, month, day] = stringDate.split("-").map(string => parseInt(string, 10));
        return new Date(Date.UTC(year, month - 1, day));
    }

    static sirenStructureToAssociation(structure: SirenStructureDto): Association {
        const toPvs = ProviderValueFactory.buildProviderValuesAdapter(
            this.providerNameSiren,
            ApiAssoDtoAdapter.apiDateToDate(structure.identite.date_modif_siren),
        );

        return {
            denomination_siren: toPvs(structure.identite.nom),
            siren: toPvs(structure.identite.id_siren),
            nic_siege: toPvs(siretToNIC(structure.identite.id_siret_siege)),
            categorie_juridique: toPvs(structure.identite.id_forme_juridique.toString()),
            date_creation_siren: toPvs(ApiAssoDtoAdapter.apiDateToDate(structure.identite.date_creation_sirene)),
            date_modification_siren: toPvs(ApiAssoDtoAdapter.apiDateToDate(structure.identite.date_modif_siren)),
            adresse_siege_siren: toPvs({
                numero: structure.coordonnees.adresse_siege.num_voie,
                type_voie: structure.coordonnees.adresse_siege.type_voie,
                voie: structure.coordonnees.adresse_siege.voie,
                code_postal: structure.coordonnees.adresse_siege.cp,
                commune: structure.coordonnees.adresse_siege.commune,
            }),
            etablisements_siret: toPvs(structure.etablissement.map(e => e.id_siret)),
        };
    }

    static rnaStructureToAssociation(structure: RnaStructureDto): Association {
        const toPVs = ProviderValueFactory.buildProviderValuesAdapter(
            this.providerNameRna,
            ApiAssoDtoAdapter.apiDateToDate(structure.identite.date_modif_rna),
        );

        return {
            rna: toPVs(structure.identite.id_rna),
            denomination_rna: toPVs(structure.identite.nom),
            date_creation_rna: structure.identite.date_pub_jo
                ? toPVs(ApiAssoDtoAdapter.apiDateToDate(structure.identite.date_pub_jo))
                : undefined,
            date_modification_rna: toPVs(ApiAssoDtoAdapter.apiDateToDate(structure.identite.date_modif_rna)),
            objet_social: toPVs(structure.activites.objet),
            code_objet_social_1: toPVs(structure.activites.lib_objet_social1),
            adresse_siege_rna: toPVs({
                numero: structure.coordonnees.adresse_siege.num_voie,
                type_voie: structure.coordonnees.adresse_siege.type_voie,
                voie: structure.coordonnees.adresse_siege.voie,
                code_postal: structure.coordonnees.adresse_siege.cp,
                commune: structure.coordonnees.adresse_siege.commune,
            }),
        };
    }

    static toEtablissement(
        etablissement: StructureEtablissementDto,
        ribs: StructureRibDto[],
        representantsLegaux: StructureRepresentantLegalDto[],
        dateModif: string,
    ): Etablissement {
        const toSirenPvs = ProviderValueFactory.buildProviderValuesAdapter(
            this.providerNameSiren,
            ApiAssoDtoAdapter.apiDateToDate(dateModif),
        );
        const toLCAPvs = ProviderValueFactory.buildProviderValuesAdapter(
            this.providerNameLcaDocument,
            ApiAssoDtoAdapter.apiDateToDate(dateModif),
        );

        const toContact = (r: StructureRepresentantLegalDto) => ({
            nom: r.nom,
            prenom: r.prenom,
            civilite: r.civilité,
            telephone: r.telephone,
            email: r.courriel,
            role: r.fonction,
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
                commune: etablissement.adresse.commune,
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
                : undefined,
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
            __meta__: {},
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
                    isoDate.getMinutes(),
                ),
            ),
        );

        return {
            nom: toLCAPv(dacDocument.nom),
            type: toLCAPv(dacDocument.meta.type),
            url: toLCAPv(dacDocument.url),
            __meta__: {
                siret: String(dacDocument.meta.id_siret),
            },
        };
    }

    static dacDocumentToRib(rib: StructureDacDocumentDto): Document {
        const isoDate = new Date(rib.time_depot);

        const toLCAPv = ProviderValueFactory.buildProviderValueAdapter(this.providerNameLcaDocument, isoDate);
        return {
            nom: toLCAPv(rib.meta.iban || rib.nom),
            type: toLCAPv("RIB"),
            url: toLCAPv(rib.url),
            __meta__: {
                siret: String(rib.meta.id_siret),
            },
        };
    }
}
