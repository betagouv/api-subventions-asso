import { ProviderValues, Rna, DemandeSubvention, ProviderValue, Association, Etablissement } from "@api-subventions-asso/dto";
import ProviderValueAdapter from "../../../../shared/adapters/ProviderValueAdapter";
import { siretToNIC, siretToSiren } from "../../../../shared/helpers/SirenHelper";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";
import OsirisActionEntity from "../entities/OsirisActionEntity";
import OsirisRequestEntity from "../entities/OsirisRequestEntity";
import osirisService from "../osiris.service";

export default class OsirisRequestAdapter {
    static PROVIDER_NAME = "Osiris"

    static toAssociation(entity: OsirisRequestEntity, actions: OsirisActionEntity[] = []): Association {
        const dataDate = new Date(Date.UTC(entity.providerInformations.extractYear, 0));
        const federation = actions.length && actions.find(action => action.indexedInformations.federation)?.indexedInformations.federation;
        const licencies = actions.length && actions.find(action => action.indexedInformations.federation)?.indexedInformations.licencies;
        const licenciesHommes = actions.length && actions.find(action => action.indexedInformations.federation)?.indexedInformations.licenciesHommes;
        const licenciesFemmes = actions.length && actions.find(action => action.indexedInformations.federation)?.indexedInformations.licenciesFemmes;

        return {
            siren: ProviderValueAdapter.toProviderValues(siretToSiren(entity.legalInformations.siret), OsirisRequestAdapter.PROVIDER_NAME, dataDate),
            rna: ProviderValueAdapter.toProviderValues(entity.legalInformations.rna, OsirisRequestAdapter.PROVIDER_NAME, dataDate) as ProviderValues<Rna>,
            denomination_rna: ProviderValueAdapter.toProviderValues(entity.legalInformations.name, OsirisRequestAdapter.PROVIDER_NAME, dataDate),
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
            } : {}
            )
        }
    }

    static toEtablissement(entity: OsirisRequestEntity): Etablissement {
        const dataDate = new Date(Date.UTC(entity.providerInformations.extractYear, 0));
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
        const dataDate = new Date(Date.UTC(entity.providerInformations.extractYear, 0));
        const toPV = ProviderValueFactory.buildProviderValueAdapter(osirisService.provider.name, dataDate);

        const EJ = entity.providerInformations.ej
            ? toPV(entity.providerInformations.ej)
            : undefined;

        const data: DemandeSubvention = {
            annee_demande: toPV(entity.providerInformations.extractYear),
            siret: toPV(entity.legalInformations.siret),
            service_instructeur: toPV(entity.providerInformations.service_instructeur),
            dispositif: toPV(entity.providerInformations.dispositif),
            sous_dispositif: toPV(entity.providerInformations.sous_dispositif),
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
                    : undefined
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
                }
            }
        }

        if (entity.actions) {
            const territoires = entity.actions.map(action => {
                return {
                    status: toPV(action.indexedInformations.territoireStatus),
                    commentaire: toPV(action.indexedInformations.territoireCommentaire),
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
                    ? toPV(action.indexedInformations.ej)
                    : undefined,
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
                evaluation: action.evaluation ? {
                    evaluation_resultat: toPV(action.evaluation.indexedInformations.evaluation_resultat),
                    cout_total_realise: toPV(action.evaluation.indexedInformations.cout_total_realise),
                } : undefined
            }))
        }

        return data
    }
}