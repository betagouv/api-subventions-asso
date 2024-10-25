import { SirenDto, SiretDto } from "dto";

export function siretToSiren(siret: SiretDto): SirenDto {
    return siret.slice(0, 9);
}

export function siretToNIC(siret: SiretDto) {
    return siret.slice(9, 14);
}
