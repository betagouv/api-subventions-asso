import ProviderValue from "../../@types/ProviderValue";
import { Siret } from "../../@types/Siret";
import { DefaultObject } from "../../@types/utils";
import OsirisRequestAdapter from "../osiris/adapters/OsirisRequestAdatper";
import providers from "../providers";
import EtablissementDtoAdapter from "../providers/DataEntreprise/adapters/EtablisementDtoAdapter";
import Etablissement from "./interfaces/Etablissement";
import EtablissementProvider from "./interfaces/EtablissementProvider";

export class EtablissementsService {
    
    private provider_score: DefaultObject<number> = {
        [EtablissementDtoAdapter.PROVIDER_NAME]: 1,
        [OsirisRequestAdapter.PROVIDER_NAME]: 0.5
    }


    private providers: EtablissementProvider[] = Object.values(providers).filter((p) => (p as EtablissementProvider).isEtablissementProvider) as EtablissementProvider[]


    async getEtablissement(siret: Siret) {
        const data = await (await this.aggregate(siret)).flat().filter(d => d) as Etablissement[];

        const merge = (a: Etablissement, b: Etablissement): Etablissement => {
            const etablissement: Etablissement = {
                siret: a.siret || b.siret,
                siege: a.siege || b.siege,
                nic: a.nic || b.nic,
            }
            
            etablissement.siret = this.compareProviderValue(a.siret, b.siret);
            etablissement.siege = this.compareProviderValue(a.siege, b.siege);
            etablissement.nic = this.compareProviderValue(a.nic, b.nic);

            if (a.adresse) {
                if (b.adresse) {
                    etablissement.adresse = {
                        voie: this.compareProviderValue(a.adresse.voie, b.adresse.voie),
                        code_postal: this.compareProviderValue(a.adresse.code_postal, b.adresse.code_postal),
                        commune: this.compareProviderValue(a.adresse.commune, b.adresse.commune),
                        numero: this.compareProviderValue(a.adresse.numero, b.adresse.numero),
                        type_voie: this.compareProviderValue(a.adresse.type_voie, b.adresse.type_voie),
                    }
                }
                else {
                    etablissement.adresse = a.adresse;
                }
            } else if (b.adresse) {
                etablissement.adresse = b.adresse;
            }

            if (a.representants_legaux && b.representants_legaux) {
                const r = [...b.representants_legaux, ...a.representants_legaux].reduce((acc, r) => {
                    const nom = (r.nom?.value || "").toLowerCase();
                    const prenom = (r.prenom?.value || "").toLowerCase();
                    acc[nom + " " + prenom] = r;
                    return acc;
                }, {} as DefaultObject)
                etablissement.representants_legaux = [...Object.values(r)] as unknown as undefined // It's hack
            } else if (a.representants_legaux) {
                etablissement.representants_legaux = a.representants_legaux;
            } else if (b.representants_legaux) {
                etablissement.representants_legaux = b.representants_legaux;
            }

            if (a.information_banquaire && b.information_banquaire) {
                const r = [...b.information_banquaire, ... a.information_banquaire].reduce((acc, r) => {
                    const bic = (r.value.bic || "").toLowerCase();
                    const iban = (r.value.iban || "").toLowerCase();
                    acc[iban+bic] = r
                    return acc;
                }, {} as DefaultObject)
                etablissement.information_banquaire = [...Object.values(r)] as unknown as undefined // It's hack
            } else if (a.information_banquaire) {
                etablissement.information_banquaire = a.information_banquaire;
            } else if (b.information_banquaire) {
                etablissement.information_banquaire = b.information_banquaire;
            }

            return etablissement;
        }
        
        return data.reduce((acc, etablissement) => merge(acc, etablissement));
    }

    private async aggregate(siret: Siret): Promise<(Etablissement[] | null)[]> {
        return Promise.all(
            this.providers.map(p => p.getEtablissementsBySiret(siret))
        );
    }

    private compareProviderValue<T>(valueA: ProviderValue<T> | undefined, valueB: ProviderValue<T> | undefined): ProviderValue<T>  {
        if (!valueA || valueA.value === undefined || valueA.value === null) return valueB as ProviderValue<T>;
        if (!valueB || valueB.value === undefined || valueB.value === null) return valueA;

        if (this.provider_score[valueA.provider] > this.provider_score[valueB.provider]) return valueA;
        return valueB
    }
}

const etablissementService = new EtablissementsService();

export default etablissementService;