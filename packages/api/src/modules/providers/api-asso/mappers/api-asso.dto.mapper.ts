import {
    EstablishmentWithProviderValues,
    AssociationWithProviderValues,
    DocumentWithProviderValueDto,
    AssociationNature,
} from "dto";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";
import StructureDto, {
    StructureDacDocumentDto,
    StructureEstablishmentDto,
    StructureRepresentantLegalDto,
    StructureRibDto,
    StructureRnaDocumentDto,
} from "../dto/StructureDto";
import { isValidDate } from "../../../../shared/helpers/DateHelper";
import { RnaStructureDto } from "../dto/RnaStructureDto";
import { SirenStructureDto, SirenStructureEstablishmentDto } from "../dto/SirenStructureDto";
import Siret from "../../../../identifier-objects/Siret";
import { hasEmptyProperties } from "../../../../shared/helpers/ObjectHelper";

export default class ApiAssoDtoMapper {
    static providerNameRna = "RNA";
    static providerNameLcaDocument = "Le Compte Asso";
    static providerNameSiren = "SIREN";

    // typescript overloads
    protected static formatEstablishementSiret(
        establishments: SirenStructureEstablishmentDto[] | SirenStructureEstablishmentDto | undefined,
    ): SirenStructureEstablishmentDto[];
    protected static formatEstablishementSiret(
        establishments: StructureEstablishmentDto[] | StructureEstablishmentDto | undefined,
    ): StructureEstablishmentDto[];
    protected static formatEstablishementSiret(
        establishments: SirenStructureEstablishmentDto[] | StructureEstablishmentDto[] | undefined,
    ): SirenStructureEstablishmentDto[] | StructureEstablishmentDto[];

    // real implementation
    protected static formatEstablishementSiret(
        establishments:
            | SirenStructureEstablishmentDto[]
            | StructureEstablishmentDto[]
            | SirenStructureEstablishmentDto
            | StructureEstablishmentDto
            | undefined,
    ) {
        if (!establishments) return [];
        return Array.isArray(establishments) ? establishments : [establishments];
    }

    private static hasIdentity<T extends SirenStructureDto | RnaStructureDto | StructureDto>(
        structure: T,
    ): structure is T & { identite: NonNullable<T["identite"]> } {
        return !hasEmptyProperties(structure.identite);
    }

    static sirenStructureToAssociation(
        structure: SirenStructureDto | StructureDto,
    ): AssociationWithProviderValues | null {
        if (!structure || !this.hasIdentity(structure) || !structure.identite.id_siren) return null;

        const toPvs = ProviderValueFactory.buildProviderValuesMapper(
            this.providerNameSiren,
            new Date(structure.identite!.date_modif_siren),
        );

        const establishmentSiret = this.formatEstablishementSiret(structure.etablissements);

        return {
            denomination_siren: toPvs(structure.identite.nom),
            siren: toPvs(structure.identite.id_siren.toString()),
            nic_siege: structure.identite.id_siret_siege
                ? toPvs(Siret.getNic(structure.identite.id_siret_siege.toString()))
                : undefined,
            categorie_juridique: structure.identite.id_forme_juridique
                ? toPvs(structure.identite.id_forme_juridique.toString())
                : undefined,
            date_creation_siren: structure.identite.date_creation_sirene
                ? toPvs(new Date(structure.identite.date_creation_sirene))
                : undefined,
            date_modification_siren: structure.identite.date_modif_siren
                ? toPvs(new Date(structure.identite.date_modif_siren))
                : undefined,
            adresse_siege_siren: toPvs({
                numero: structure.coordonnees?.adresse_siege.num_voie?.toString(),
                type_voie: structure.coordonnees?.adresse_siege.type_voie,
                voie: structure.coordonnees?.adresse_siege.voie,
                code_postal: structure.coordonnees?.adresse_siege.cp?.toString(),
                commune: structure.coordonnees?.adresse_siege.commune,
            }),
            etablisements_siret: toPvs(establishmentSiret.map(e => e.id_siret.toString())),
        };
    }

    static rnaStructureToAssociation(structure: RnaStructureDto): AssociationWithProviderValues {
        const toPVs = ProviderValueFactory.buildProviderValuesMapper(
            this.providerNameRna,
            new Date(structure.identite.date_modif_rna),
        );

        // structure.identite.util_publique seems not to be implemented yet
        // a workaround is to use the nature field that can be read to determine if the association is RUP
        if (structure.identite?.nature === "Reconnue d'utilité publique") {
            structure.identite.util_publique = true;
        }

        return {
            rna: toPVs(structure.identite.id_rna),
            denomination_rna: toPVs(structure.identite.nom),
            date_creation_rna: structure.identite.date_pub_jo
                ? toPVs(new Date(structure.identite.date_pub_jo))
                : undefined,
            date_modification_rna: toPVs(new Date(structure.identite.date_modif_rna)),
            objet_social: toPVs(structure.activites.objet),
            code_objet_social_1: toPVs(structure.activites.lib_objet_social1),
            adresse_siege_rna: toPVs({
                numero: structure.coordonnees.adresse_siege.num_voie?.toString(),
                type_voie: structure.coordonnees.adresse_siege.type_voie,
                voie: structure.coordonnees.adresse_siege.voie,
                code_postal: structure.coordonnees.adresse_siege.cp?.toString(),
                commune: structure.coordonnees.adresse_siege.commune,
            }),
            nature: toPVs(structure.identite.nature as AssociationNature),
            rup: structure.identite.util_publique ? toPVs(structure.identite.util_publique) : undefined,
            date_rup: structure.identite.date_publication_util_publique
                ? toPVs(structure.identite.date_publication_util_publique)
                : undefined,
        };
    }

