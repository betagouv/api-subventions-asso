import { ProviderEnum } from "../../../@enums/ProviderEnum";
import fonjepDispositifPort from "../../../dataProviders/db/providers/fonjep/fonjep.dispositif.port";
import fonjepPostesPort from "../../../dataProviders/db/providers/fonjep/fonjep.postes.port";
import fonjepTiersPort from "../../../dataProviders/db/providers/fonjep/fonjep.tiers.port";
import fonjepTypePostePort from "../../../dataProviders/db/providers/fonjep/fonjep.typePoste.port";
import fonjepVersementsPort from "../../../dataProviders/db/providers/fonjep/fonjep.versements.port";
import paymentFlatService from "../../paymentFlat/paymentFlat.service";
import dataBretagneService from "../dataBretagne/dataBretagne.service";
import ProviderCore from "../ProviderCore";
import FonjepEntityAdapter from "./adapters/FonjepEntityAdapter";
import FonjepDispositifEntity from "./entities/FonjepDispositifEntity";
import { FonjepPaymentFlatEntity } from "./entities/FonjepPaymentFlatEntity";
import FonjepPosteEntity from "./entities/FonjepPosteEntity";
import FonjepTiersEntity from "./entities/FonjepTiersEntity";
import FonjepTypePosteEntity from "./entities/FonjepTypePosteEntity";
import FonjepVersementEntity, { PayedFonjepVersementEntity } from "./entities/FonjepVersementEntity";
import FonjepParser from "./fonjep.parser";

export class FonjepService extends ProviderCore {
    constructor() {
        super({
            name: "Extranet FONJEP",
            type: ProviderEnum.raw,
            description:
                "L'extranet de gestion du Fonjep permet aux services instructeurs d'indiquer les décisions d'attribution des subventions Fonjep et aux associations bénéficiaires de transmettre les informations nécessaires à la mise en paiment des subventions par le Fonjep, il ne gère pas les demandes de subvention qui ne sont pas dématérialisées à ce jour.",
            id: "fonjep",
        });
    }

    public fromFileToEntities(filePath: string): {
        tierEntities: FonjepTiersEntity[];
        posteEntities: FonjepPosteEntity[];
        versementEntities: FonjepVersementEntity[];
        typePosteEntities: FonjepTypePosteEntity[];
        dispositifEntities: FonjepDispositifEntity[];
    } {
        const { tiers, postes, versements, typePoste, dispositifs } = FonjepParser.parse(filePath);
        const tierEntities = tiers.map(tier => FonjepEntityAdapter.toFonjepTierEntity(tier));

        const posteEntities = postes.map(poste => FonjepEntityAdapter.toFonjepPosteEntity(poste));

        const versementEntities = versements.map(versement => FonjepEntityAdapter.toFonjepVersementEntity(versement));

        const typePosteEntities = typePoste.map(typePoste => FonjepEntityAdapter.toFonjepTypePosteEntity(typePoste));

        const dispositifEntities = dispositifs.map(dispositif =>
            FonjepEntityAdapter.toFonjepDispositifEntity(dispositif),
        );

        return { tierEntities, posteEntities, versementEntities, typePosteEntities, dispositifEntities };
    }

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
        const getPoste = (codeAsso: string) => collections.positions.find(poste => poste.code === codeAsso);

        const dataBretagneData = await dataBretagneService.getAllDataRecords();

        const fonjepFlatPayments = validPayments.reduce((acc, payment) => {
            const position = getPoste(payment.posteCode);

            // Financer with code 10006 is not handled. See #3431
            if (position?.financeurPrincipalCode === "10006") return acc;

            // cannot find thirdParty without associationBeneficiaireCode
            if (!position || !position.associationBeneficiaireCode) return acc;

            const thirdParty = getTier(position.associationBeneficiaireCode);

            // filter valid fonjep payments
            if (!thirdParty || !position) return acc;

            acc.push(
                FonjepEntityAdapter.toFonjepPaymentFlat(
                    { payment: payment as PayedFonjepVersementEntity, position, thirdParty },
                    dataBretagneData,
                ),
            );
            return acc;
        }, [] as FonjepPaymentFlatEntity[]);

        await paymentFlatService.upsertMany(fonjepFlatPayments);
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
}

const fonjepService = new FonjepService();
export default fonjepService;
