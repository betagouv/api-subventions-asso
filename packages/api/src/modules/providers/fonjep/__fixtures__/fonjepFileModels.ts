export const DATA_WITH_HEADER = [
    [
        {
            Code: 1234,
            RaisonSociale: "CENTRE D'INFO ****",
            EstAssociation: 'Oui',
            EstCoFinanceurPostes: 'Non',
            EstFinanceurPostes: 'Non',
            SiretOuRidet: '00000000000000',
            CodePostal: '00000',
            Ville: 'Paris',
            ContactEmail: 'exemple@beta.gouv.fr'
        }
    ],
    [
        {
            Code: 'J10540',
            DispositifId: 3,
            PstStatutPosteLibelle: 'Attribué',
            PstRaisonStatutLibelle: 'Reconduction',
            FinanceurPrincipalCode: '1234',
            FinanceurAttributeurCode: 1234,
            AssociationBeneficiaireCode: 1234,
            AssociationImplantationCode: 1234,
            Annee: 2017,
            MontantSubvention: 6666,
            DateFinTriennalite: 43465,
            PstTypePosteCode: 'FONJEP',
            PleinTemps: 'Oui',
            DoublementUniteCompte: 'Non'
        }
    ],
    // TODO: add versements
    [],
    [
        { Code: 'DOUBLE', Libelle: 'UNITE DE COMPTE DOUBLEE' },
        { Code: 'FONJEP', Libelle: 'Poste FONJEP' },
        { Code: 'PSTEMP', Libelle: 'POSTES EMPOI FONJEP (100 %)' },
        { Code: 'FONBIS', Libelle: 'PROLONGATION PAS DE FRAIS' }
    ],
    [
        { ID: 1, Libelle: "FONJEP Jeunesse éducation populaire", FinanceurCode: 10004 },
        { ID: 2, Libelle: "FONJEP Cohésion sociale", FinanceurCode: 10005 },
        { ID: 3, Libelle: "FONJEP Politique de la ville", FinanceurCode: 10008 },
        { ID: 4, Libelle: "FONJEP Guid'Asso", FinanceurCode: 10009 },
        { ID: 5, Libelle: "FONJEP Éducation à la citoyenneté et à la solidarité internationale (ECSI)", FinanceurCode: 10010 },
        { ID: 6, Libelle: "FONJEP Culture", FinanceurCode: 10012 },
        { ID: 7, Libelle: "FONJEP Centre de ressour ces et d'information des bénévoles", FinanceurCode: 10016 },
        { ID: 8, Libelle: "FONJEP Jeunes", FinanceurCode: 10017 }
    ]
]


export const RAW_DATA = [
    [
        [
            'Code',
            'RaisonSociale',
            'EstAssociation',
            'EstCoFinanceurPostes',
            'EstFinanceurPostes',
            'SiretOuRidet',
            'CodePostal',
            'Ville',
            'ContactEmail'
        ],
        [
            1234,
            "CENTRE D'INFO ****",
            'Oui',
            'Non',
            'Non',
            '00000000000000',
            '00000',
            'Paris',
            'exemple@beta.gouv.fr'
        ]
    ],
    [
        [
            'Code',
            'DispositifId',
            'PstStatutPosteLibelle',
            'PstRaisonStatutLibelle',
            'FinanceurPrincipalCode',
            'FinanceurAttributeurCode',
            'AssociationBeneficiaireCode',
            'AssociationImplantationCode',
            'Annee',
            'MontantSubvention',
            'DateFinTriennalite',
            'PstTypePosteCode',
            'PleinTemps',
            'DoublementUniteCompte'
        ],
        [
            'J10540', 3, 'Attribué',
            'Reconduction', '1234',
            1234, 1234,
            1234, 2017,
            6666, 43465,
            'FONJEP', 'Oui',
            'Non'
        ]
    ],
    // TODO: add versements
    [],
    [
        ['Code', 'Libelle'],
        ['DOUBLE', 'UNITE DE COMPTE DOUBLEE'],
        ['FONJEP', 'Poste FONJEP'],
        ['PSTEMP', 'POSTES EMPOI FONJEP (100 %)'],
        ['FONBIS', 'PROLONGATION PAS DE FRAIS']
    ],
    [
        ['ID', 'Libelle', 'FinanceurCode'],
        [1, 'FONJEP Jeunesse éducation populaire', 10004],
        [2, 'FONJEP Cohésion sociale', 10005],
        [3, 'FONJEP Politique de la ville', 10008],
        [4, "FONJEP Guid'Asso", 10009],
        [5, 'FONJEP Éducation à la citoyenneté et à la solidarité internationale (ECSI)', 100010],
        [6, 'FONJEP Culture', 100012],
        [7, "FONJEP Centre de ressources et d'information des bénévoles", 100016],
        [8, 'FONJEP Jeunes', 100017],
    ]
]
