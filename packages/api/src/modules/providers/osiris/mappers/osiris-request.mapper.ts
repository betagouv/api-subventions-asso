import { ApplicationStatus, Association, Establishment, RnaDto, ApplicationNature } from "dto";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";
import OsirisActionEntity from "../entities/OsirisActionEntity";
import OsirisRequestEntity from "../entities/OsirisRequestEntity";
import { toStatusFactory } from "../../providers.mapper";
import { ApplicationFlatEntity } from "../../../../entities/flats/ApplicationFlatEntity";
import Siret, { SIRET_NAME } from "../../../../identifierObjects/Siret";
import Ridet, { RIDET_NAME } from "../../../../identifierObjects/Ridet";
import { GenericParser } from "../../../../shared/GenericParser";
import { CompanyIdType, EstablishmentIdType } from "../../../../identifierObjects/@types/IdentifierType";

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

    static toAssociation(entity: OsirisRequestEntity, actions: OsirisActionEntity[] = []): Association {
        const dataDate = new Date(Date.UTC(entity.providerInformations.exercise, 0));
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
            siren: toPVs(Siret.getSiren(entity.legalInformations.siret)),
            rna: entity.legalInformations.rna == undefined ? undefined : toPVs(entity.legalInformations.rna as RnaDto),
            denomination_rna: toPVs(entity.legalInformations.name),
            etablisements_siret: toPVs([entity.legalInformations.siret]),
            nic_siege: entity.providerInformations.etablissementSiege
                ? toPVs(Siret.getNic(entity.legalInformations.siret))
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
        const dataDate = new Date(Date.UTC(entity.providerInformations.exercise, 0));
        const toPVs = ProviderValueFactory.buildProviderValuesMapper(OsirisRequestMapper.PROVIDER_NAME, dataDate);

        return {
            siret: toPVs(entity.legalInformations.siret),
            nic: toPVs(Siret.getNic(entity.legalInformations.siret)),
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
                const cofinancers = action.indexedInformations.cofinanceurs;
                if (!cofinancers) return acc;
                cofinancers.split(";").forEach(cofinancer => acc.add(cofinancer));
                return acc;
            }, new Set<string>()),
        ).filter(str => str); // remove empty set value from the last trailing comma if exists

        return cofinancersNames;
    }

    static toApplicationFlat(entity: OsirisRequestEntity, actions: OsirisActionEntity[]): ApplicationFlatEntity {
        const provider = this.PROVIDER_NAME.toLowerCase();
        const budgetaryYear = entity.providerInformations.exercise;
        const applicationProviderId = entity.providerInformations.osirisId;
        const applicationId = `${provider}-${applicationProviderId}`;
        const uniqueId = `${applicationId}-${budgetaryYear}`;
        const estabIdType = this.getAssoIdType(entity.legalInformations.siret);

        let assoId: CompanyIdType, estabId: EstablishmentIdType;

        if (estabIdType === Siret.getName()) {
            estabId = new Siret(entity.legalInformations.siret);
            assoId = estabId.toSiren();
        } else {
            estabId = new Ridet(this.cleanRidet(entity.legalInformations.siret));
            assoId = estabId.toRid();
        }

        const assoIdType = assoId.name;

        // TODO: make a DTO for OsirisRequest. See #3590
        // @ts-expect-error: dto not available
        const depositDate = GenericParser.ExcelDateToJSDate(entity.data["Dossier"]["Date Reception"]);

        let ej: unknown = entity.providerInformations.ej;
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
            beneficiaryEstablishmentId: estabId,
            beneficiaryEstablishmentIdType: estabIdType,
            beneficiaryCompanyId: assoId,
            beneficiaryCompanyIdType: assoIdType,
            budgetaryYear,
            pluriannual: entity.providerInformations.pluriannualite === "Pluriannuel",
            pluriannualYears: this.getPluriannualYears(entity),
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
