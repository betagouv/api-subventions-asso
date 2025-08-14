import { ObjectId } from "mongodb";
import DEFAULT_ASSOCIATION from "../../../../../tests/__fixtures__/association.fixture";
import OsirisRequestEntity from "../entities/OsirisRequestEntity";
import IOsirisRequestInformations from "../@types/IOsirisRequestInformations";

export const OSIRIS_ID = "DR-CENT-21-0002";

export const REQUEST_ENTITY = new OsirisRequestEntity(
    { siret: DEFAULT_ASSOCIATION.siret, rna: DEFAULT_ASSOCIATION.rna, name: DEFAULT_ASSOCIATION.name },
    {
        osirisId: OSIRIS_ID,
        ej: "123456789",
        amountAwarded: 1542,
        dateCommission: new Date("2023-01-25"),
        exercise: 2023,
        compteAssoId: "21-008391",
        exerciceDebut: new Date(2021),
        etablissementSiege: true,
        etablissementVoie: "40 RUE DU GéNéRAL LECLERC",
        etablissementCodePostal: "41300",
        etablissementCommune: "SALBRIS",
        etablissementIBAN: "FR7600000000000000000000000",
        etablissementBIC: "BANK11111111",
        representantNom: "Doe",
        representantPrenom: "John",
        representantRole: "Président",
        representantCivilite: "Monsieur",
        representantEmail: "johndoe@hotmail.fr",
        representantPhone: "0601020304",
        service_instructeur: "DR-CENT",
        dispositif: "FDVA",
        sous_dispositif: "Financement global-nouveau(x) projet(s) innovant(s)",
        status: "Refusé",
        pluriannualite: "Annuel",
        montantsTotal: 25500,
        montantsDemande: 7500,
        montantsPropose: 7200,
        montantsAccorde: 7200,
        versementAcompte: 0,
        versementSolde: 0,
        versementRealise: 0,
        versementCompensationN1: 0,
        versementCompensationN: 0,
    } as IOsirisRequestInformations,
    { Dossier: { "Date Reception": 43549.44370065972, "Exercice Début": 2021, "Exercice Fin": 2024 } },
    new Date("2025-08-05"),
    [],
);

export const REQUEST_DBO = { ...REQUEST_ENTITY, _id: new ObjectId("685be74b0d6ac15b4e3ef6e7") };
