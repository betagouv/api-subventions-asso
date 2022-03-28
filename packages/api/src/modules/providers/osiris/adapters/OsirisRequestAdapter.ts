import { ProviderValue } from "../../../../@types";
import ProviderValueAdapter from "../../../../shared/adapters/ProviderValueAdapter";
import { siretToNIC, siretToSiren } from "../../../../shared/helpers/SirenHelper";
import Association from "../../../associations/interfaces/Association";
import DemandeSubvention from "../../../demandes_subventions/interfaces/DemandeSubvention";
import Etablissement from "../../../etablissements/interfaces/Etablissement";
import OsirisActionEntity from "../entities/OsirisActionEntity";
import OsirisRequestEntity from "../entities/OsirisRequestEntity";

export default class OsirisRequestAdapter {
    static PROVIDER_NAME = "Osiris"

    static toAssociation(entity: OsirisRequestEntity, actions : OsirisActionEntity[] = []): Association {
        const dataDate = entity.providerInformations.dateCommission || entity.providerInformations.exerciceDebut;
        const federation = actions.length && actions.find(action => action.indexedInformations.federation)?.indexedInformations.federation;
        const licencies = actions.length && actions.find(action => action.indexedInformations.federation)?.indexedInformations.licencies;
        const licenciesHommes = actions.length && actions.find(action => action.indexedInformations.federation)?.indexedInformations.licenciesHommes;
        const licenciesFemmes = actions.length && actions.find(action => action.indexedInformations.federation)?.indexedInformations.licenciesFemmes;

        return {
            siren: ProviderValueAdapter.toProviderValues(siretToSiren(entity.legalInformations.siret), OsirisRequestAdapter.PROVIDER_NAME, dataDate),
            rna: ProviderValueAdapter.toProviderValues(entity.legalInformations.rna, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
            denomination: ProviderValueAdapter.toProviderValues(entity.legalInformations.name, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
            etablisements_siret: ProviderValueAdapter.toProviderValues(
                [entity.legalInformations.siret]
                , OsirisRequestAdapter.PROVIDER_NAME, dataDate),
            nic_siege: entity.providerInformations.etablissementSiege 
                ? ProviderValueAdapter.toProviderValues(siretToNIC(entity.legalInformations.siret), OsirisRequestAdapter.PROVIDER_NAME, dataDate)
                : undefined,
            federation: federation
                ? ProviderValueAdapter.toProviderValues(federation, OsirisRequestAdapter.PROVIDER_NAME, dataDate)
                : undefined,
            licencies: licencies && licenciesHommes && licenciesFemmes
                ? {
                    total: ProviderValueAdapter.toProviderValues(licencies, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                    hommes: ProviderValueAdapter.toProviderValues(licenciesHommes, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                    femmes: ProviderValueAdapter.toProviderValues(licenciesFemmes, OsirisRequestAdapter.PROVIDER_NAME, dataDate)
                }
                : undefined,
            ...(actions.length ? {
                benevoles: {
                    nombre: ProviderValueAdapter.toProviderValues(actions[0].indexedInformations.benevoles, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                    ETPT: ProviderValueAdapter.toProviderValues(actions[0].indexedInformations.benevolesETPT, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                },
                salaries: {
                    nombre: ProviderValueAdapter.toProviderValues(actions[0].indexedInformations.salaries, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                    cdi: ProviderValueAdapter.toProviderValues(actions[0].indexedInformations.salariesCDI, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                    cdiETPT: ProviderValueAdapter.toProviderValues(actions[0].indexedInformations.salariesCDIETPT, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                    cdd: ProviderValueAdapter.toProviderValues(actions[0].indexedInformations.salariesCDD, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                    cddETPT: ProviderValueAdapter.toProviderValues(actions[0].indexedInformations.salariesCDDETPT, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                    emploisAides: ProviderValueAdapter.toProviderValues(actions[0].indexedInformations.emploiesAides, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                    emploisAidesETPT: ProviderValueAdapter.toProviderValues(actions[0].indexedInformations.emploiesAidesETPT, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                },
                volontaires: {
                    nombre: ProviderValueAdapter.toProviderValues(actions[0].indexedInformations.volontaires, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                    ETPT: ProviderValueAdapter.toProviderValues(actions[0].indexedInformations.volontairesETPT, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                } 
            }: {}
            )
        }
    }

    static toEtablissement(entity: OsirisRequestEntity): Etablissement {
        const dataDate = entity.providerInformations.dateCommission || entity.providerInformations.exerciceDebut;
        return {
            siret: ProviderValueAdapter.toProviderValues(entity.legalInformations.siret, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
            nic: ProviderValueAdapter.toProviderValues(siretToNIC(entity.legalInformations.siret), OsirisRequestAdapter.PROVIDER_NAME, dataDate),
            siege: ProviderValueAdapter.toProviderValues(entity.providerInformations.etablissementSiege, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
            adresse: ProviderValueAdapter.toProviderValues({
                voie: entity.providerInformations.etablissementVoie,
                code_postal: entity.providerInformations.etablissementCodePostal,
                commune: entity.providerInformations.etablissementCommune,
            }, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
            representants_legaux: [
                ProviderValueAdapter.toProviderValues({
                    nom: entity.providerInformations.representantNom,
                    prenom: entity.providerInformations.representantPrenom,
                    civilite: entity.providerInformations.representantCivilite,
                    role: entity.providerInformations.representantRole,
                    telephone: entity.providerInformations.representantPhone,
                    email: entity.providerInformations.representantEmail,
                }, OsirisRequestAdapter.PROVIDER_NAME, dataDate)
            ],
            contacts: [
                ProviderValueAdapter.toProviderValues({
                    nom: entity.providerInformations.representantNom,
                    prenom: entity.providerInformations.representantPrenom,
                    civilite: entity.providerInformations.representantCivilite,
                    role: entity.providerInformations.representantRole,
                    telephone: entity.providerInformations.representantPhone,
                    email: entity.providerInformations.representantEmail,
                }, OsirisRequestAdapter.PROVIDER_NAME, dataDate)
            ],
            information_banquaire: 
                entity.providerInformations.etablissementBIC && entity.providerInformations.etablissementIBAN 
                    ? [ProviderValueAdapter.toProviderValues({
                        bic: entity.providerInformations.etablissementBIC,
                        iban: entity.providerInformations.etablissementIBAN,
                    }, OsirisRequestAdapter.PROVIDER_NAME, dataDate)]
                    : [],
            
        }
    }

    static toDemandeSubvention(entity: OsirisRequestEntity): DemandeSubvention {
        const dataDate = entity.providerInformations.dateCommission || entity.providerInformations.exerciceDebut;
        
        const data: DemandeSubvention = {
            service_instructeur: ProviderValueAdapter.toProviderValue(entity.providerInformations.service_instructeur, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
            dispositif: ProviderValueAdapter.toProviderValue(entity.providerInformations.dispositif, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
            sous_dispositif: ProviderValueAdapter.toProviderValue(entity.providerInformations.sous_dispositif, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
            status: ProviderValueAdapter.toProviderValue(entity.providerInformations.status, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
            pluriannualite: ProviderValueAdapter.toProviderValue(entity.providerInformations.pluriannualite, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
            ej: entity.providerInformations.ej 
                ? ProviderValueAdapter.toProviderValue(entity.providerInformations.ej, OsirisRequestAdapter.PROVIDER_NAME, dataDate)
                : undefined,
            date_commision: entity.providerInformations.dateCommission 
                ? ProviderValueAdapter.toProviderValue(entity.providerInformations.dateCommission, OsirisRequestAdapter.PROVIDER_NAME, dataDate)
                : undefined,
            contact: {
                email: ProviderValueAdapter.toProviderValue(entity.providerInformations.representantEmail, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                telephone: entity.providerInformations.representantPhone 
                    ? ProviderValueAdapter.toProviderValue(entity.providerInformations.representantPhone, OsirisRequestAdapter.PROVIDER_NAME, dataDate)
                    : undefined
            },
            montants: {
                total: ProviderValueAdapter.toProviderValue(entity.providerInformations.montantsTotal, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                demande: ProviderValueAdapter.toProviderValue(entity.providerInformations.montantsDemande, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                propose: ProviderValueAdapter.toProviderValue(entity.providerInformations.montantsPropose, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                accorde: ProviderValueAdapter.toProviderValue(entity.providerInformations.montantsAccorde, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
            },
            versement: {
                acompte: ProviderValueAdapter.toProviderValue(entity.providerInformations.versementAcompte, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                solde: ProviderValueAdapter.toProviderValue(entity.providerInformations.versementSolde, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                realise: ProviderValueAdapter.toProviderValue(entity.providerInformations.versementRealise, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                compensation: {
                    "n-1": ProviderValueAdapter.toProviderValue(entity.providerInformations.versementCompensationN1, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                    reversement: ProviderValueAdapter.toProviderValue(entity.providerInformations.versementCompensationN, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                }
            }
        }

        if (entity.actions) {
            const territoires = entity.actions.map(action => {
                return {
                    status: ProviderValueAdapter.toProviderValue(action.indexedInformations.territoireStatus, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                    commentaire: ProviderValueAdapter.toProviderValue(action.indexedInformations.territoireCommentaire, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                };
            })

            data.territoires = territoires.reduce((acc, territoire) => {
                if (acc.some(t => 
                    t.status.value === territoire.status.value 
                    && t.status.last_update === territoire.status.last_update
                    && t.commentaire.value === territoire.commentaire.value 
                    && t.commentaire.last_update === territoire.commentaire.last_update
                )) return acc;

                return acc.concat(territoires);
            }, [] as { status: ProviderValue<string>, commentaire: ProviderValue<string> }[]);

            data.actions_proposee = entity.actions.map(action => ({
                ej: action.indexedInformations.ej 
                    ? ProviderValueAdapter.toProviderValue(action.indexedInformations.ej, OsirisRequestAdapter.PROVIDER_NAME, dataDate)
                    : undefined,
                rang: ProviderValueAdapter.toProviderValue(action.indexedInformations.rang, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                intitule: ProviderValueAdapter.toProviderValue(action.indexedInformations.intitule, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                objectifs: ProviderValueAdapter.toProviderValue(action.indexedInformations.objectifs, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                objectifs_operationnels: ProviderValueAdapter.toProviderValue(action.indexedInformations.objectifs_operationnels, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                description: ProviderValueAdapter.toProviderValue(action.indexedInformations.description, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                nature_aide: ProviderValueAdapter.toProviderValue(action.indexedInformations.nature_aide, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                modalite_aide: ProviderValueAdapter.toProviderValue(action.indexedInformations.modalite_aide, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                modalite_ou_dispositif: ProviderValueAdapter.toProviderValue(action.indexedInformations.modalite_ou_dispositif, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                indicateurs: ProviderValueAdapter.toProviderValue(action.indexedInformations.indicateurs, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                cofinanceurs: {
                    noms: ProviderValueAdapter.toProviderValue(action.indexedInformations.cofinanceurs, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                    montant_demandes: ProviderValueAdapter.toProviderValue(action.indexedInformations.cofinanceurs_montant_demandes, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                },
                montants_versement: {
                    total: ProviderValueAdapter.toProviderValue(action.indexedInformations.montants_versement_total, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                    demande: ProviderValueAdapter.toProviderValue(action.indexedInformations.montants_versement_demande, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                    propose: ProviderValueAdapter.toProviderValue(action.indexedInformations.montants_versement_propose, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                    accorde: ProviderValueAdapter.toProviderValue(action.indexedInformations.montants_versement_accorde, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                    attribue: ProviderValueAdapter.toProviderValue(action.indexedInformations.montants_versement_attribue, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                    realise: ProviderValueAdapter.toProviderValue(action.indexedInformations.montants_versement_realise, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                    compensation: ProviderValueAdapter.toProviderValue(action.indexedInformations.montants_versement_compensation, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                },
                evaluation: action.evaluation? {
                    evaluation_resultat: ProviderValueAdapter.toProviderValue(action.evaluation.indexedInformations.evaluation_resultat, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                    cout_total_realise: ProviderValueAdapter.toProviderValue(action.evaluation.indexedInformations.cout_total_realise, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
                } : undefined
            }))
        }

        return data
    }
}