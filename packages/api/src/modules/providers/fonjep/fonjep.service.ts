import { ProviderEnum } from "../../../@enums/ProviderEnum";
import { DefaultObject } from "../../../@types";
import fonjepDispositifPort from "../../../dataProviders/db/providers/fonjep/fonjep.dispositif.port";
import fonjepPostesPort from "../../../dataProviders/db/providers/fonjep/fonjep.postes.port";
import fonjepTiersPort from "../../../dataProviders/db/providers/fonjep/fonjep.tiers.port";
import fonjepTypePostePort from "../../../dataProviders/db/providers/fonjep/fonjep.typePoste.port";
import fonjepVersementsPort from "../../../dataProviders/db/providers/fonjep/fonjep.versements.port";
import { ApplicationFlatEntity } from "../../../entities/ApplicationFlatEntity";
import PaymentFlatEntity from "../../../entities/PaymentFlatEntity";
import Ridet from "../../../identifierObjects/Ridet";
import Siret from "../../../identifierObjects/Siret";
import { addWithNull } from "../../../shared/helpers/NumberHelper";
import ApplicationFlatProvider from "../../applicationFlat/@types/applicationFlatProvider";
import applicationFlatService from "../../applicationFlat/applicationFlat.service";
import PaymentFlatProvider from "../../paymentFlat/@types/paymentFlatProvider";
import paymentFlatService from "../../paymentFlat/paymentFlat.service";
import dataBretagneService from "../dataBretagne/dataBretagne.service";
import ProviderCore from "../ProviderCore";
import FonjepEntityAdapter from "./adapters/FonjepEntityAdapter";
import FonjepDispositifEntity from "./entities/FonjepDispositifEntity";
import { FonjepApplicationFlatEntity, FonjepPaymentFlatEntity } from "./entities/FonjepFlatEntity";
import FonjepPosteEntity from "./entities/FonjepPosteEntity";
import FonjepTiersEntity from "./entities/FonjepTiersEntity";
import FonjepTypePosteEntity from "./entities/FonjepTypePosteEntity";
import FonjepVersementEntity, { PayedFonjepVersementEntity } from "./entities/FonjepVersementEntity";
import FonjepParser from "./fonjep.parser";
import { ReadableStream } from "node:stream/web";

export class FonjepService extends ProviderCore implements ApplicationFlatProvider, PaymentFlatProvider {
    constructor() {
        super({
            name: "Extranet FONJEP",
            type: ProviderEnum.raw,
            description:
                "L'extranet de gestion du Fonjep permet aux services instructeurs d'indiquer les décisions d'attribution des subventions Fonjep et aux associations bénéficiaires de transmettre les informations nécessaires à la mise en paiment des subventions par le Fonjep, il ne gère pas les demandes de subvention qui ne sont pas dématérialisées à ce jour.",
            id: "fonjep",
        });
    }

    public fromFileToEntities(
        filePath: string,
        exportDate: Date,
    ): {
        tierEntities: FonjepTiersEntity[];
        posteEntities: FonjepPosteEntity[];
        versementEntities: FonjepVersementEntity[];
        typePosteEntities: FonjepTypePosteEntity[];
        dispositifEntities: FonjepDispositifEntity[];
    } {
        const { tiers, postes, versements, typePoste, dispositifs } = FonjepParser.parse(filePath);
        const tierEntities = tiers.map(tier => FonjepEntityAdapter.toFonjepTierEntity(tier, exportDate));

        const posteEntities = postes.map(poste => FonjepEntityAdapter.toFonjepPosteEntity(poste, exportDate));

        const versementEntities = versements.map(versement =>
            FonjepEntityAdapter.toFonjepVersementEntity(versement, exportDate),
        );

        const typePosteEntities = typePoste.map(typePoste =>
            FonjepEntityAdapter.toFonjepTypePosteEntity(typePoste, exportDate),
        );

        const dispositifEntities = dispositifs.map(dispositif =>
            FonjepEntityAdapter.toFonjepDispositifEntity(dispositif, exportDate),
        );

        return { tierEntities, posteEntities, versementEntities, typePosteEntities, dispositifEntities };
    }

    /**
     * |----------------------------|
     * |  Database Management      |
     * |----------------------------|
     */

    useTemporyCollection(active: boolean) {
        fonjepDispositifPort.useTemporyCollection(active);
        fonjepPostesPort.useTemporyCollection(active);
        fonjepTiersPort.useTemporyCollection(active);
        fonjepTypePostePort.useTemporyCollection(active);
        fonjepVersementsPort.useTemporyCollection(active);
    }

