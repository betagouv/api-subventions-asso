import {
    CommonApplicationDto,
    ApplicationStatus,
    Association,
    DemandeSubvention,
    Etablissement,
    ProviderValue,
    Rna,
} from "dto";
import { siretToNIC, siretToSiren } from "../../../../shared/helpers/SirenHelper";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";
import OsirisActionEntity from "../entities/OsirisActionEntity";
import OsirisRequestEntity from "../entities/OsirisRequestEntity";
import osirisService from "../osiris.service";
import { toStatusFactory } from "../../providers.adapter";
import { RawApplication } from "../../../grant/@types/rawGrant";
import ApplicationsFlatEntity from "../../../../entities/ApplicationsFlatEntity";

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

    private static toBooleanPluriannualite(pluriannualite : string) : boolean {
        if (pluriannualite === "Pluriannuel") {
        return true;
        } else if (pluriannualite === "Annuel") {
            return false;
        } else {
            throw new Error(`Valeur inattendue pour pluriannualite: ${pluriannualite}`);
        }
    }

    static toAssociation(entity: OsirisRequestEntity, actions: OsirisActionEntity[] = []): Association {
        const dataDate = new Date(Date.UTC(entity.providerInformations.extractYear, 0));
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
            rna: toPVs(entity.legalInformations.rna as Rna),
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
        const dataDate = new Date(Date.UTC(entity.providerInformations.extractYear, 0));
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
        const dataDate = new Date(Date.UTC(entity.providerInformations.extractYear, 0));
        const toPV = ProviderValueFactory.buildProviderValueAdapter(osirisService.provider.name, dataDate);

        const EJ = entity.providerInformations.ej ? toPV(entity.providerInformations.ej) : undefined;

        const data: DemandeSubvention = {
            annee_demande: toPV(entity.providerInformations.extractYear),
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

            data.territoires = territoires.reduce((acc, territoire) => {
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
            }, [] as { status: ProviderValue<string>; commentaire: ProviderValue<string> }[]);

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
                evaluation: action.evaluation
                    ? {
                          evaluation_resultat: toPV(action.evaluation.indexedInformations.evaluation_resultat),
                          cout_total_realise: toPV(action.evaluation.indexedInformations.cout_total_realise),
                      }
                    : undefined,
            }));
        }

        return data;
    }

    static toCommon(entity: OsirisRequestEntity): CommonApplicationDto {
        return {
            dispositif: entity.providerInformations.dispositif,
            exercice: entity.providerInformations.extractYear,
            montant_accorde: entity.providerInformations.montantsAccorde,
            montant_demande: entity.providerInformations.montantsDemande,
            objet: (entity.actions || []).map(action => action.indexedInformations.intitule).join(" – ") || "",
            service_instructeur: entity.providerInformations.service_instructeur,
            siret: entity.legalInformations.siret,
            statut: OsirisRequestAdapter.toStatus(entity.providerInformations.status),
        };
    }

    static toApplicationFlat(entity: OsirisRequestEntity): ApplicationsFlatEntity {
        return new ApplicationsFlatEntity(
            OsirisRequestAdapter.PROVIDER_NAME, // provider
            entity.providerInformations.osirisId, // idSubvention
            entity.providerInformations.compteAssoId, // idJointure
            "l'idJointure corresponds au n° dossier du compte ASSO. Cela permets ainsi de faire le lien avec les données issus de l'outil compte ASSO", // descriptionIdJointure
            null, // nomAttribuant
            null, // idAttribuant
            entity.providerInformations.service_instructeur, // nomServiceInstructeur
            null, // idServiceInstructeur
            entity.legalInformations.siret, // idBeneficiaire
            null, // exerciceBudgetaire
            this.toBooleanPluriannualite(entity.providerInformations.pluriannualite), // pluriannualite TO DO : convertir
            [], // anneesPluriannualites TO DO : faire methode pour extraire ça
            entity.providerInformations.dateCommission, // dateDecision
            null, // dateConvention (a valider)
            null, // referenceDecision
            null, // dateCreation
            null, // anneeCreation  TO DO : verifier que c'est extract demande
            null, // dateDebut
            null, // dateFin
            entity.providerInformations.dispositif, // dispositif
            entity.providerInformations.sous_dispositif, // sousDispositif
            OsirisRequestAdapter.toStatus(entity.providerInformations.status), // statutLabel
            null, // objet
            "aide en numéraire", // nature
            entity.providerInformations.montantsDemande, // montantDemande TO DO : a valider pour pluriannualite
            entity.providerInformations.montantsAccorde, // montantAccorde
            entity.providerInformations.ej, // ej
            null, // cleVersement
            null, // conditionsVersement TO DO : a valider
            null, // datesPeriodeVersement TO DO : a valider
            null, // cofinancement TO DO : à deduire à partire d'actions
            null, // attribuantsCofinanceurs TO DO : à deduire à partire d'actions
            null, // idCofinancement 
            null, // notificationUE
            null, // evaluationCout
            null, // evaluation
            );
    }
