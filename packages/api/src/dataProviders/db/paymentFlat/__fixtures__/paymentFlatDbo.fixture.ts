import { ObjectId } from "mongodb";
import paymentFlatDbo from "../PaymentFlatDbo";

export const PAYMENT_FLAT_DBO: paymentFlatDbo = {
    _id: new ObjectId(),
    uniqueId: "12345678901234",
    siret: "12345678901234",
    siren: "123456789",
    montant: 1000,
    dateOperation: new Date("2023-04-01"),
    programme: "Programme Exemple",
    numeroProgramme: 1,
    mission: "Mission Exemple",
    ministere: "Ministère Exemple",
    sigleMinistere: "ME",
    ej: "EJ Exemple",
    provider: "Fournisseur Exemple",
    codeAction: "AC123",
    action: "Label d'action Exemple",
    codeActivite: "AC456",
    activite: "Label d'activité Exemple",
};

export const PAYMENT_FLAT_DBO_WITH_NULLS: paymentFlatDbo = {
    _id: new ObjectId(),
    uniqueId: "12345678901234",
    siret: "12345678901234",
    siren: "123456789",
    montant: 1000,
    dateOperation: new Date("2023-04-01"),
    programme: null,
    numeroProgramme: 1,
    mission: "Mission Exemple",
    ministere: "Ministère Exemple",
    sigleMinistere: null,
    ej: "EJ Exemple",
    provider: "Fournisseur Exemple",
    codeAction: "AC123",
    action: "Label d'action Exemple",
    codeActivite: "AC456",
    activite: "Label d'activité Exemple",
};
