import { ApplicationStatus, Association, Establishment, RnaDto, ApplicationNature } from "dto";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";
import OsirisActionEntity from "../entities/OsirisActionEntity";
import OsirisRequestEntity, { OsirisRequestCategory } from "../entities/OsirisRequestEntity";
import { toStatusFactory } from "../../providers.mapper";
import { ApplicationFlatEntity } from "../../../../entities/flats/ApplicationFlatEntity";
import Siret, { SIRET_NAME } from "../../../../identifier-objects/Siret";
import Ridet, { RIDET_NAME } from "../../../../identifier-objects/Ridet";
import { GenericParser } from "../../../../shared/GenericParser";
import { CompanyIdType, EstablishmentIdType } from "../../../../identifier-objects/@types/IdentifierType";

export default class OsirisRequestMapper {
    static PROVIDER_NAME = "Osiris";

    private static _statusConversionArray: { label: ApplicationStatus; providerStatusList: string[] }[] = [
        { label: ApplicationStatus.REFUSED, providerStatusList: ["Refusé"] },
        {
            label: ApplicationStatus.GRANTED,
            providerStatusList: ["Traitement Sirepa", "Traitement Chorus", "Terminé", "A évaluer"],
        },
        { label: ApplicationStatus.INELIGIBLE, providerStatusList: ["Rejeté", "Supprimé"] },
        {
            label: ApplicationStatus.PENDING,
            providerStatusList: [
                "Edition document",
                "Renvoyé au compte asso",
                "En cours d'instruction",
                "En attente superviseur",
                "En attente décision",
            ],
        },
    ];

    private static readonly toStatus = toStatusFactory(OsirisRequestMapper._statusConversionArray);

    static adaptsToNb(value) {
        return value ? (typeof value === "number" ? value : parseFloat(value)) : value;
    }

    static toDate(value) {
        if (!value) return value;
        if (value instanceof Date) return value;
        if (typeof value === "number") return GenericParser.ExcelDateToJSDate(value);

        const [day, month, year] = `${value}`.split("/").map(v => parseInt(v, 10));

        return new Date(Date.UTC(year, month - 1, day));
    }

    static getLegalInformations(entity: OsirisRequestEntity) {
        const association = entity.association || entity.beneficiaire || {};

        return {
            siret: association.siret as string,
            rna: association.rna as string,
            name: association.nom as string,
        };
    }

    static getProviderInformations(entity: OsirisRequestEntity) {
        const dossier = entity.dossier || {};
        const association = entity.association || entity.beneficiaire || {};
        const montants = entity.montants || {};
        const versements = entity.versements || {};
        const representantLegal = entity.representantLegal || {};
        const coordonnees = (entity.coordonnees ||
            entity.coordonneesCorrespondancePublipostage ||
            {}) as OsirisRequestCategory;
        const exercise = dossier.exerciceBudgetaire as number;
        const osirisId = dossier.osirisId as string;

        return {
            osirisId,
            exercise,
            uniqueId: `${osirisId}-${exercise}`,
            compteAssoId: dossier.compteAssoId as string,
            ej: dossier.ej as string,
            amountAwarded: this.adaptsToNb(montants.accorde),
            dateCommission: this.toDate(dossier.dateCommission),
            exerciceDebut: dossier.exerciceDebut,
            etablissementSiege: association.siege === "Oui" || association.siege === true,
            etablissementVoie: coordonnees.voie as string,
            etablissementCodePostal: coordonnees.codePostal as string,
            etablissementCommune: coordonnees.commune as string,
            etablissementIBAN: association.iban as string,
            etablissementBIC: association.bic as string,
            representantNom: representantLegal.nom as string,
            representantPrenom: representantLegal.prenom as string,
            representantRole: representantLegal.fonction as string,
            representantCivilite: representantLegal.civilite as string,
            representantEmail: (representantLegal.courriel || representantLegal.adresseMessagerie) as string,
            representantPhone: (representantLegal.telephone || representantLegal.noTelephone) as string,
            service_instructeur: dossier.service as string,
            dispositif: dossier.noProgrammeTypeFinancement as string,
            sous_dispositif: dossier.sousTypeFinancement as string,
            status: dossier.etatDossier as string,
            pluriannualite: dossier.pluriannualite as string,
            montantsTotal: this.adaptsToNb(montants.coutTotalDesCharges || montants.coutTotalCharges),
            montantsDemande: this.adaptsToNb(montants.demande),
            montantsPropose: this.adaptsToNb(montants.propose),
            montantsAccorde: this.adaptsToNb(montants.accorde),
            versementAcompte: this.adaptsToNb(versements.acompte),
            versementSolde: this.adaptsToNb(versements.solde),
            versementRealise: this.adaptsToNb(versements.realise),
            versementCompensationN1: this.adaptsToNb(versements.compensationN1),
            versementCompensationN: this.adaptsToNb(versements.reversementCompensation),
        };
    }