    async createFonjepCollections(
        tierEntities: FonjepTiersEntity[],
        posteEntities: FonjepPosteEntity[],
        versementEntities: FonjepVersementEntity[],
        typePosteEntities: FonjepTypePosteEntity[],
        dispositifEntities: FonjepDispositifEntity[],
    ) {
        await fonjepTiersPort.insertMany(tierEntities);
        await fonjepPostesPort.insertMany(posteEntities);
        await fonjepVersementsPort.insertMany(versementEntities);
        await fonjepTypePostePort.insertMany(typePosteEntities);
        await fonjepDispositifPort.insertMany(dispositifEntities);
    }

    async applyTemporyCollection() {
        await fonjepDispositifPort.applyTemporyCollection();
        await fonjepPostesPort.applyTemporyCollection();
        await fonjepTiersPort.applyTemporyCollection();
        await fonjepTypePostePort.applyTemporyCollection();
        await fonjepVersementsPort.applyTemporyCollection();
    }

    /**
     * |----------------------------|
     * |  PaymentFlat               |
     * |----------------------------|
     */

    /**
     * Check if payment has been payed
     *
     * @param payment
     * @returns
     */
    private isPaymentPayed(payment: Partial<FonjepVersementEntity>): payment is PayedFonjepVersementEntity {
        return !!(payment.montantPaye && payment.dateVersement && payment.periodeDebut);
    }

    /**
     *
     * For now, fonjepTier.code can be null.
     * Even if this specific case has not been seen in the file,
     * the first iteration of the new fonjep collections was made that way.
     *
     * There is a ticket to possibly improve fonjepTier and only persist tier with posteCode defined.
     * https://github.com/betagouv/api-subventions-asso/issues/3299
     *
     * This would ease the process of validation
     *
     * @param payment Payment to validate
     * @returns A boolean that makes a payment valid in our system or not
     */
    private validatePayment(payment: FonjepVersementEntity): payment is PayedFonjepVersementEntity {
        return Boolean(payment.posteCode) && this.isPaymentPayed(payment);
    }

    // only used for test to generate payment-flat on demand
    async getPaymentFlatCollections() {
        const thirdParties = await fonjepTiersPort.findAll();
        const positions = await fonjepPostesPort.findAll();
        const payments = await fonjepVersementsPort.findAll();
        return { thirdParties, positions, payments };
    }

    // only those 3 FONJEP collections are used for payment part
    async createPaymentFlatEntitiesFromCollections(collections: {
        thirdParties: FonjepTiersEntity[];
        positions: FonjepPosteEntity[];
        payments: FonjepVersementEntity[];
    }) {
        // select only payments that has been payed and with codePoste (until https://github.com/betagouv/api-subventions-asso/issues/3299 will be done)
        const validPayments: PayedFonjepVersementEntity[] = collections.payments.filter(payment =>
            this.validatePayment(payment),
        );

        const getTier = (code: string) => collections.thirdParties.find(tier => tier.code === code);

        const dataBretagneData = await dataBretagneService.getAllDataRecords();

        const payments = validPayments.reduce((acc, payment) => {
            const getPosition = (positionCode: string) =>
                collections.positions.find(
                    position => position.code === positionCode && position.annee === payment.periodeDebut.getFullYear(),
                ); // added periodDebut check because there is many position with the same code. To choose the right one we need to match the payment year too
            const position = getPosition(payment.posteCode);
            // cannot find thirdParty without associationBeneficiaireCode
            // it seems to be always defined in extract from 2025-03-31 => update the type ?
            if (!position || !position.associationBeneficiaireCode) return acc;
            // Financer with code 10006 is not handled. See #3431
            if (position?.financeurPrincipalCode === "10006") return acc;
            const thirdParty = getTier(position.associationBeneficiaireCode);
            if (!thirdParty) return acc;

            // exclude weird siretOuRidet values in FONJEP export. See #3432
            if (!Siret.isSiret(thirdParty?.siretOuRidet) && !Ridet.isRidet(thirdParty?.siretOuRidet)) return acc;

            acc.push(
                FonjepEntityAdapter.toFonjepPaymentFlat(
                    { payment: payment as PayedFonjepVersementEntity, position, thirdParty },
                    dataBretagneData,
                ),
            );
            return acc;
        }, [] as FonjepPaymentFlatEntity[]);

        return payments;
    }

    async addToPaymentFlat(collections: {
        thirdParties: FonjepTiersEntity[];
        positions: FonjepPosteEntity[];
        payments: FonjepVersementEntity[];
    }) {
        const payments = await this.createPaymentFlatEntitiesFromCollections(collections);

        const stream = ReadableStream.from(payments);
        return this.savePaymentsFromStream(stream);
    }

