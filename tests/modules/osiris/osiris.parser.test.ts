import fs from "fs";
import path from "path";

import OsirisParser from "../../../src/modules/osiris/osiris.parser";
import OsirisFileEntity from "../../../src/modules/osiris/entities/OsirisFileEntity";
import OsirisActionEntity from "../../../src/modules/osiris/entities/OsirisActionEntity";

describe("OsirisParser", () => {
    describe('parseFiles', () => {
        it('should return osiris files', () => {
            const buffer = fs.readFileSync(path.resolve(__dirname, "./__fixtures__/SuiviDossiers_test.xls"));
            const files = OsirisParser.parseFiles(buffer);

            expect(files).toHaveLength(1);
            expect(files[0]).toBeInstanceOf(OsirisFileEntity);
        });
    });

    describe('parseActions', () => {
        it('should return osiris actions', () => {
            const buffer = fs.readFileSync(path.resolve(__dirname, "./__fixtures__/SuiviActions_test.xls"));
            const actions = OsirisParser.parseActions(buffer);

            expect(actions).toHaveLength(1);
            expect(actions[0]).toBeInstanceOf(OsirisActionEntity);
        });

        it('should have good properties', () => {
            const buffer = fs.readFileSync(path.resolve(__dirname, "./__fixtures__/SuiviActions_test.xls"));
            const actions = OsirisParser.parseActions(buffer);
            expect(actions[0]).toMatchObject({
                file: {
                    osirisId: 'DD44-21-0310-1',
                    service: 'DD44',
                    financingType: 'ANS - Projets Sportifs Territoriaux',
                    subFinancingType: 'Fonds territorial de solidarité',
                    state: 'A évaluer',
                    lcaId: '21-190698',
                    pluriannuality: 'Non',
                    fiscalYearStart: 2021,
                    fiscalYearEnd: 2021,
                    renewal: 'Renouvellement',
                    commissionDate: '06/10/2021',
                    employeeName: "Tom Jedusor",
                    ejId: '21/0025579'
                },
                beneficiaryAssociation: {
                    rna: 'W442006560',
                    siret: '44800926600025',
                    chorus: "AABB00BBAA",
                    sirepa: '1801305',
                    name: 'NANTES PLEINS CONTACTS',
                    acronym: 'Oui',
                    active: 'Oui',
                    headquarters: 'Oui',
                    structureType: 'Association',
                    structureSportsType: 'Club',
                    postalCode: '44300',
                    inseeCode: '44109',
                    territorialActionZone: 'Régional'
                },
                specifications: {
                    rank: 1,
                    title: "MAINTIEN DE L'ACTIVITE BOXE",
                    objectives: "Relance de l'activité boxe dans les QPV tels que Bottière & Malakoff",
                    description: "La crise sanitaire à impacté l'association, nous avons du réinventer et adapter nos séances.\n" +
                    `Cette année nous accompagnons les familles pour l'obtention d'aides mise en place par l'état tel que la" carte blanche - le pass sport" afin de permettre la prise en charge  de la cotisation\n` +
                    '\n' +
                    'Nous avons malgré tout inscrit 6 de nos bénévoles à des formations diplômantes : DELLAPINA Stéphane & DAUPHIN Eric (BPJEPS mention boxe) LATCHIMY Bryan & DAUPHIN Raphael (CQP) NERELUS Clémence & MARIE Alban (Prévot Fédéral 1)\n' +
                    'Nous avons pu être présent lors de différentes actions menées par la ville de Nantes ainsi que différents partenaires institutionnelles',
                    mainFieldAction: "FAKE",
                    educationLevel: "FAKE",
                    type: 'Fonds de solidarité',
                    assistanceModality: 'Aide à la relance de la pratique sportive',
                    operationalObjectives: 'Développement de la pratique',
                    modalitySystem: "Diversification de l'offre de pratique",
                    personInCharge: "Tom"
                },
                affiliatingFederation: {
                    federation: 'Fédération française Boxe',
                    licensees: 115,
                    licenseesMen: 68,
                    licenseesWomen: 47
                },
                beneficiaries: {
                    state: 'Licenciés-Adhérents',
                    ageRange: "Toutes tranches d'âge",
                    gender: 'Mixte',
                    number: 115,
                    type: 'Public mixte'
                },
                territories: {
                    state: 'Quartier politique de la ville',
                    comment: 'Ville de Nantes secteur Est : Nantes Erdre - Doulon - Bottière & Saint Joseph de Porterie.\n' +
                    'Ville de Nantes secteur Sud : Centre ville - Malakof & Ripossière.'
                },
                resources: {
                    resources: "Rencontre sur l'espace public, fêtes de quartiers, animation sportive (mise en\n" +
                    'place par la ville de Nantes), participation à différentes animations  sur tout le territoire Nantais.',
                    volunteers: 10,
                    volunteersETPT: 0,
                    employees: 0,
                    employeesETPT: 0,
                    cdi: 0,
                    cdiETPT: 0,
                    cdd: 0,
                    cddETPT: 0,
                    assistedJobs: 0,
                    assistedJobsETPT: 0,
                    volunteers2: 8,
                    volunteers2ETPT: 0,
                    specificRecruitment: 0
                },
                resourcesEvaluation: {
                    indicators: "Malgré la crise sanitaire nous avons réussi a maintenir nos licenciés adultes mixte, notre capacité d'adaptation a cette situation nous a amené depuis mars 2020 à optimiser l'espace public Nantais ce qui nous permets de nous maintenir  et s'ouvrir a de nouvelles pratiques."
                },
                amount: {
                    coast: 9527,
                    requested: 3000,
                    suggested: 3000,
                    granted: 3000,
                    totalAmountAllocated: 3000,
                    paymentMade: 0,
                    reversal: 0,
                    grantedPercentage: 100,
                    paymentMadePercentage: 0
                },
                coFinanciers: {
                    names: 'Direction départementale de la Loire-Atlantique;',
                    amountsRequested: 3000
                },
                other: { comments: "RAS" },
                evaluation: { evaluation: "RAS", comments: "RAS" },
                custom: { column1: "custom1", column2: "custom2", column3: "custom3" },
                _id: undefined
            });
        });
    });
});