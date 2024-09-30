import { FonjepPayment } from "dto";
import FonjepPaymentEntity from "../entities/FonjepPaymentEntity";

export const FONJEP_PAYMENT_ENTITIES: FonjepPaymentEntity[] = [
    {
        data: {
            DateVersement: 42761,
            MontantAPayer: 1777,
            MontantPaye: 1777,
            PeriodeDebut: 42736,
            PeriodeFin: 42825,
            PosteCode: "J10540",
            id: "J10540-2018-12-31T00:00:00.000Z-1970-01-01T00:00:42.736Z",
            siret: "00000000000000",
            updated_at: "2022-03-03T00:00:00.000Z",
        },
        indexedInformations: {
            unique_id: "",
            code_poste: "J10540",
            date_versement: new Date("2017-01-26T00:00:00.000Z"),
            montant_a_payer: 1777,
            montant_paye: 1777,
            periode_debut: new Date("2017-01-01T00:00:00.000Z"),
            periode_fin: new Date("2017-03-31T00:00:00.000Z"),
            updated_at: new Date("2022-03-03T00:00:00.000Z"),
            bop: 163,
            joinKey: "2017-J10540",
        },
        legalInformations: {
            siret: "00000000000000",
        },
    },
    {
        data: {
            DateVersement: 42761,
            MontantAPayer: 1791,
            MontantPaye: 1791,
            PeriodeDebut: 42736,
            PeriodeFin: 42825,
            PosteCode: "J02924",
            id: "J02924-2024-12-31T00:00:00.000Z-1970-01-01T00:00:42.736Z",
            siret: "00000000000000",
            updated_at: "2022-03-03T00:00:00.000Z",
        },
        indexedInformations: {
            unique_id: "",
            code_poste: "J02924",
            date_versement: new Date("2017-01-26T00:00:00.000Z"),
            montant_a_payer: 1791,
            montant_paye: 1791,
            periode_debut: new Date("2017-01-01T00:00:00.000Z"),
            periode_fin: new Date("2017-03-31T00:00:00.000Z"),
            updated_at: new Date("2022-03-03T00:00:00.000Z"),
            bop: 163,
            joinKey: "2017-J02924",
        },
        legalInformations: {
            siret: "00000000000000",
        },
    },
    {
        data: {
            DateVersement: 42852,
            MontantAPayer: 1791,
            MontantPaye: 1791,
            PeriodeDebut: 42826,
            PeriodeFin: 42916,
            PosteCode: "J02924",
            id: "J02924-2024-12-31T00:00:00.000Z-1970-01-01T00:00:42.826Z",
            siret: "00000000000000",
            updated_at: "2022-03-03T00:00:00.000Z",
        },
        indexedInformations: {
            unique_id: "",
            code_poste: "J02924",
            date_versement: new Date("2017-04-27T00:00:00.000Z"),
            montant_a_payer: 1791,
            montant_paye: 1791,
            periode_debut: new Date("2017-04-01T00:00:00.000Z"),
            periode_fin: new Date("2017-06-30T00:00:00.000Z"),
            updated_at: new Date("2022-03-03T00:00:00.000Z"),
            bop: 163,
            joinKey: "2017-J02924",
        },
        legalInformations: {
            siret: "00000000000000",
        },
    },
    {
        data: {
            DateVersement: 42927,
            MontantAPayer: 1791,
            MontantPaye: 1791,
            PeriodeDebut: 42917,
            PeriodeFin: 43008,
            PosteCode: "J02924",
            id: "J02924-2024-12-31T00:00:00.000Z-1970-01-01T00:00:42.917Z",
            siret: "00000000000000",
            updated_at: "2022-03-03T00:00:00.000Z",
        },
        indexedInformations: {
            unique_id: "",
            code_poste: "J02924",
            date_versement: new Date("2017-07-11T00:00:00.000Z"),
            montant_a_payer: 1791,
            montant_paye: 1791,
            periode_debut: new Date("2017-07-01T00:00:00.000Z"),
            periode_fin: new Date("2017-09-30T00:00:00.000Z"),
            updated_at: new Date("2022-03-03T00:00:00.000Z"),
            bop: 163,
            joinKey: "2017-J02924",
        },
        legalInformations: {
            siret: "00000000000000",
        },
    },
    {
        data: {
            DateVersement: 43027,
            MontantAPayer: 1791,
            MontantPaye: 1791,
            PeriodeDebut: 43009,
            PeriodeFin: 43100,
            PosteCode: "J02924",
            id: "J02924-2024-12-31T00:00:00.000Z-1970-01-01T00:00:43.009Z",
            siret: "00000000000000",
            updated_at: "2022-03-03T00:00:00.000Z",
        },
        indexedInformations: {
            unique_id: "",
            code_poste: "J02924",
            date_versement: new Date("2017-10-19T00:00:00.000Z"),
            montant_a_payer: 1791,
            montant_paye: 1791,
            periode_debut: new Date("2017-10-01T00:00:00.000Z"),
            periode_fin: new Date("2017-12-31T00:00:00.000Z"),
            updated_at: new Date("2022-03-03T00:00:00.000Z"),
            bop: 163,
            joinKey: "2017-J02924",
        },
        legalInformations: {
            siret: "00000000000000",
        },
    },
];

const toPV = value => ({
    value,
    provider: "fonjep",
    type: typeof value,
    last_update: new Date("2022-06-06"),
});

const buildNewPayment = (entity: FonjepPaymentEntity): FonjepPayment => ({
    siret: toPV(entity.legalInformations.siret),
    codePoste: toPV(entity.indexedInformations.code_poste),
    versementKey: toPV(entity.indexedInformations.code_poste),
    amount: toPV(entity.indexedInformations.montant_paye),
    dateOperation: toPV(entity.indexedInformations.date_versement),
    periodeDebut: toPV(entity.indexedInformations.periode_debut),
    periodeFin: toPV(entity.indexedInformations.periode_fin),
    montantAPayer: toPV(entity.indexedInformations.montant_a_payer),
    bop: toPV(entity.indexedInformations.bop),
    programme: toPV(163),
    libelleProgramme: toPV("program label"),
});

export const FONJEP_PAYMENTS: FonjepPayment[] = [buildNewPayment(FONJEP_PAYMENT_ENTITIES[0])];
