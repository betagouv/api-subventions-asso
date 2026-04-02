import PaymentFlatEntity from "../../../entities/flats/PaymentFlatEntity";
import { DefaultObject } from "../../../@types";
import { ChorusPaymentFlatEntity } from "../../../modules/providers/chorus/@types/ChorusPaymentFlat";
import Siret from "../../../identifierObjects/Siret";
import Siren from "../../../identifierObjects/Siren";

export interface PaymentFlatPort {
    createIndexes(): Promise<void>;

    hasBeenInitialized(): Promise<boolean>;
    insertOne(entity: PaymentFlatEntity): Promise<void>;
    upsertOne(entity: PaymentFlatEntity): Promise<void>;
    insertMany(entities: PaymentFlatEntity[]): Promise<void>;
    findAll(): Promise<PaymentFlatEntity[]>;
    cursorFind(query: DefaultObject<unknown>, projection: DefaultObject<unknown>): AsyncIterable<PaymentFlatEntity>;
    cursorFindChorusOnly(exerciceBudgetaire?: number): AsyncIterable<ChorusPaymentFlatEntity>;
    deleteAll(): Promise<void>;
    findBySiret(siret: Siret): Promise<PaymentFlatEntity[]>;
    findBySiren(siren: Siren): Promise<PaymentFlatEntity[]>;
    findByEJ(ej: string): Promise<PaymentFlatEntity[]>;
}
