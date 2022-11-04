import { ProviderEnum } from '../../../@enums/ProviderEnum';

export default {
    // RAW service AssociationProvider + DemandeSubventionProvider
    serviceA: {
        provider: { name: "serviceA", type: ProviderEnum.raw, description: "descriptionA" },
        isAssociationsProvider: true,
        isDemandesSubventionsProvider: true,
        getAssociationsBySiren: () => [{}],
        getAssociationsBySiret: () => [{}],
        getAssociationsByRna: () => [{}],
        getDemandeSubventionBySiret: async () => ([{}]),
        getDemandeSubventionBySiren: async () => ([{}]),
        getDemandeSubventionByRna: async () => ([{}]),
    },
    // API service AssociationProvider + DemandeSubventionProvider
    serviceB: {
        provider: { name: "serviceB", type: ProviderEnum.api, description: "descriptionB" },
        isAssociationsProvider: true,
        isDemandesSubventionsProvider: true,
        getAssociationsBySiren: () => [{}],
        getAssociationsBySiret: () => [{}],
        getAssociationsByRna: () => [{}],
        getDemandeSubventionBySiret: async () => ([{}]),
        getDemandeSubventionBySiren: async () => ([{}]),
        getDemandeSubventionByRna: async () => ([{}]),
    },
    // API service AssociationProvider that returns null for all getAssociations()
    serviceC: {
        provider: { name: "serviceC", type: ProviderEnum.api, description: "descriptionC" },
        isAssociationsProvider: true,
        isDemandesSubventionsProvider: false,
        getAssociationsBySiren: async () => null,
        getAssociationsBySiret: async () => null,
        getAssociationsByRna: async () => null
    },
    // API service that is not either an AssociationProvider or DemandesSubventionsProvider
    serviceD: {
        provider: { name: "serviceD", type: ProviderEnum.api, description: "descriptionD" },
        isAssociationsProvider: false,
        isDemandesSubventionsProvider: false,
        getAssociationsBySiren: async () => [{}],
        getAssociationsBySiret: async () => [{}],
        getAssociationsByRna: async () => [{}]
    },
    // RAW sercice that is not either an AssociationProvider or DemandesSubventionsProvider 
    serviceE: {
        provider: { name: "serviceE", type: ProviderEnum.raw, description: "descriptionE" },
        isAssociationsProvider: false,
        isDemandesSubventionsProvider: false,
        getAssociationsBySiren: async () => [{}],
        getAssociationsBySiret: async () => [{}],
        getAssociationsByRna: async () => [{}]
    }
}
