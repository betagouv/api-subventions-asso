type amountsVsProgrammeRegionEntity ={
    // For the moment this concerns only chorus data

        exerciceBudgetaire: number,
        programme: string,
        mission: string | null,
        amount : number,
        // region can contain data about central administration, not only regions
        regionAttachementComptable: string,
}

export default amountsVsProgrammeRegionEntity;