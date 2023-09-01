import { AdminTerritorialLevel, AgentTypeEnum } from "dto";
import type { AdminStructureDto } from "dto";
import Store from "$lib/core/Store";
import geoService from "$lib/resources/externals/geo/geo.service";
import subscriptionFormService from "$lib/resources/auth/subscriptionForm/subscriptionFormService";

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

    constructor() {
        this.departmentOptions = new Store([]);
        this.regionOptions = new Store([]);
        this.structureOptions = new Store([]);
        this.allStructures = [];
    }

    async init(agentType: AgentTypeEnum): Promise<void> {
        this.allStructures = await subscriptionFormService.getStructures(agentType);
    }

    public onChoosingLevel(option: { label: string; value: AdminTerritorialLevel }) {
        const level: AdminTerritorialLevel = option.value;
        if (level === AdminTerritorialLevel.DEPARTMENTAL) {
            this.onChoosingDepartment();
            this.filterStructureOptions(AdminTerritorialLevel.DEPARTMENTAL);
        }
        if (level === AdminTerritorialLevel.REGIONAL) {
            this.onChoosingRegion();
            this.filterStructureOptions(AdminTerritorialLevel.REGIONAL);
        }
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

    private async onChoosingDepartment() {
        return this.fillOptionsOnce(
            this.departmentOptions,
            geoService.getDepartements,
            (dep: { code: string; nom: string }) => `${dep.code} - ${dep.nom}`,
        );
    }

    private async onChoosingRegion() {
        return this.fillOptionsOnce(this.regionOptions, geoService.getRegions, (reg: { nom: string }) => reg.nom);
    }
}
