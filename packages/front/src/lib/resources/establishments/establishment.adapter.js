import { flattenProviderValue } from "$lib/helpers/providerValueHelper";

export const toEstablishmentComponent = establishment => {
    // TODO(#2078): create a EstablishmentEntity and handle information_banquaire providers information differently
    const { information_banquaire, ...establishmentWithoutInfoBancaire } = establishment;
    return { information_banquaire, ...flattenProviderValue(establishmentWithoutInfoBancaire) };
};
