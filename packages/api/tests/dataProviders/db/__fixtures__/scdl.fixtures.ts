import { ObjectId, WithId } from "mongodb";
import { ScdlGrantDbo } from "../../../../src/modules/providers/scdl/dbo/ScdlGrantDbo";
import MiscScdlProducerEntity from "../../../../src/modules/providers/scdl/entities/MiscScdlProducerEntity";
import DEFAULT_ASSOCIATION from "../../../__fixtures__/association.fixture";
import ALLOCATORS from "../../../__fixtures__/allocators.fixture";
import { getMD5 } from "../../../../src/shared/helpers/StringHelper";

export const LOCAL_AUTHORITIES: WithId<MiscScdlProducerEntity>[] = [
    {
        _id: new ObjectId("690c946272df1a64ab637cd6"),
        name: ALLOCATORS[0].name,
        siret: ALLOCATORS[0].siret,
    },
    {
        _id: new ObjectId("690c945ecb7e7decfa0fb21f"),
        name: ALLOCATORS[1].name,
        siret: ALLOCATORS[1].siret,
    },
    {
        _id: new ObjectId("690c94598e2e9d5154fa349d"),
        name: ALLOCATORS[2].name,
        siret: ALLOCATORS[2].siret,
    },
];

const SCDL_RAW_DATAS = [
    {
        nomattribuant: LOCAL_AUTHORITIES[0].name,
        idattribuant: LOCAL_AUTHORITIES[0].siret,
        annee: 2019,
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
        _id: getMD5(`${LOCAL_AUTHORITIES[0].siret}-
            ${JSON.stringify(SCDL_RAW_DATAS[0])}`),
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
        updateDate: new Date("2025-01-16"),
    },
];
