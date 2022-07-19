import { Siren } from "../shared/Siren"

export default interface ExtraitRcs {
    "siren": Siren,
    "date_immatriculation": string,
    "date_immatriculation_timestamp": number,
    "date_extrait": string,
    "observations": ExtraitRcsObservation[]
}

interface ExtraitRcsObservation {
    "date": string,
    "date_timestamp": number,
    "numero": string,
    "libelle": string
}