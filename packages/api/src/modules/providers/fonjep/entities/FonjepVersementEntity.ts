import type { ProviderDataEntity } from "../../../../@types/ProviderData";

interface FonjepVersementEntity extends ProviderDataEntity {
    posteCode: string;
    periodeDebut: Date | null;
    periodeFin: Date | null;
    dateVersement: Date | null;
    montantAPayer: number | null;
    montantPaye: number | null;
}

export type PayedFonjepVersementEntity = FonjepVersementEntity & {
    periodeDebut: Date;
    periodeFin: Date;
    dateVersement: Date;
    montantAPayer: number;
    montantPaye: number;
};

export default FonjepVersementEntity;