    static toEstablishment(
        establishment: StructureEstablishmentDto,
        ribs: StructureRibDto[],
        representantsLegaux: StructureRepresentantLegalDto[],
        dateModif: string,
    ): EstablishmentWithProviderValues {
        const toSirenPvs = ProviderValueFactory.buildProviderValuesMapper(this.providerNameSiren, new Date(dateModif));
        const toLCAPvs = ProviderValueFactory.buildProviderValuesMapper(
            this.providerNameLcaDocument,
            new Date(dateModif),
        );

        const toContact = (r: StructureRepresentantLegalDto) => ({
            nom: r.nom,
            prenom: r.prenom,
            civilite: r.civilité,
            telephone: r.telephone?.toString(),
            email: r.courriel,
            role: r.fonction,
        });

        return {
            siret: toSirenPvs(establishment.id_siret.toString()),
            nic: toSirenPvs(Siret.getNic(establishment.id_siret.toString())),
            ouvert: toSirenPvs(establishment.actif),
            siege: toSirenPvs(establishment.est_siege),
            adresse: toSirenPvs({
                numero: establishment.adresse.num_voie?.toString(),
                type_voie: establishment.adresse.type_voie,
                voie: establishment.adresse.voie,
                code_postal: establishment.adresse.cp?.toString(),
                commune: establishment.adresse.commune,
            }),
            information_banquaire: ribs
                .filter(rib => rib.id_siret === establishment.id_siret)
                .map(rib => toLCAPvs({ iban: rib.iban, bic: rib.bic })),
            representants_legaux: representantsLegaux
                ? representantsLegaux
                      .filter(r => r.id_siret === establishment.id_siret)
                      .map(r => toLCAPvs(toContact(r)))
                : undefined,
            contacts: representantsLegaux
                ? representantsLegaux
                      .filter(r => r.id_siret === establishment.id_siret)
                      .map(r => toLCAPvs(toContact(r)))
                : undefined,
        };
    }

    static convertAndEncodeUrl(url: string) {
        const distantUrl = url.replace(
            /^http:\/\/localhost:8181\/services/,
            "https://lecompteasso.associations.gouv.fr/apim/api-asso/",
        );
        return encodeURIComponent(distantUrl);
    }

    static rnaDocumentToDocument(rnaDocument: StructureRnaDocumentDto): DocumentWithProviderValueDto {
        let date = new Date(Date.UTC(rnaDocument.annee as number, 0));
        // DTO expect date, so we use 1970 as a hack to know that the date is not defined
        if (!isValidDate(date)) date = new Date(Date.UTC(1970, 0));
        else if (rnaDocument.time) date.setTime(date.getTime() + rnaDocument.time);

        const toRnaPv = ProviderValueFactory.buildProviderValueMapper(this.providerNameRna, date);
        return {
            nom: toRnaPv(`${rnaDocument.lib_sous_type} - ${rnaDocument.id}`),
            type: toRnaPv(rnaDocument.sous_type),
            url: toRnaPv(`/document/api_asso/?url=${ApiAssoDtoMapper.convertAndEncodeUrl(rnaDocument.url)}`),
            __meta__: {},
        };
    }

    static dacDocumentToDocument(dacDocument: StructureDacDocumentDto): DocumentWithProviderValueDto {
        const isoDate = new Date(dacDocument.time_depot);
        const toLCAPv = ProviderValueFactory.buildProviderValueMapper(
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
            url: toLCAPv(`/document/api_asso/?url=${ApiAssoDtoMapper.convertAndEncodeUrl(dacDocument.url)}`),
            __meta__: {
                siret: String(dacDocument.meta.id_siret),
            },
        };
    }

    static dacDocumentToRib(rib: StructureDacDocumentDto): DocumentWithProviderValueDto {
        const isoDate = new Date(rib.time_depot);

        const toLCAPv = ProviderValueFactory.buildProviderValueMapper(this.providerNameLcaDocument, isoDate);
        return {
            nom: toLCAPv(rib.meta.iban || rib.nom),
            type: toLCAPv("RIB"),
            url: toLCAPv(`/document/api_asso/?url=${ApiAssoDtoMapper.convertAndEncodeUrl(rib.url)}`),
            __meta__: {
                siret: String(rib.meta.id_siret),
            },
        };
    }
}
