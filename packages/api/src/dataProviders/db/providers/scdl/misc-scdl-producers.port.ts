import MiscScdlProducerEntity from "../../../../modules/providers/scdl/entities/MiscScdlProducerEntity";

export interface MiscScdlProducersPort {
    createIndexes(): Promise<void>;

    findAll(): Promise<MiscScdlProducerEntity[]>;
    findBySiret(siret: string): Promise<MiscScdlProducerEntity | null>;
    create(entity: MiscScdlProducerEntity): Promise<void>;
}
