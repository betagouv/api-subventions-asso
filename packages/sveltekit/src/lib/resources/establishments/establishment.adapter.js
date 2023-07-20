import { flattenProviderValue } from "$lib/helpers/providerValueHelper";

export const toEstablishmentComponent = establishment => {
    const { information_banquaire, ...establishmentWithoutInfoBancaire } = establishment;
    return { information_banquaire, ...flattenProviderValue(establishmentWithoutInfoBancaire) };
};