    static toAssociation(entity: OsirisRequestEntity, actions: OsirisActionEntity[] = []): Association {
        const legalInformations = this.getLegalInformations(entity);
        const providerInformations = this.getProviderInformations(entity);
        const dataDate = new Date(Date.UTC(providerInformations.exercise, 0));
        const toPVs = ProviderValueFactory.buildProviderValuesMapper(OsirisRequestMapper.PROVIDER_NAME, dataDate);
        const federation =
            actions.length &&
            actions.find(action => action.indexedInformations.federation)?.indexedInformations.federation;
        const licencies =
            actions.length &&
            actions.find(action => action.indexedInformations.federation)?.indexedInformations.licencies;
        const licenciesHommes =
            actions.length &&
            actions.find(action => action.indexedInformations.federation)?.indexedInformations.licenciesHommes;
        const licenciesFemmes =
            actions.length &&
            actions.find(action => action.indexedInformations.federation)?.indexedInformations.licenciesFemmes;

        return {
            siren: toPVs(Siret.getSiren(legalInformations.siret)),
            rna: legalInformations.rna == undefined ? undefined : toPVs(legalInformations.rna as RnaDto),
            denomination_rna: toPVs(legalInformations.name),
            etablisements_siret: toPVs([legalInformations.siret]),
            nic_siege: providerInformations.etablissementSiege
                ? toPVs(Siret.getNic(legalInformations.siret))
                : undefined,
            federation: federation ? toPVs(federation) : undefined,
            licencies:
                licencies && licenciesHommes && licenciesFemmes
                    ? {
                          total: toPVs(licencies),
                          hommes: toPVs(licenciesHommes),
                          femmes: toPVs(licenciesFemmes),
                      }
                    : undefined,
            ...(actions.length
                ? {
                      benevoles: {
                          nombre: toPVs(actions[0].indexedInformations.benevoles),
                          ETPT: toPVs(actions[0].indexedInformations.benevolesETPT),
                      },
                      salaries: {
                          nombre: toPVs(actions[0].indexedInformations.salaries),
                          cdi: toPVs(actions[0].indexedInformations.salariesCDI),
                          cdiETPT: toPVs(actions[0].indexedInformations.salariesCDIETPT),
                          cdd: toPVs(actions[0].indexedInformations.salariesCDD),
                          cddETPT: toPVs(actions[0].indexedInformations.salariesCDDETPT),
                          emploisAides: toPVs(actions[0].indexedInformations.emploiesAides),
                          emploisAidesETPT: toPVs(actions[0].indexedInformations.emploiesAidesETPT),
                      },
                      volontaires: {
                          nombre: toPVs(actions[0].indexedInformations.volontaires),
                          ETPT: toPVs(actions[0].indexedInformations.volontairesETPT),
                      },
                  }
                : {}),
        };
    }

    static toEstablishment(entity: OsirisRequestEntity): Establishment {
        const legalInformations = this.getLegalInformations(entity);
        const providerInformations = this.getProviderInformations(entity);
        const dataDate = new Date(Date.UTC(providerInformations.exercise, 0));
        const toPVs = ProviderValueFactory.buildProviderValuesMapper(OsirisRequestMapper.PROVIDER_NAME, dataDate);

        return {
            siret: toPVs(legalInformations.siret),
            nic: toPVs(Siret.getNic(legalInformations.siret)),
            siege: toPVs(providerInformations.etablissementSiege),
            adresse: toPVs({
                voie: providerInformations.etablissementVoie,
                code_postal: providerInformations.etablissementCodePostal,
                commune: providerInformations.etablissementCommune,
            }),
            representants_legaux: [
                toPVs({
                    nom: providerInformations.representantNom,
                    prenom: providerInformations.representantPrenom,
                    civilite: providerInformations.representantCivilite,
                    role: providerInformations.representantRole,
                    telephone: providerInformations.representantPhone,
                    email: providerInformations.representantEmail,
                }),
            ],
            contacts: [
                toPVs({
                    nom: providerInformations.representantNom,
                    prenom: providerInformations.representantPrenom,
                    civilite: providerInformations.representantCivilite,
                    role: providerInformations.representantRole,
                    telephone: providerInformations.representantPhone,
                    email: providerInformations.representantEmail,
                }),
            ],
            information_banquaire:
                providerInformations.etablissementBIC && providerInformations.etablissementIBAN
                    ? [
                          toPVs({
                              bic: providerInformations.etablissementBIC,
                              iban: providerInformations.etablissementIBAN,
                          }),
                      ]
                    : [],
        };
    }

    // find if identifier is a disguised Ridet or a native Siret
    static getAssoIdType(identifier: string): typeof SIRET_NAME | typeof RIDET_NAME {
        // disguised ridet starts with 9900 or 99000
        if (identifier.startsWith("9900")) return Ridet.getName();
        else return Siret.getName();
    }

