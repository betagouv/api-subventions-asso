import { ChorusPayment } from "dto";
import { CHORUS_ENTITIES } from "../../../../domain/providers/chorus/chorus.fixture";

const buildProviderValue = value => ({
    value,
    provider: "chorus",
    type: typeof value,
    last_update: new Date("2022-06-06"),
});

// TODO: fill this with real data
export const PAYMENTS: ChorusPayment[] = [
    {
        exerciceBudgetaire: buildProviderValue(CHORUS_ENTITIES[0].exercice),
        ej: buildProviderValue(CHORUS_ENTITIES[0].ej),
        versementKey: buildProviderValue(CHORUS_ENTITIES[0].ej),
        siret: buildProviderValue(CHORUS_ENTITIES[0].identifier.value),
        amount: buildProviderValue(CHORUS_ENTITIES[0].montant),
        dateOperation: buildProviderValue(CHORUS_ENTITIES[0].dateOperation),
        centreFinancier: buildProviderValue(CHORUS_ENTITIES[0].centreFinancier),
        domaineFonctionnel: buildProviderValue(CHORUS_ENTITIES[0].domaineFonctionnel),
        bop: buildProviderValue(CHORUS_ENTITIES[0].codeDomaineFonctionnel.slice(0, 4)),
        programme: buildProviderValue(`PROGRAM LABEL ${CHORUS_ENTITIES[0].codeDomaineFonctionnel.slice(0, 4)}`),
        libelleProgramme: buildProviderValue(CHORUS_ENTITIES[0].codeDomaineFonctionnel.slice(0, 4)),
    },
];
