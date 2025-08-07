import {
    CommonApplicationDto,
    ApplicationStatus,
    Association,
    DemandeSubvention,
    Etablissement,
    ProviderValue,
    RnaDto,
} from "dto";
import { siretToNIC, siretToSiren } from "../../../../shared/helpers/SirenHelper";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";
import OsirisActionEntity from "../entities/OsirisActionEntity";
import OsirisRequestEntity from "../entities/OsirisRequestEntity";
import osirisService from "../osiris.service";
import { toStatusFactory } from "../../providers.adapter";
import { RawApplication } from "../../../grant/@types/rawGrant";
import { ApplicationFlatEntity, ApplicationNature } from "../../../../entities/ApplicationFlatEntity";
import Siret from "../../../../identifierObjects/Siret";
import Ridet from "../../../../identifierObjects/Ridet";
import { GenericParser } from "../../../../shared/GenericParser";

export default class OsirisRequestAdapter {
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

    private static readonly toStatus = toStatusFactory(OsirisRequestAdapter._statusConversionArray);

    static toAssociation(entity: OsirisRequestEntity, actions: OsirisActionEntity[] = []): Association {
        const dataDate = new Date(Date.UTC(entity.providerInformations.exercise, 0));
        const toPVs = ProviderValueFactory.buildProviderValuesAdapter(OsirisRequestAdapter.PROVIDER_NAME, dataDate);
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
            siren: toPVs(siretToSiren(entity.legalInformations.siret)),
            rna: entity.legalInformations.rna == undefined ? undefined : toPVs(entity.legalInformations.rna as RnaDto),
            denomination_rna: toPVs(entity.legalInformations.name),
            etablisements_siret: toPVs([entity.legalInformations.siret]),
            nic_siege: entity.providerInformations.etablissementSiege
                ? toPVs(siretToNIC(entity.legalInformations.siret))
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

    static toEtablissement(entity: OsirisRequestEntity): Etablissement {
        const dataDate = new Date(Date.UTC(entity.providerInformations.exercise, 0));
        const toPVs = ProviderValueFactory.buildProviderValuesAdapter(OsirisRequestAdapter.PROVIDER_NAME, dataDate);

        return {
            siret: toPVs(entity.legalInformations.siret),
            nic: toPVs(siretToNIC(entity.legalInformations.siret)),
            siege: toPVs(entity.providerInformations.etablissementSiege),
            adresse: toPVs({
                voie: entity.providerInformations.etablissementVoie,
                code_postal: entity.providerInformations.etablissementCodePostal,
                commune: entity.providerInformations.etablissementCommune,
            }),
            representants_legaux: [
                toPVs({
                    nom: entity.providerInformations.representantNom,
                    prenom: entity.providerInformations.representantPrenom,
                    civilite: entity.providerInformations.representantCivilite,
                    role: entity.providerInformations.representantRole,
                    telephone: entity.providerInformations.representantPhone,
                    email: entity.providerInformations.representantEmail,
                }),
            ],
            contacts: [
                toPVs({
                    nom: entity.providerInformations.representantNom,
                    prenom: entity.providerInformations.representantPrenom,
                    civilite: entity.providerInformations.representantCivilite,
                    role: entity.providerInformations.representantRole,
                    telephone: entity.providerInformations.representantPhone,
                    email: entity.providerInformations.representantEmail,
                }),
            ],
            information_banquaire:
                entity.providerInformations.etablissementBIC && entity.providerInformations.etablissementIBAN
                    ? [
                          toPVs({
                              bic: entity.providerInformations.etablissementBIC,
                              iban: entity.providerInformations.etablissementIBAN,
                          }),
                      ]
                    : [],
        };
    }

    static rawToApplication(rawApplication: RawApplication<OsirisRequestEntity>) {
        return this.toDemandeSubvention(rawApplication.data);
    }

    static toDemandeSubvention(entity: OsirisRequestEntity): DemandeSubvention {
        const dataDate = new Date(Date.UTC(entity.providerInformations.exercise, 0));
        const toPV = ProviderValueFactory.buildProviderValueAdapter(osirisService.provider.name, dataDate);

        const EJ = entity.providerInformations.ej ? toPV(entity.providerInformations.ej) : undefined;

        const data: DemandeSubvention = {
            annee_demande: toPV(entity.providerInformations.exercise),
            siret: toPV(entity.legalInformations.siret),
            service_instructeur: toPV(entity.providerInformations.service_instructeur),
            dispositif: toPV(entity.providerInformations.dispositif),
            sous_dispositif: toPV(entity.providerInformations.sous_dispositif),
            statut_label: toPV(OsirisRequestAdapter.toStatus(entity.providerInformations.status)),
            status: toPV(entity.providerInformations.status),
            pluriannualite: toPV(entity.providerInformations.pluriannualite),
            ej: EJ,
            versementKey: EJ,
            date_commision: entity.providerInformations.dateCommission
                ? toPV(entity.providerInformations.dateCommission)
                : undefined,
            contact: {
                email: toPV(entity.providerInformations.representantEmail),
                telephone: entity.providerInformations.representantPhone
                    ? toPV(entity.providerInformations.representantPhone)
                    : undefined,
            },
            montants: {
                total: toPV(entity.providerInformations.montantsTotal),
                demande: toPV(entity.providerInformations.montantsDemande),
                propose: toPV(entity.providerInformations.montantsPropose),
                accorde: toPV(entity.providerInformations.montantsAccorde),
            },
            versement: {
                acompte: toPV(entity.providerInformations.versementAcompte),
                solde: toPV(entity.providerInformations.versementSolde),
                realise: toPV(entity.providerInformations.versementRealise),
                compensation: {
                    "n-1": toPV(entity.providerInformations.versementCompensationN1),
                    reversement: toPV(entity.providerInformations.versementCompensationN),
                },
            },
        };

        if (entity.actions) {
            const territoires = entity.actions.map(action => {
                return {
                    status: toPV(action.indexedInformations.territoireStatus),
                    commentaire: toPV(action.indexedInformations.territoireCommentaire),
                };
            });

            data.territoires = territoires.reduce(
                (acc, territoire) => {
                    if (
                        acc.some(
                            t =>
                                t.status.value === territoire.status.value &&
                                t.status.last_update === territoire.status.last_update &&
                                t.commentaire.value === territoire.commentaire.value &&
                                t.commentaire.last_update === territoire.commentaire.last_update,
                        )
                    )
                        return acc;

                    return acc.concat(territoires);
                },
                [] as { status: ProviderValue<string>; commentaire: ProviderValue<string> }[],
            );

            data.actions_proposee = entity.actions.map(action => ({
                ej: action.indexedInformations.ej ? toPV(action.indexedInformations.ej) : undefined,
                rang: toPV(action.indexedInformations.rang),
                intitule: toPV(action.indexedInformations.intitule),
                objectifs: toPV(action.indexedInformations.objectifs),
                objectifs_operationnels: toPV(action.indexedInformations.objectifs_operationnels),
                description: toPV(action.indexedInformations.description),
                nature_aide: toPV(action.indexedInformations.nature_aide),
                modalite_aide: toPV(action.indexedInformations.modalite_aide),
                modalite_ou_dispositif: toPV(action.indexedInformations.modalite_ou_dispositif),
                indicateurs: toPV(action.indexedInformations.indicateurs),
                cofinanceurs: {
                    noms: toPV(action.indexedInformations.cofinanceurs),
                    montant_demandes: toPV(action.indexedInformations.cofinanceurs_montant_demandes),
                },
                montants_versement: {
                    total: toPV(action.indexedInformations.montants_versement_total),
                    demande: toPV(action.indexedInformations.montants_versement_demande),
                    propose: toPV(action.indexedInformations.montants_versement_propose),
                    accorde: toPV(action.indexedInformations.montants_versement_accorde),
                    attribue: toPV(action.indexedInformations.montants_versement_attribue),
                    realise: toPV(action.indexedInformations.montants_versement_realise),
                    compensation: toPV(action.indexedInformations.montants_versement_compensation),
                },
            }));
        }

        return data;
    }

    static toCommon(entity: OsirisRequestEntity): CommonApplicationDto {
        return {
            dispositif: entity.providerInformations.dispositif,
            exercice: entity.providerInformations.exercise,
            montant_accorde: entity.providerInformations.montantsAccorde,
            montant_demande: entity.providerInformations.montantsDemande,
            objet: (entity.actions || []).map(action => action.indexedInformations.intitule).join(" – ") || "",
            service_instructeur: entity.providerInformations.service_instructeur,
            siret: entity.legalInformations.siret,
            statut: OsirisRequestAdapter.toStatus(entity.providerInformations.status),
        };
    }

    // find if identifier is a disguised Ridet or a native Siret
    static getAssoIdType(identifier: string) {
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
        const startYear = (entity.data as unknown & { Dossier: { "Exercice Début": number; "Exercice Fin": number } })
            .Dossier["Exercice Début"];
        const endYear = (entity.data as unknown & { Dossier: { "Exercice Début": number; "Exercice Fin": number } })
            .Dossier["Exercice Fin"];
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
                action.indexedInformations.cofinanceurs.split(";").forEach(cofinancer => acc.add(cofinancer));
                return acc;
            }, new Set<string>()),
        )
            .filter(str => str) // remove empty set value from the last trailing comma if exists
            .join("|");
        return cofinancersNames;
    }

    static toApplicationFlat(entity: OsirisRequestEntity, actions: OsirisActionEntity[]): ApplicationFlatEntity {
        const provider = this.PROVIDER_NAME.toLowerCase();
        const budgetaryYear = entity.providerInformations.exercise;
        const applicationProviderId = entity.providerInformations.osirisId;
        const applicationId = `${provider}-${applicationProviderId}`;
        const uniqueId = `${applicationId}-${budgetaryYear}`;
        const assoIdType = this.getAssoIdType(entity.legalInformations.siret);
        const assoId =
            assoIdType === Siret.getName()
                ? entity.legalInformations.siret
                : this.cleanRidet(entity.legalInformations.siret);
        // TODO: make a DTO for OsirisRequest. See #3590
        // @ts-expect-error: dto not available
        const depositDate = GenericParser.ExcelDateToJSDate(entity.data["Dossier"]["Date Reception"]);
        const ej = entity.providerInformations.ej;
        const paymentId = `${assoId}-${ej}-${budgetaryYear}`;
        const cofinancersNames = this.getCofinancers(actions);

        return {
            uniqueId,
            applicationId,
            applicationProviderId,
            provider,
            joinKeyId: entity.providerInformations.compteAssoId,
            joinKeyDesc: `N° dossier de l'outil "Le Compte Asso". Il permet de faire un lien entre la requête OSIRIS et le dossier du Compte Asso.`,
            allocatorName: null,
            allocatorIdType: null,
            allocatorId: null,
            managingAuthorityName: null,
            managingAuthorityId: null,
            managingAuthorityIdType: null,
            instructiveDepartmentName: entity.providerInformations.service_instructeur,
            instructiveDepartmentIdType: null,
            instructiveDepartementId: null,
            beneficiaryEstablishmentId: entity.legalInformations.siret,
            beneficiaryEstablishmentIdType: assoId,
            budgetaryYear,
            pluriannual: entity.providerInformations.pluriannualite === "Pluriannuel",
            pluriannualYears: this.getPluriannualYears(entity).join("|"),
            decisionDate: entity.providerInformations.dateCommission,
            conventionDate: null,
            decisionReference: null,
            depositDate,
            requestYear: depositDate.getFullYear(),
            scheme: entity.providerInformations.dispositif,
            subScheme: entity.providerInformations.sous_dispositif,
            statusLabel: this.toStatus(entity.providerInformations.status),
            object: actions.map(action => action.indexedInformations.intitule).join("|"),
            nature: ApplicationNature.MONEY,
            requestedAmount: entity.providerInformations.montantsDemande,
            grantedAmount: entity.providerInformations.montantsAccorde,
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
