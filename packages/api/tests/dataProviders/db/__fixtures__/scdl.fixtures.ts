import { ScdlGrantDbo } from "../../../../src/modules/providers/scdl/dbo/ScdlGrantDbo";
import MiscScdlProducerEntity from "../../../../src/modules/providers/scdl/entities/MiscScdlProducerEntity";
import DEFAULT_ASSOCIATION from "../../../__fixtures__/association.fixture";
import GRANTORS from "../../../__fixtures__/grantor.fixture";

export const LOCAL_AUTHORITIES: MiscScdlProducerEntity[] = [
    {
        slug: "producer-1",
        name: GRANTORS[0].name,
        siret: GRANTORS[0].siret,
        lastUpdate: new Date("2024-01-12"),
    },
    {
        slug: "producer-2",
        name: GRANTORS[1].name,
        siret: GRANTORS[1].siret,
        lastUpdate: new Date("2024-01-12"),
    },
];

const SCDL_RAW_DATAS = [
    {
        nomattribuant: LOCAL_AUTHORITIES[0].name,
        idattribuant: LOCAL_AUTHORITIES[0].siret,
        annee: 2020,
        numero_complet_engagement: "2020-000375-0000",
        code_tranche: "12103O001T14",
        referencedecision: "SP 21/01/2019",
        dateconvention: "2019-01-21 00:00:00",
        objet: "2019-15081 - INSTITUT DE SOUDURE INDUSTRIE",
        nombeneficiaire: "INSTITUT DE SOUDURE",
        idbeneficiaire: DEFAULT_ASSOCIATION.siret,
        montant: 60854.0,
        nature: "aide en numéraire",
        conditionsversement: "unique",
        datesperiodeversement: "2019-01-21 00:00:00",
        idrae: "NULL",
        notificationue: "NULL",
        pourcentagesubvention: 1,
    },
];

export const SCDL_GRANT_DBOS: ScdlGrantDbo[] = [
    {
        _id: `${LOCAL_AUTHORITIES[0].slug}-
            ${JSON.stringify(SCDL_RAW_DATAS[0])}`,
        producerSlug: LOCAL_AUTHORITIES[0].slug,
        allocatorName: LOCAL_AUTHORITIES[0].name,
        allocatorSiret: LOCAL_AUTHORITIES[0].siret,
        exercice: 2019,
        conventionDate: new Date("2019-01-20T23:00:00.000+00:00"),
        decisionReference: "SP 21/01/2019",
        associationName: "INSTITUT DE SOUDURE",
        associationSiret: DEFAULT_ASSOCIATION.siret,
        associationRna: undefined,
        object: "2019-15081 - INSTITUT DE SOUDURE",
        amount: 60854,
        paymentNature: "aide en numéraire",
        paymentConditions: "unique",
        paymentStartDate: new Date("2019-01-20T23:00:00.000Z"),
        paymentEndDate: undefined,
        idRAE: "NULL",
        UeNotification: undefined,
        grantPercentage: 1,
        aidSystem: undefined,
        __data__: SCDL_RAW_DATAS[0],
    },
];