    /**
     * |----------------------------|
     * |  ApplicationFlat           |
     * |----------------------------|
     */

    addToApplicationFlat(collections: {
        positions: FonjepPosteEntity[];
        thirdParties: FonjepTiersEntity[];
        schemes: FonjepDispositifEntity[];
    }) {
        const applications: FonjepApplicationFlatEntity[] =
            this.createApplicationFlatEntitiesFromCollections(collections);

        const aggregatedApplications = this.processDuplicates(applications);

        const stream = ReadableStream.from(aggregatedApplications);
        return this.saveApplicationsFromStream(stream);
    }

    private groupApplicationsByUniqueId(applications: FonjepApplicationFlatEntity[]) {
        return applications.reduce(
            (acc, application) => {
                const uniqueId = application.uniqueId;
                if (acc[uniqueId]) acc[uniqueId].push(application);
                else acc[uniqueId] = [application];
                return acc;
            },
            {} as DefaultObject<FonjepApplicationFlatEntity[]>,
        );
    }

    // aggregate false fonjep application flat duplicates
    private aggregateApplications(applications: FonjepApplicationFlatEntity[]) {
        return applications.reduce((aggregate, application) => {
            aggregate.grantedAmount = addWithNull(aggregate.grantedAmount, application.grantedAmount);
            aggregate.requestedAmount = addWithNull(aggregate.requestedAmount, application.requestedAmount);
            aggregate.totalAmount = addWithNull(aggregate.totalAmount, application.totalAmount);
            return aggregate;
        });
    }

    // fonjep has some duplicates regarding ApplicationFlat uniqueId.
    // Positions never really close but are instead extended using the same codePoste
    // It groups and sums the amount to make one application of it
    processDuplicates(applications: FonjepApplicationFlatEntity[]): FonjepApplicationFlatEntity[] {
        const groupByUniqueId = this.groupApplicationsByUniqueId(applications);

        return Object.values(groupByUniqueId).reduce((aggregatedApplications, group) => {
            const aggregate = this.aggregateApplications(group);
            aggregatedApplications.push(aggregate);
            return aggregatedApplications;
        }, [] as FonjepApplicationFlatEntity[]);
    }

    createApplicationFlatEntitiesFromCollections(collections: {
        positions: FonjepPosteEntity[];
        thirdParties: FonjepTiersEntity[];
        schemes: FonjepDispositifEntity[];
    }): FonjepApplicationFlatEntity[] {
        const { positions, thirdParties, schemes } = collections;

        const applications: FonjepApplicationFlatEntity[] = [];
        const errors: string[] = [];

        positions.forEach(position => {
            const { allocator, beneficiary, instructor } = thirdParties.reduce(
                (result, thirdParty) => {
                    if (thirdParty.code === position.financeurPrincipalCode) result.allocator = thirdParty;
                    if (thirdParty.code === position.associationBeneficiaireCode) result.beneficiary = thirdParty;
                    if (thirdParty.code === position.financeurAttributeurCode) result.instructor = thirdParty;
                    return result;
                },
                { allocator: undefined, beneficiary: undefined, instructor: undefined } as {
                    allocator: FonjepTiersEntity | undefined;
                    beneficiary: FonjepTiersEntity | undefined;
                    instructor: FonjepTiersEntity | undefined;
                },
            );

            const scheme = schemes.find(scheme => scheme.financeurCode == position.financeurPrincipalCode);

            // only beneficiary is mandatory to create an application flat
            if (!beneficiary) {
                errors.push(
                    `Could not find informations on beneficiary to build ApplicationFlat for FONJEP position ${position.code}`,
                );
            } else {
                const partialApplication = FonjepEntityAdapter.toFonjepApplicationFlat({
                    position,
                    allocator,
                    beneficiary,
                    instructor,
                    scheme,
                });
                // TODO: remove this after #3586 is handled
                if (partialApplication) {
                    applications.push({
                        ...partialApplication,
                        updateDate: position.updateDate,
                    });
                }
            }
        });

        if (errors.length) {
            console.log(`${errors.length} positions that could not have been adapted to application flat`);
            // errors.forEach(error => console.log(error)); uncomment this if you want to list to be displayed
        }

        return applications;
    }

    saveApplicationsFromStream(stream: ReadableStream<ApplicationFlatEntity>) {
        return applicationFlatService.saveFromStream(stream);
    }

    savePaymentsFromStream(stream: ReadableStream<PaymentFlatEntity>) {
        return paymentFlatService.saveFromStream(stream);
    }
}

const fonjepService = new FonjepService();
export default fonjepService;
