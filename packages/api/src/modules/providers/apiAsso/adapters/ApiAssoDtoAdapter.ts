import { siretToNIC } from "../../../../shared/helpers/SirenHelper";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";
import { Etablissement, Association }from "@api-subventions-asso/dto";
import StructureDto, { StructureEtablissementDto, StructureRepresentantLegalDto, StructureRibDto } from "../dto/StructureDto";

export default class ApiAssoDtoAdapter {
    static providerNameRna = "BASE RNA <Via API ASSO>";
    static providerNameSiren = "BASE SIREN <Via API ASSO>";

    static toAssociation(structure: StructureDto): Association[] {
        const toDate = (stringDate: string) => {
            const [year, month, day] = stringDate.split("-").map(string => parseInt(string, 10));
            return new Date(Date.UTC(year, month-1, day));
        }
        const toRnaPvs = ProviderValueFactory.buildProviderValuesAdapter(this.providerNameRna, toDate(structure.identite.date_modif_rna));
        const toSirenPvs = ProviderValueFactory.buildProviderValuesAdapter(this.providerNameSiren, toDate(structure.identite.date_modif_siren));

        const fromRNA = structure.identite.regime === "loi1901"; // Data come from rna

        const rnaAssociation: Association = {
            rna: toRnaPvs(structure.identite.id_rna),
            denomination: toRnaPvs(structure.identite.nom),
            date_creation: structure.identite.date_creat ? toRnaPvs(toDate(structure.identite.date_creat)) : undefined,
            date_modification: toRnaPvs(toDate(structure.identite.date_modif_rna)),
            objet_social: toRnaPvs(structure.activites.objet),
            code_objet_social_1: toRnaPvs(structure.activites.id_objet_social1),
            code_objet_social_2: toRnaPvs(structure.activites.id_objet_social2),
            adresse_siege : fromRNA ? toRnaPvs({
                numero: structure.coordonnees.adresse_siege.num_voie,
                type_voie: structure.coordonnees.adresse_siege.type_voie,
                voie: structure.coordonnees.adresse_siege.voie,
                code_postal: structure.coordonnees.adresse_siege.cp,
                commune: structure.coordonnees.adresse_siege.commune,
            }) : undefined
        }

        if (structure.identite.date_modif_siren) {
            const adresse = structure.coordonnees.adresse_siege_sirene || fromRNA ? undefined : structure.coordonnees.adresse_siege;
            const sirenAssociation: Association = {
                denomination: structure.identite.nom_sirene ? toSirenPvs(structure.identite.nom_sirene): toSirenPvs(structure.identite.nom),
                siren: toSirenPvs(structure.identite.id_siren),
                nic_siege: toSirenPvs(siretToNIC(structure.identite.id_siret_siege)),
                categorie_juridique: toSirenPvs(structure.identite.id_forme_juridique.toString()),
                date_creation: structure.identite.date_creation_sirene ? toSirenPvs(toDate(structure.identite.date_creation_sirene)) : undefined,
                date_modification: toSirenPvs(toDate(structure.identite.date_modif_siren)),
                adresse_siege: adresse ? toSirenPvs({
                    numero: adresse.num_voie,
                    type_voie: adresse.type_voie,
                    voie: adresse.voie,
                    code_postal: adresse.cp,
                    commune: adresse.commune,
                }) : undefined,
                etablisements_siret: toSirenPvs(structure.etablissement.map(e => e.id_siret))
            }

            return [sirenAssociation, rnaAssociation]
        }

        return [rnaAssociation]
    }

    static toEtablissement(etablissement: StructureEtablissementDto, ribs: StructureRibDto[], representantsLegaux: StructureRepresentantLegalDto[], dateModif: string): Etablissement {
        const toDate = (stringDate: string) => {
            const [year, month, day] = stringDate.split("-").map(string => parseInt(string, 10));
            return new Date(Date.UTC(year, month-1, day));
        }
        const toSirenPvs = ProviderValueFactory.buildProviderValuesAdapter(this.providerNameSiren, toDate(dateModif));

        const toContact = (r: StructureRepresentantLegalDto) => (
            {
                nom: r.nom,
                prenom: r.prenom,
                civilite: r.civilité,
                telephone: r.telephone,
                email: r.courriel,
                role: r.fonction
            }
        )
        
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
            information_banquaire: ribs.filter(rib => rib.id_siret === etablissement.id_siret).map(rib => toSirenPvs({ iban: rib.iban, bic: rib.bic})),
            representants_legaux: representantsLegaux ? representantsLegaux
                .filter(r => r.id_siret === etablissement.id_siret)
                .map(r => toSirenPvs(toContact(r))) : undefined,
            contacts: representantsLegaux ? representantsLegaux
                .filter(r => r.id_siret === etablissement.id_siret)
                .map(r => toSirenPvs(toContact(r))) : undefined,
        }
    }
}