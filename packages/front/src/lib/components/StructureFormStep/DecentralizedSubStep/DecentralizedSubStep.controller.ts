import type { AdminStructureDto } from "dto";
import { AdminTerritorialLevel, AgentTypeEnum } from "dto";
import type { EventDispatcher } from "svelte";
import Store from "$lib/core/Store";
import geoService from "$lib/resources/externals/geo/geo.service";
import subscriptionFormService from "$lib/resources/auth/subscriptionForm/subscriptionFormService";
import Dispatch from "$lib/core/Dispatch";

type Option = { value: string; label: string };

export default class DecentralizedSubStepController {
    private allStructures: AdminStructureDto[];
    public structureOptions: Store<Option[]>;
    public departmentOptions: Store<Option[]>;
    public regionOptions: Store<Option[]>;
    public levelOptions: Option[] = [
        { value: AdminTerritorialLevel.DEPARTMENTAL, label: "Départemental" },
        { value: AdminTerritorialLevel.INTERDEPARTMENTAL, label: "Interdépartemental" },
        { value: AdminTerritorialLevel.REGIONAL, label: "Régional" },
        { value: AdminTerritorialLevel.INTERREGIONAL, label: "Interrégional" },
        { value: AdminTerritorialLevel.OVERSEAS, label: "Collectivité d'outre-mer à statut particulier" },
    ];
    private dispatch: EventDispatcher<any>;

    constructor() {
        this.departmentOptions = new Store([]);
        this.regionOptions = new Store([]);
        this.structureOptions = new Store([]);
        this.allStructures = [];
        this.dispatch = Dispatch.getDispatcher();
    }

    async init(data): Promise<void> {
        this.allStructures = await subscriptionFormService.getStructures(AgentTypeEnum.DECONCENTRATED_ADMIN);
        if (data.decentralizedLevel) this.settingOptions(data.decentralizedLevel);
    }

    public settingOptions(level: AdminTerritorialLevel) {
        if (level === AdminTerritorialLevel.DEPARTMENTAL) {
            this.onChoosingDepartment();
            this.filterStructureOptions(AdminTerritorialLevel.DEPARTMENTAL);
        }
        if (level === AdminTerritorialLevel.REGIONAL) {
            this.onChoosingRegion();
            this.filterStructureOptions(AdminTerritorialLevel.REGIONAL);
        }
    }

    public onChoosingLevel(option: { label: string; value: AdminTerritorialLevel }) {
        this.dispatch("change");
        const level: AdminTerritorialLevel = option.value;
        this.settingOptions(level);
    }

    private filterStructureOptions(LEVEL: AdminTerritorialLevel) {
        this.structureOptions.set(
            this.allStructures
                .filter(structure => structure.territorialLevel === LEVEL)
                .map(structure => ({
                    label: structure.structure,
                    value: structure.structure,
                })),
        );
    }

    private async fillOptionsOnce(
        optionStore: Store<Option[]>,
        serviceMethod: () => Promise<{ code: string; nom: string }[]>,
        transform: (reg: { code: string; nom: string }) => string,
    ) {
        if (optionStore.value.length) return;
        const territories = await serviceMethod();
        optionStore.set(
            territories.map(territory => ({
                label: transform(territory),
                value: transform(territory),
            })),
        );
    }

    private onChoosingDepartment() {
        return this.fillOptionsOnce(
            this.departmentOptions,
            geoService.getDepartements,
            (dep: { code: string; nom: string }) => `${dep.code} - ${dep.nom}`,
        );
    }

    private onChoosingRegion() {
        return this.fillOptionsOnce(this.regionOptions, geoService.getRegions, (reg: { nom: string }) => reg.nom);
    }
}