    // transform disguised Ridet into a valid Ridet
    static cleanRidet(osirisRidet: string) {
        const ridet = osirisRidet.replace(/^99/, "").replace(/^0+/, ""); // ridet is 9 or 10 digits. It removes the starting 9900 or 99000 used by osiris to convert ridet into siret

        if (!Ridet.isRidet(ridet)) {
            throw new Error("Cleaned Ridet is not valid");
        }

        return ridet;
    }

    static getPluriannualYears(entity: OsirisRequestEntity): number[] {
        const startYear = entity.dossier.exerciceDebut as number;
        const endYear = entity.dossier.exerciceFin as number;
        const years: number[] = [];

        for (let start = startYear; start <= endYear; start++) {
            years.push(start);
        }

        return years;
    }

    // return all application cofinancers based on all linked actions
    // return empty string if no cofinancers is found
    static getCofinancers(actions: OsirisActionEntity[]) {
        const cofinancersNames = Array.from(
            actions.reduce((acc, action) => {
                const cofinancers = action.indexedInformations.cofinanceurs;
                if (!cofinancers) return acc;
                cofinancers.split(";").forEach(cofinancer => acc.add(cofinancer));
                return acc;
            }, new Set<string>()),
        ).filter(str => str); // remove empty set value from the last trailing comma if exists

        return cofinancersNames;
    }

    static toApplicationFlat(entity: OsirisRequestEntity, actions: OsirisActionEntity[]): ApplicationFlatEntity {
        const legalInformations = this.getLegalInformations(entity);
        const providerInformations = this.getProviderInformations(entity);
        const provider = this.PROVIDER_NAME.toLowerCase();
        const budgetaryYear = providerInformations.exercise;
        const applicationProviderId = providerInformations.osirisId;
        const applicationId = `${provider}-${applicationProviderId}`;
        const uniqueId = `${applicationId}-${budgetaryYear}`;
        const estabIdType = this.getAssoIdType(legalInformations.siret);

        let assoId: CompanyIdType, estabId: EstablishmentIdType;

        if (estabIdType === Siret.getName()) {
            estabId = new Siret(legalInformations.siret);
            assoId = estabId.toSiren();
        } else {
            estabId = new Ridet(this.cleanRidet(legalInformations.siret));
            assoId = estabId.toRid();
        }

        const assoIdType = assoId.name;
        const depositDate = this.toDate(entity.dossier.dateReception) as Date;

        let ej: unknown = providerInformations.ej;
        let paymentId: string | null;

        if (!ej) {
            ej = null;
            paymentId = null;
        } else {
            paymentId = `${estabId}-${ej}-${budgetaryYear}`;
        }

        const cofinancersNames = this.getCofinancers(actions);

        return {
            uniqueId,
            applicationId,
            applicationProviderId,
            provider,
            joinKeyId: providerInformations.compteAssoId,
            joinKeyDesc: `N° dossier de l'outil "Le Compte Asso". Il permet de faire un lien entre la requête OSIRIS et le dossier du Compte Asso.`,
            allocatorName: null,
            allocatorIdType: null,
            allocatorId: null,
            managingAuthorityName: null,
            managingAuthorityId: null,
            managingAuthorityIdType: null,
            instructiveDepartmentName: providerInformations.service_instructeur,
            instructiveDepartmentIdType: null,
            instructiveDepartementId: null,
            beneficiaryEstablishmentId: estabId,
            beneficiaryEstablishmentIdType: estabIdType,
            beneficiaryCompanyId: assoId,
            beneficiaryCompanyIdType: assoIdType,
            budgetaryYear,
            pluriannual: providerInformations.pluriannualite === "Pluriannuel",
            pluriannualYears: this.getPluriannualYears(entity),
            decisionDate: providerInformations.dateCommission,
            conventionDate: null,
            decisionReference: null,
            depositDate,
            requestYear: depositDate.getFullYear(),
            scheme: providerInformations.dispositif,
            subScheme: providerInformations.sous_dispositif,
            statusLabel: this.toStatus(providerInformations.status),
            object: actions.map(action => action.indexedInformations.intitule).join("|"),
            nature: ApplicationNature.MONEY,
            requestedAmount: providerInformations.montantsDemande,
            grantedAmount: providerInformations.montantsAccorde,
            totalAmount: null,
            ej,
            paymentId,
            paymentCondition: null,
            paymentConditionDesc: null,
            paymentPeriodDates: null,
            cofinancersNames: cofinancersNames,
            cofinancingRequested: cofinancersNames.length > 0,
            cofinancersIdType: null,
            confinancersId: null,
            idRAE: null,
            ueNotification: null,
            subventionPercentage: null,
            updateDate: entity.updateDate,
        } as ApplicationFlatEntity;
    }
}
