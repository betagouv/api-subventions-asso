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
    [],
    [
        { Code: 'DOUBLE', Libelle: 'UNITE DE COMPTE DOUBLEE' },
        { Code: 'FONJEP', Libelle: 'Poste FONJEP' },
        { Code: 'PSTEMP', Libelle: 'POSTES EMPOI FONJEP (100 %)' },
        { Code: 'FONBIS', Libelle: 'PROLONGATION PAS DE FRAIS' }
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
            'J10540',       'Attribué',
            'Reconduction', '1234',
            1234,           1234,
            1234,           2017,
            6666,           43465,
            'FONJEP',       'Oui',
            'Non'
        ]
    ],
    [ [ 'TiersCode', 'PosteCode', 'MontantFinance' ] ],
    [
        [ 'Code', 'Libelle' ],
        [ 'DOUBLE', 'UNITE DE COMPTE DOUBLEE' ],
        [ 'FONJEP', 'Poste FONJEP' ],
        [ 'PSTEMP', 'POSTES EMPOI FONJEP (100 %)' ],
        [ 'FONBIS', 'PROLONGATION PAS DE FRAIS' ]
    ]
]
