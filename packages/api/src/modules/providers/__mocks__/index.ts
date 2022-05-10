import { ProviderEnum } from '../../../@enums/ProviderEnum';

export default {
    // Normal RAW service
    serviceA: {
        provider: {name: "serviceA", type: ProviderEnum.raw, description: "descriptionA"},
        isAssociationsProvider: true,
        getAssociationsBySiren: () => [{}],
        getAssociationsBySiret: () => [{}],
        getAssociationsByRna: () => [{}]
    },
    // Normal API service
    serviceB: {
        provider: {name: "serviceB", type: ProviderEnum.api, description: "descriptionB"},
        isAssociationsProvider: true,
        getAssociationsBySiren: () => [{}],
        getAssociationsBySiret: () => [{}],
        getAssociationsByRna: () => [{}]
    },
    // API service that returns null for all getAssociations()
    serviceC: {
        provider: {name: "serviceC", type: ProviderEnum.api, description: "descriptionC"},
        isAssociationsProvider: true,
        getAssociationsBySiren: () => null,
        getAssociationsBySiret: () => null,
        getAssociationsByRna: () => null
    },
    // API service that is not an AssociationProvider
    serviceD: {
        provider: {name: "serviceD", type: ProviderEnum.api, description: "descriptionD"},
        isAssociationsProvider: false,
        getAssociationsBySiren: () => [{}],
        getAssociationsBySiret: () => [{}],
        getAssociationsByRna: () => [{}]
    },
    // RAW sercice that is not an AssociationProvider
    serviceE: { 
        provider: {name: "serviceE", type: ProviderEnum.raw, description: "descriptionE"},
        isAssociationsProvider: false,
        getAssociationsBySiren: () => [{}],
        getAssociationsBySiret: () => [{}],
        getAssociationsByRna: () => [{}]
    }
}