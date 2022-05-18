import { siretToNIC } from "../../../../shared/helpers/SirenHelper";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";
import { Etablissement, Association }from "@api-subventions-asso/dto";
import Document from "../../../documents/@types/Document";
import StructureDto, { StructureDacDocumentDto, StructureEtablissementDto, StructureRepresentantLegalDto, StructureRibDto, StructureRnaDocumentDto } from "../dto/StructureDto";

export default class ApiAssoDtoAdapter {
    static providerNameRna = "BASE RNA <Via API ASSO>";
    static providerNameSiren = "BASE SIREN <Via API ASSO>";

    static toAssociation(structure: StructureDto): Association[] {
        const associations: Association[] = []
        const fromRNA = structure.identite.regime === "loi1901"; // Data come from rna
        const toDate = (stringDate: string) => {
            const [year, month, day] = stringDate.split("-").map(string => parseInt(string, 10));
            return new Date(Date.UTC(year, month-1, day));
        }
        
        if (structure.identite.date_modif_rna) {
            const toRnaPvs = ProviderValueFactory.buildProviderValuesAdapter(this.providerNameRna, toDate(structure.identite.date_modif_rna));   
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
            associations.push(rnaAssociation);
        }
        
        if (structure.identite.date_modif_siren) {
            const toSirenPvs = ProviderValueFactory.buildProviderValuesAdapter(this.providerNameSiren, toDate(structure.identite.date_modif_siren));
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
            associations.push(sirenAssociation);
        }

        return associations
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

    static toDocuments(structure: StructureDto): Document[] {
        const toDate = (stringDate: string) => {
            const [year, month, day] = stringDate.split("-").map(string => parseInt(string, 10));
            return new Date(Date.UTC(year, month-1, day));
        }

        const dataDate = toDate(structure.identite.date_modif_rna);
        const rnaDocuments = structure.document_rna?.map(document => ApiAssoDtoAdapter.rnaDocumentToDocument(document, dataDate)) || [];
        const dacDocuments = structure.document_dac?.map(document => ApiAssoDtoAdapter.dacDocumentToDocument(document, dataDate)) || [];
        const ribDocuments = structure.rib?.map(rib => ApiAssoDtoAdapter.ribDocumentToDocument(rib, dataDate)) || [];

        return [
            ...rnaDocuments,
            ...dacDocuments,
            ...ribDocuments.filter(r => r) as Document[]
        ]
    }

    private static rnaDocumentToDocument(rnaDocument: StructureRnaDocumentDto, date: Date): Document {
        const toRnaPv = ProviderValueFactory.buildProviderValueAdapter(this.providerNameRna, date);

        return {
            nom: toRnaPv(rnaDocument.id),
            type: toRnaPv(rnaDocument.type),
            url: toRnaPv(rnaDocument.url),
            __meta__: {}
        }
    }

    private static dacDocumentToDocument(dacDocument: StructureDacDocumentDto, date: Date): Document {
        const toRnaPv = ProviderValueFactory.buildProviderValueAdapter(this.providerNameRna, date);

        return {
            nom: toRnaPv(dacDocument.nom),
            type: toRnaPv(dacDocument.meta.type),
            url: toRnaPv(dacDocument.url),
            __meta__: {
                siret: dacDocument.meta.id_siret
            }
        }
    }

    private static ribDocumentToDocument(rib: StructureRibDto, date: Date): Document | null {
        if (!rib.url) return null;

        const toRnaPv = ProviderValueFactory.buildProviderValueAdapter(this.providerNameRna, date);

        return {
            nom: toRnaPv(rib.iban),
            type: toRnaPv("RIB"),
            url: toRnaPv(rib.url),
            __meta__: {
                siret: rib.id_siret
            }
        }
    }
}